import { Router } from 'express'
import crypto from 'node:crypto'
import pool from '../config/db.js'
import { verifyToken } from '../middleware/auth.js'

const orderRouter = Router()

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/
const ORDER_NUMBER_PATTERN = /^VEY-[0-9A-F]{6}$/
const PAYMENT_METHODS = ['card', 'cod']
const MAX_LINES = 50
const MAX_QUANTITY = 20

// Money is handled in whole cents to avoid floating point errors
const FREE_SHIPPING_CENTS = 5000
const SHIPPING_FEE_CENTS = 599

const SHIPPING_FIELDS = {
  fullName: 100,
  email: 255,
  phone: 30,
  address: 255,
  city: 100,
  postalCode: 20,
}

// The columns we read from the orders table (money cast to numbers).
// This is a fixed string, never built from user input.
const ORDER_COLUMNS = `id, order_number, full_name, email, phone, address, city, postal_code,
  subtotal::float, shipping::float, total::float,
  payment_method, payment_status, status, created_at`

// Builds an error that carries an HTTP status, so the catch block can reply with it
function httpError(status, message) {
  const error = new Error(message)
  error.status = status
  return error
}

// Turns one orders row plus its items into the object we send to the browser.
// The shape matches the order returned when an order is created.
function formatOrder(order, items) {
  return {
    orderNumber: order.order_number,
    createdAt: order.created_at,
    status: order.status,
    paymentStatus: order.payment_status,
    paymentMethod: order.payment_method,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    shippingDetails: {
      fullName: order.full_name,
      email: order.email,
      phone: order.phone,
      address: order.address,
      city: order.city,
      postalCode: order.postal_code,
    },
    items: items.map((item) => ({
      productId: item.product_id,
      name: item.name,
      image: item.image,
      quantity: item.quantity,
      price: item.price,
    })),
  }
}

// Loads the items for several orders at once, grouped by order id
async function fetchItemsByOrder(orderIds) {
  const { rows } = await pool.query(
    `SELECT order_id, product_id, name, price::float, quantity, image
     FROM order_items
     WHERE order_id = ANY($1::int[])
     ORDER BY id`,
    [orderIds]
  )

  const grouped = new Map()

  for (const row of rows) {
    if (!grouped.has(row.order_id)) grouped.set(row.order_id, [])
    grouped.get(row.order_id).push(row)
  }

  return grouped
}

// Checks the request body. Returns { error } or the cleaned-up order data.
function validateOrder(body) {
  const { items, shipping, paymentMethod } = body ?? {}

  // --- Items ---
  if (!Array.isArray(items) || items.length === 0) {
    return { error: 'Your order must contain at least one item' }
  }
  if (items.length > MAX_LINES) {
    return { error: `An order can contain at most ${MAX_LINES} lines` }
  }

  // Merge duplicates: the same product twice becomes one line with added quantities
  const quantities = new Map()

  for (const [index, item] of items.entries()) {
    const productId = item?.productId
    const quantity = item?.quantity

    if (!Number.isInteger(productId) || productId < 1) {
      return { error: `Item ${index + 1} has an invalid product` }
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      return { error: `Item ${index + 1} has an invalid quantity` }
    }

    quantities.set(productId, (quantities.get(productId) ?? 0) + quantity)
  }

  for (const quantity of quantities.values()) {
    if (quantity > MAX_QUANTITY) {
      return { error: `You can order at most ${MAX_QUANTITY} of one product` }
    }
  }

  // --- Shipping ---
  if (typeof shipping !== 'object' || shipping === null || Array.isArray(shipping)) {
    return { error: 'Shipping details are required' }
  }

  const cleanShipping = {}

  for (const [field, maxLength] of Object.entries(SHIPPING_FIELDS)) {
    const value = shipping[field]

    if (typeof value !== 'string' || !value.trim()) {
      return { error: `Shipping ${field} is required` }
    }

    const trimmed = value.trim()

    if (trimmed.length > maxLength) {
      return { error: `Shipping ${field} is too long` }
    }

    cleanShipping[field] = trimmed
  }

  if (!EMAIL_PATTERN.test(cleanShipping.email)) {
    return { error: 'Please enter a valid email' }
  }

  // --- Payment method ---
  if (!PAYMENT_METHODS.includes(paymentMethod)) {
    return { error: 'Invalid payment method' }
  }

  return {
    items: [...quantities].map(([productId, quantity]) => ({ productId, quantity })),
    shipping: cleanShipping,
    paymentMethod,
  }
}

