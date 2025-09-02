import express from 'express';
import {
  createUser,
  getAllUsers,
  createInitialUser,
  getUser,
  updateUser,
  changePassword,
  loginUser
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', loginUser);
router.post('/', createUser);
router.post('/init', createInitialUser);

// Protected routes (require authentication)
router.get('/', authenticateToken, getAllUsers);
router.get('/:username', authenticateToken, getUser);
router.put('/:username', authenticateToken, updateUser);
router.patch('/:username/password', authenticateToken, changePassword);

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    console.log('GET /me endpoint called');
    console.log('Authenticated user ID:', req.user._id);
    
    // Return the user object (already has password removed by middleware)
    res.json(req.user);
    
  } catch (error) {
    console.error('Get user error:', error.message);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;