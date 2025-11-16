const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password, mobile } = req.body; // UPDATED: Added mobile
    const db = req.db;

    if (!name || !email || !password || !mobile) { // UPDATED: Check for mobile
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        const userExists = await db('users').where({ email }).first();

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        const role = email === "admin@shop.com" ? "admin" : "user";

        // UPDATED: Insert mobile number into the database
        const [id] = await db('users').insert({ name, email, mobile, password_hash, role });
        const newUser = { id, name, email, mobile, role }; // UPDATED: Return mobile in user object

        res.status(201).json({
            user: newUser,
            token: generateToken(newUser),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const db = req.db;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        const user = await db('users').where({ email }).first();

        if (user && (await bcrypt.compare(password, user.password_hash))) {
            const userData = { id: user.id, name: user.name, email: user.email, role: user.role };
            res.json({
                user: userData,
                token: generateToken(userData),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;