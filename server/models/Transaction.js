import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  productName: String,
  productPrice: Number,
  quantity: Number,
  totalPrice: Number,
  buyerUserId: String,
  buyerUsername: String,
  buyerLocation: String,
  sellerUserId: String,
  sellerUsername: String,
  status: String,
  createdAt: Date,
  updatedAt: Date
});

export default mongoose.model('Transaction', transactionSchema);