const express = require('express');
const router = express.Router();
// This is the correct relative path to get the middleware from the 'middleware' folder:
const { protect, admin } = require('../middleware/auth'); 

// GET /api/sweets/search - Search for sweets by name, category, or price range.
// (Unprotected for public view)
router.get('/search', async (req, res) => {
    const { q, category, min, max } = req.query;
    const db = req.db;

    try {
        let query = db('sweets');

        // Search by name (case-insensitive contains)
        if (q) {
            query = query.where('name', 'like', `%${q}%`);
        }

        // Search by category
        if (category) {
            query = query.where({ category });
        }

        // Price range
        if (min) {
            query = query.where('price', '>=', Number(min));
        }
        if (max) {
            query = query.where('price', '<=', Number(max));
        }

        const sweets = await query.select('*');
        res.json(sweets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching sweets' });
    }
});

// GET /api/sweets - Redirect to /search for frontend compatibility
router.get('/', (req, res) => {
    res.redirect('/api/sweets/search');
});

// POST /api/sweets - Add a new sweet (Protected)
router.post('/', protect, async (req, res) => {
    const newSweet = req.body;
    try {
        const [id] = await req.db('sweets').insert(newSweet);
        const sweet = await req.db('sweets').where({ id }).first();
        res.status(201).json(sweet);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding sweet' });
    }
});

// PUT /api/sweets/:id - Update a sweet's details (Protected)
router.put('/:id', protect, async (req, res) => {
    const id = req.params.id;
    const updatePayload = req.body;
    delete updatePayload.id; 

    try {
        const count = await req.db('sweets').where({ id }).update(updatePayload);
        if (count === 0) {
            return res.status(404).json({ message: 'Sweet not found' });
        }
        const updatedSweet = await req.db('sweets').where({ id }).first();
        res.json(updatedSweet);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating sweet' });
    }
});

// DELETE /api/sweets/:id - Delete a sweet (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
    const id = req.params.id;
    try {
        const count = await req.db('sweets').where({ id }).del();
        if (count === 0) {
            return res.status(404).json({ message: 'Sweet not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting sweet' });
    }
});

// POST /api/sweets/:id/purchase - Purchase a sweet, decreasing its quantity (Protected)
router.post('/:id/purchase', protect, async (req, res) => {
    const id = req.params.id;
    const { quantity } = req.body;
    const qty = Number(quantity) || 1;
    const userId = req.user.id; // Get user ID from middleware

    try {
        const sweet = await req.db('sweets').where({ id }).first();

        if (!sweet) {
            return res.status(404).json({ message: 'Sweet not found' });
        }

        if (sweet.quantity < qty) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        // 1. Update Inventory
        const newQuantity = sweet.quantity - qty;
        await req.db('sweets').where({ id }).update({ quantity: newQuantity });
        
        // 2. Record Purchase History (NEW)
        await req.db('purchase_history').insert({
            user_id: userId,
            sweet_id: id,
            quantity: qty,
        });
        
        // 3. Return updated sweet
        const updatedSweet = await req.db('sweets').where({ id }).first();
        res.json(updatedSweet);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing purchase' });
    }
});
// POST /api/sweets/:id/restock - Restock a sweet, increasing its quantity (Admin only)
router.post('/:id/restock', protect, admin, async (req, res) => {
    const id = req.params.id;
    const { quantity } = req.body;
    const qty = Number(quantity) || 10;

    try {
        const sweet = await req.db('sweets').where({ id }).first();

        if (!sweet) {
            return res.status(404).json({ message: 'Sweet not found' });
        }

        const newQuantity = sweet.quantity + qty;
        await req.db('sweets').where({ id }).update({ quantity: newQuantity });
        
        const updatedSweet = await req.db('sweets').where({ id }).first();
        res.json(updatedSweet);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing restock' });
    }
});

module.exports = router;