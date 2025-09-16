import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('🔐 Decoded JWT token:', decoded);
    console.log('🔍 Looking for user with ID:', decoded.userId);
    
    const user = await User.findById(decoded.userId).select('-password -__v');
    
    if (!user) {
      console.log('❌ User not found with ID:', decoded.userId);
      return res.status(401).json({ message: 'Token is not valid.' });
    }

    console.log('✅ User found:', user.username);
    req.user = user;
    next();
  } catch (error) {
    console.error('❌ JWT verification error:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired.' });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    
    res.status(401).json({ message: 'Token is not valid.' });
  }
};

export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};
