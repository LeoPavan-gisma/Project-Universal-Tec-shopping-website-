const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        // If MongoDB not connected, return a mock user for local dev
        if (mongoose.connection.readyState !== 1) {
            const mockUser = { id: 'mock-id-' + Date.now(), name, email, role: role || 'customer' };
            const token = jwt.sign({ id: mockUser.id, role: mockUser.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
            return res.status(201).json({ token, user: mockUser });
        }
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already registered' });
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const user = new User({ name, email, passwordHash, role: role || 'customer' });
        await user.save();
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // If MongoDB not connected, accept known mock credentials for local dev
        if (mongoose.connection.readyState !== 1) {
            // Accept admin@dev and user@dev with password 'password'
            if ((email === 'admin@dev' || email === 'user@dev') && password === 'password') {
                const mockUser = { id: email === 'admin@dev' ? 'mock-admin' : 'mock-user', name: email.split('@')[0], email, role: email === 'admin@dev' ? 'admin' : 'customer' };
                const token = jwt.sign({ id: mockUser.id, role: mockUser.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
                return res.json({ token, user: mockUser });
            }
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
    try {
        // If MongoDB not connected, return mock users
        if (mongoose.connection.readyState !== 1) {
            const mockUsers = [
                { id: 'mock-admin', name: 'Admin User', email: 'admin@dev', role: 'admin', createdAt: new Date() },
                { id: 'mock-user', name: 'Test User', email: 'user@dev', role: 'customer', createdAt: new Date() }
            ];
            return res.json(mockUsers);
        }
        
        const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error('Get users error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
