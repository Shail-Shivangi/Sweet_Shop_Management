const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth'); 

// GET /api/profile/history - Fetch the current user's purchase history (Protected)
router.get('/history', protect, async (req, res) => {
    const db = req.db;
    // Get user ID which was attached to the request by the protect middleware
    const userId = req.user.id; 

    try {
        // Fetch history, joining with sweets table to get sweet details (name, image)
        const history = await db('purchase_history')
            .join('sweets', 'purchase_history.sweet_id', '=', 'sweets.id')
            .where('user_id', userId)
            .select(
                'purchase_history.sweet_id as id',
                'purchase_history.quantity as purchased_quantity',
                'purchase_history.purchase_date',
                'sweets.name',
                'sweets.image',
                'sweets.price'
            )
            .orderBy('purchase_history.purchase_date', 'desc');

        res.json(history);
    } catch (error) {
        // Log the server error and send a generic 500 response
        console.error('Error fetching purchase history:', error);
        res.status(500).json({ message: 'Error fetching purchase history' });
    }
});

module.exports = router;