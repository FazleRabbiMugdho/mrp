import express from 'express';
import {
  createUser,
  getAllUsers,
  createInitialUser,
  getUser,
  updateUser,
  changePassword
} from '../controllers/userController.js';

const router = express.Router();

router.get('/', getAllUsers);
router.post('/', createUser);
router.post('/init', createInitialUser);
router.get('/:username', getUser);
router.put('/:username', updateUser);
router.patch('/:username/password', changePassword);

export default router;