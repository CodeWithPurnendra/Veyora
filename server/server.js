import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import pool from './config/db.js';
import productRouter from './routes/products.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/products', productRouter);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' })
})
app.get('/api/db-test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()')
        res.json(result.rows[0])
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database connection failed' })
    }
})
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})