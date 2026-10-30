import jwt from 'jsonwebtoken'

export function verifyToken(req, res, next) {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.split(' ')[1] : null

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authenticated' })
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] })
    next()
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' })
  }
}