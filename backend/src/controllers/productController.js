const Product = require('../models/Product');
const mongoose = require('mongoose');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        // If MongoDB is not connected, return mock data quickly to avoid timeouts
        if (mongoose.connection.readyState !== 1) {
            const mock = [
                { _id: '1', title: 'Laptop', price: 999, imageUrl: 'https://images.unsplash.com/photo-1588072294919-e5d1f8b8d3d5' },
                { _id: '2', title: 'Smartphone', price: 599, imageUrl: 'https://images.unsplash.com/photo-1511707267537-b85faf00021e' }
            ];
            return res.json(mock);
        }

        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            // return mock product when DB is down
            if (req.params.id === '1') return res.json({ _id: '1', title: 'Laptop', price: 999, imageUrl: 'https://images.unsplash.com/photo-1588072294919-e5d1f8b8d3d5', description: 'Demo laptop' });
            return res.status(404).json({ message: 'Product not found (mock)' });
        }

        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Admin
const createProduct = async (req, res) => {
    try {
        const { title, description, price, category, imageUrl, stock } = req.body;
        const product = new Product({ title, description, price, category, imageUrl, stock: stock || 0 });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const { title, description, price, category, imageUrl, stock } = req.body;
        product.title = title ?? product.title;
        product.description = description ?? product.description;
        product.price = price ?? product.price;
        product.category = category ?? product.category;
        product.imageUrl = imageUrl ?? product.imageUrl;
        product.stock = typeof stock === 'number' ? stock : product.stock;

        await product.save();
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        await product.remove();
        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
