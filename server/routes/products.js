import { Router } from "express";
import pool from "../config/db.js";

const productRouter = Router();

productRouter.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
  SELECT id, name, description, price::float, category, image, rating::float, stock, created_at
  FROM products
  ORDER BY id ASC
`)
        res.status(200).json({
            success: true,
            count: result.rowCount,
            data: result.rows
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to get products' });
    }
})

productRouter.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)

        if (!Number.isInteger(id)) {
            return res.status(400).json({ success: false, message: 'Id must be a whole number' })
        }

        const result = await pool.query(
            `SELECT id, name, description, price::float, category, image, rating::float, stock, created_at
       FROM products
       WHERE id = $1`,
            [id]
        )

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Product not found' })
        }

        res.status(200).json({
            success: true,
            data: result.rows[0],
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: 'Failed to get product' })
    }
})
export default productRouter;