const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// CREATE - Add a new product
router.post('/products', async (req, res) => {
  try {
    const { name, description, price, category, inventory, sku, image } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      inventory,
      sku,
      image
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({
      message: 'Product created successfully',
      product: savedProduct
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// READ - Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().select('-reviews');
    res.status(200).json({
      message: 'Products retrieved successfully',
      products: products
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Get a specific product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({
      message: 'Product retrieved successfully',
      product: product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Update product details
router.put('/products/:id', async (req, res) => {
  try {
    const { name, description, price, category, inventory, sku, image } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        category,
        inventory,
        sku,
        image,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE - Remove a product
router.delete('/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product deleted successfully',
      product: deletedProduct
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADD REVIEW - Add a review to a product
router.post('/products/:id/reviews', async (req, res) => {
  try {
    const { userId, rating, comment } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = {
      userId,
      rating,
      comment,
      createdAt: Date.now()
    };

    product.reviews.push(review);
    const updatedProduct = await product.save();

    res.status(201).json({
      message: 'Review added successfully',
      product: updatedProduct
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET REVIEWS - Get all reviews for a product
router.get('/products/:id/reviews', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      message: 'Reviews retrieved successfully',
      reviews: product.reviews
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
