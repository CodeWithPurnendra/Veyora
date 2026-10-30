import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../config/db.js'
import { verifyToken } from '../middleware/auth.js'

const authRouter = Router()

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )
}

// Register
authRouter.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body ?? {}

    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' })
    }

    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()

    if (!cleanName) {
      return res.status(400).json({ success: false, message: 'Name is required' })
    }
    if (!EMAIL_PATTERN.test(cleanEmail)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email' })
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' })
    }

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [cleanEmail])
    if (existing.rowCount > 0) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, role`,
      [cleanName, cleanEmail, passwordHash]
    )

    const user = result.rows[0]

    res.status(201).json({ success: true, token: signToken(user), user })
  } catch (error) {
    // 23505 = unique violation (two people registered the same email at once)
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' })
    }
    console.error(error)
    res.status(500).json({ success: false, message: 'Server error during registration' })
  }
})

// Login
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body ?? {}

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ success: false, message: 'Email and password are required' })
    }

    const cleanEmail = email.trim().toLowerCase()

    const result = await pool.query(
      'SELECT id, name, email, role, password_hash FROM users WHERE email = $1',
      [cleanEmail]
    )

    // Same message for "no such user" and "wrong password", so attackers can't tell which emails exist
    if (result.rowCount === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    const row = result.rows[0]
    const matches = await bcrypt.compare(password, row.password_hash)

    if (!matches) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    const user = { id: row.id, name: row.name, email: row.email, role: row.role }

    res.json({ success: true, token: signToken(user), user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Server error during login' })
  }
})

// Current user (protected)
authRouter.get('/profile', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.json({ success: true, user: result.rows[0] })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Server error fetching profile' })
  }
})

export default authRouter