const express = require('express');
const productsRouter = express.Router();
const Product = require('../models/product');
const redis = require('../utils/redisClient'); // Import your configured Redis client
const { userExtractor, productDataExtractor } = require('../utils/middleware'); // Adjust the path as necessary

// Fetch all products with caching
productsRouter.get('/', async (request, response) => {
  const cacheKey = 'all_products';
  try {
    // Attempt to fetch all products from cache
    let products = await redis.get(cacheKey);
    if (products) {
      console.log('Serving products from cache');
      return response.json(JSON.parse(products));
    }

    // If not in cache, fetch from database and cache it
    products = await Product.find({})
      .sort({ createdAt: -1 })
      .populate('user', { username: 1, name: 1 });

    await redis.set(cacheKey, JSON.stringify(products), { EX: 600 }); // 10 minutes cache
    console.log('Serving products from database and caching');
    response.json(products);
  } catch (error) {
    console.error('Failed to retrieve products:', error);
    response.status(500).json({ message: 'Error fetching products' });
  }
});

// Fetch a specific product by ID with caching
productsRouter.get('/:id', async (request, response) => {
  const { id } = request.params;
  const cacheKey = `product:${id}`;
  try {
    let product = await redis.get(cacheKey);
    if (product) {
      console.log('Serving product from cache');
      return response.json(JSON.parse(product));
    }

    product = await Product.findById(id);
    if (!product) {
      return response.status(404).json({ error: 'Product not found' });
    }

    await redis.set(cacheKey, JSON.stringify(product), { EX: 300 }); // 5 minutes cache
    console.log('Serving product from database and caching');
    response.json(product);
  } catch (error) {
    console.error('Failed to retrieve product:', error);
    response.status(500).json({ message: 'Error fetching product' });
  }
});

// Other routes (POST, PUT, DELETE) remain unchanged
productsRouter.post('/', userExtractor, productDataExtractor, async (request, response) => {
  const newProduct = new Product(request.product);
  const returnProduct = await newProduct.save();
  response.status(201).json(returnProduct);
  // Invalidate or update cache here if necessary
});

productsRouter.delete('/:id', userExtractor, async (request, response) => {
  const deleted = await Product.findByIdAndDelete(request.params.id);
  if (!deleted) {
    return response.status(404).json({ error: 'Invalid product ID' });
  }
  response.status(204).end();
  // Invalidate cache here if necessary
});

module.exports = productsRouter;