// Create an order
orderRouter.post('/', verifyToken, async (req, res) => {
  const result = validateOrder(req.body)

  if (result.error) {
    return res.status(400).json({ success: false, message: result.error })
  }

  const { items, shipping, paymentMethod } = result

  let client

  try {
    // A transaction needs one dedicated connection, not pool.query
    client = await pool.connect()
    await client.query('BEGIN')

    // Load the real products and lock their rows until the transaction ends
    const productIds = items.map((item) => item.productId)

    const { rows } = await client.query(
      `SELECT id, name, price::float, stock, image
       FROM products
       WHERE id = ANY($1::int[])
       ORDER BY id
       FOR UPDATE`,
      [productIds]
    )

    const products = new Map(rows.map((product) => [product.id, product]))

    // Check every line against the real data, and add up the money in cents
    const lines = []
    let subtotalCents = 0

    for (const item of items) {
      const product = products.get(item.productId)

      if (!product) {
        throw httpError(404, `Product ${item.productId} does not exist`)
      }
      if (product.stock === 0) {
        throw httpError(409, `${product.name} is out of stock`)
      }
      if (product.stock < item.quantity) {
        throw httpError(409, `Only ${product.stock} of ${product.name} left in stock`)
      }

      const priceCents = Math.round(product.price * 100)
      subtotalCents += priceCents * item.quantity

      lines.push({
        productId: product.id,
        name: product.name,
        image: product.image,
        quantity: item.quantity,
        priceCents,
      })
    }

    const shippingCents = subtotalCents >= FREE_SHIPPING_CENTS ? 0 : SHIPPING_FEE_CENTS
    const totalCents = subtotalCents + shippingCents

    // --- Save the order ---
    const orderNumber = 'VEY-' + crypto.randomBytes(3).toString('hex').toUpperCase()

    const orderResult = await client.query(
      `INSERT INTO orders
         (order_number, user_id, full_name, email, phone, address, city, postal_code,
          subtotal, shipping, total, payment_method)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id, order_number, created_at`,
      [
        orderNumber,
        req.user.id,
        shipping.fullName,
        shipping.email,
        shipping.phone,
        shipping.address,
        shipping.city,
        shipping.postalCode,
        subtotalCents / 100,
        shippingCents / 100,
        totalCents / 100,
        paymentMethod,
      ]
    )

    const order = orderResult.rows[0]

    // --- Save each item (name, price and image are copied from the database) ---
    for (const line of lines) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, name, price, quantity, image)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [order.id, line.productId, line.name, line.priceCents / 100, line.quantity, line.image]
      )
    }

    // --- Reduce the stock ---
    for (const line of lines) {
      await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [
        line.quantity,
        line.productId,
      ])
    }

    // Nothing is permanent until this line runs
    await client.query('COMMIT')

    res.status(201).json({
      success: true,
      order: {
        orderNumber: order.order_number,
        createdAt: order.created_at,
        items: lines.map((line) => ({
          productId: line.productId,
          name: line.name,
          image: line.image,
          quantity: line.quantity,
          price: line.priceCents / 100,
        })),
        subtotal: subtotalCents / 100,
        shipping: shippingCents / 100,
        total: totalCents / 100,
        paymentMethod,
        shippingDetails: shipping,
      },
    })
  } catch (error) {
    if (client) await client.query('ROLLBACK').catch(() => {})

    // Expected problems (missing product, not enough stock) carry their own status
    if (error.status) {
      return res.status(error.status).json({ success: false, message: error.message })
    }

    console.error(error)
    res.status(500).json({ success: false, message: 'Failed to place order' })
  } finally {
    client?.release()
  }
})

// List the logged-in person's orders, newest first
orderRouter.get('/', verifyToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT ${ORDER_COLUMNS}
       FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [req.user.id]
    )

    // No orders yet is a normal result, not an error
    if (rows.length === 0) {
      return res.json({ success: true, orders: [] })
    }

    const itemsByOrder = await fetchItemsByOrder(rows.map((order) => order.id))

    res.json({
      success: true,
      orders: rows.map((order) => formatOrder(order, itemsByOrder.get(order.id) ?? [])),
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Failed to load orders' })
  }
})

// Show one of the logged-in person's orders
orderRouter.get('/:orderNumber', verifyToken, async (req, res) => {
  try {
    const { orderNumber } = req.params

    // Anything that can't be an order number is simply "not found"
    if (!ORDER_NUMBER_PATTERN.test(orderNumber)) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    // The user_id condition makes sure people can only see their OWN orders.
    // Someone else's order looks exactly like one that doesn't exist (404).
    const { rows } = await pool.query(
      `SELECT ${ORDER_COLUMNS}
       FROM orders
       WHERE order_number = $1 AND user_id = $2`,
      [orderNumber, req.user.id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }

    const order = rows[0]
    const itemsByOrder = await fetchItemsByOrder([order.id])

    res.json({
      success: true,
      order: formatOrder(order, itemsByOrder.get(order.id) ?? []),
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Failed to load order' })
  }
})

export default orderRouter