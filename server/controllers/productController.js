import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const { title, price, imageUrl, city, description, discount } = req.body;

    if (!title || !price || !city) {
      return res.status(400).json({ error: "Title, price, and city are required" });
    }

    const product = new Product({
      title,
      price,
      imageUrl,
      city,
      description,
      discount,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      error: "Failed to create product",
      details: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { city } = req.query;
    let filter = {};

    if (city) {
      filter.city = new RegExp(`^${city}$`, "i"); 
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch products",
      details: error.message,
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch product",
      details: error.message,
    });
  }
};
