import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./database/db.js";
import userRoutes from "./routes/userRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "MRP Server API",
    status: "Connected to MongoDB Atlas",
    database: process.env.MONGO_URI ? "MongoDB Atlas" : "Not Connected",
    endpoints: {
      getAllUsers: "GET /api/users",
      createUser: "POST /api/users",
      createInitialUser: "POST /api/users/init",
      getUserByUsername: "GET /api/users/:username",
      updateUser: "PUT /api/users/:username",
      changePassword: "PATCH /api/users/:username/password",
      loginUser: "POST /api/users/login",
      createTransaction: "POST /api/transactions",
      getTransactions: "GET /api/transactions",
      getProducts: "GET /api/products?city=CityName",
      getProductById: "GET /api/products/:id",
      createProduct: "POST /api/products",
    },
  });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found", path: req.path });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
