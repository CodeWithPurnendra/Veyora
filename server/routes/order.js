import { Router } from 'express'
import crypto from 'node:crypto'
import pool from '../config/db.js'
import { verifyToken } from '../middleware/auth.js'

const orderRouter = Router()

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/
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

// Builds an error that carries an HTTP status, so the catch block can reply with it
function httpError(status, message) {
  const error = new Error(message)
  error.status = status
  return error
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

export default orderRouter