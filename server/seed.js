import 'dotenv/config'
import pool from './config/db.js';

const products = [
    {
        name: 'Minimal Leather Backpack',
        price: 89.99,
        category: 'Bags',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
        description: 'A clean, durable backpack for daily use.',
        rating: 4.8,
        stock: 12,
    },
    {
        name: 'Wireless Headphones',
        price: 129.0,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
        description: 'Noise-cancelling with 30-hour battery life.',
        rating: 4.7,
        stock: 8,
    },
    {
        name: 'Classic Wrist Watch',
        price: 199.5,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
        description: 'Stainless steel watch with a minimalist dial.',
        rating: 4.9,
        stock: 5,
    },
    {
        name: 'Running Sneakers',
        price: 74.0,
        category: 'Footwear',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
        description: 'Lightweight sneakers built for all-day comfort.',
        rating: 4.5,
        stock: 20,
    },
    {
        name: 'Polarized Sunglasses',
        price: 59.0,
        category: 'Accessories',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600',
        description: 'UV400 protection with a lightweight frame.',
        rating: 4.4,
        stock: 15,
    },
    {
        name: 'Ceramic Coffee Mug',
        price: 18.5,
        category: 'Home',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600',
        description: 'Handmade matte mug that keeps drinks warm.',
        rating: 4.6,
        stock: 40,
    },
    {
        name: 'Smart Fitness Band',
        price: 49.99,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600',
        description: 'Tracks steps, sleep, and heart rate all week.',
        rating: 4.3,
        stock: 3,
    },
    {
        name: 'Canvas Tote Bag',
        price: 24.0,
        category: 'Bags',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600',
        description: 'Sturdy everyday tote with an inner pocket.',
        rating: 4.2,
        stock: 25,
    },
]

async function seed() {
    try {
        await pool.query('DELETE FROM products');
        await pool.query('ALTER SEQUENCE products_id_seq RESTART WITH 1');
        for (const product of products) {
            await pool.query(
                'INSERT INTO products (name, price, category, image, description, rating, stock) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                [
                    product.name,
                    product.price,
                    product.category,
                    product.image,
                    product.description,
                    product.rating,
                    product.stock,
                ]
            )
        }
        console.log('Products seeded')
    } catch (error) {
        console.error(error);
    } finally {
        pool.end()
    }
}

seed()