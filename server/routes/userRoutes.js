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
import User from '../models/User.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/', createUser);
router.post('/init', createInitialUser);

router.get('/username/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      _id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      email: user.email,
      phone: user.phone
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', authenticateToken, getAllUsers);
router.get('/:username', authenticateToken, getUser);
router.put('/:username', authenticateToken, updateUser);
router.patch('/:username/password', authenticateToken, changePassword);

router.get('/me', authenticateToken, async (req, res) => {
  try {
    console.log('GET /me endpoint called');
    console.log('Authenticated user ID:', req.user._id);
    res.json(req.user);
  } catch (error) {
    console.error('Get user error:', error.message);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
