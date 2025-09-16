import express from 'express';
import Transaction from '../models/Transaction.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/user', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching transactions for user:', req.user._id);
    const transactions = await Transaction.find({
      $or: [{ buyerUserId: req.user._id }, { sellerUserId: req.user._id }]
    })
      .sort({ createdAt: -1 })
      .lean();
    console.log(`Found ${transactions.length} transactions for user ${req.user.username}`);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server error while fetching transactions' });
  }
});

router.get('/user/buying', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching buying transactions for user:', req.user._id);
    const transactions = await Transaction.find({ buyerUserId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    console.log(`Found ${transactions.length} buying transactions for user ${req.user.username}`);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching buying transactions:', error);
    res.status(500).json({ message: 'Server error while fetching buying transactions' });
  }
});

router.get('/user/selling', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching selling transactions for user:', req.user._id);
    const transactions = await Transaction.find({ sellerUserId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    console.log(`Found ${transactions.length} selling transactions for user ${req.user.username}`);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching selling transactions:', error);
    res.status(500).json({ message: 'Server error while fetching selling transactions' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log('Creating new transaction for user:', req.user._id);
    console.log('Transaction data:', req.body);

    const { productName, productPrice, quantity, buyerLocation, sellerUserId, sellerUsername } = req.body;

    if (!productName || !productPrice || !quantity || !buyerLocation || !sellerUserId || !sellerUsername) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const totalPrice = productPrice * quantity;
    const transaction = new Transaction({
      productName,
      productPrice,
      quantity,
      totalPrice,
      buyerUserId: req.user._id,
      buyerUsername: req.user.username,
      buyerLocation,
      sellerUserId,
      sellerUsername,
      status: 'pending'
    });

    await transaction.save();
    console.log('Transaction created successfully:', transaction._id);
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Server error while creating transaction' });
  }
});

router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log('Updating transaction status:', { id, status, userId: req.user._id });

    if (!['pending', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const transaction = await Transaction.findById(id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    const isBuyer = transaction.buyerUserId.toString() === req.user._id.toString();
    const isSeller = transaction.sellerUserId.toString() === req.user._id.toString();
    if (!isBuyer && !isSeller) return res.status(403).json({ message: 'Not authorized to update this transaction' });

    if (status === 'completed' && !isSeller) return res.status(403).json({ message: 'Only the seller can mark this transaction as completed' });

    transaction.status = status;
    await transaction.save();
    console.log('Transaction status updated successfully:', id);
    res.json(transaction);
  } catch (error) {
    console.error('Error updating transaction status:', error);
    res.status(500).json({ message: 'Server error while updating transaction status' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching transaction by ID:', id);

    const transaction = await Transaction.findById(id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    const isBuyer = transaction.buyerUserId.toString() === req.user._id.toString();
    const isSeller = transaction.sellerUserId.toString() === req.user._id.toString();
    if (!isBuyer && !isSeller) return res.status(403).json({ message: 'Not authorized to view this transaction' });

    console.log('Transaction found:', id);
    res.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ message: 'Server error while fetching transaction' });
  }
});

export default router;
