import express from "express";
import { createProduct, getProducts, getProduct } from "../controllers/productController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);

router.post("/", authenticateToken, createProduct);

export default router;
