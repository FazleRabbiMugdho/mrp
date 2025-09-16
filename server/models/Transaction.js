import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  productPrice: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  buyerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  buyerUsername: {
    type: String,
    required: true
  },
  buyerLocation: {
    type: String,
    required: true
  },
  sellerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerUsername: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

transactionSchema.index({ buyerUserId: 1, createdAt: -1 });
transactionSchema.index({ sellerUserId: 1, createdAt: -1 });
transactionSchema.index({ status: 1 });

export default mongoose.model('Transaction', transactionSchema);