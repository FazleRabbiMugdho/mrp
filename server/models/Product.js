import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    discount: { type: String },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    imageUrl: { type: String },
    city: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
