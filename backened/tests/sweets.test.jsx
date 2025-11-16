const request = require('supertest');
const express = require('express');
const sweetsRoutes = require('../routes/sweets');
const authMiddleware = require('../middleware/auth');
const { testDb, setupTestDb } = require('../db/testSetup');
const jwt = require('jsonwebtoken');

// Mock JWT Secret for token generation
process.env.JWT_SECRET = 'test_secret'; 

// Create tokens for testing protected routes
const adminToken = jwt.sign({ id: 1, email: 'admin@shop.com', role: 'admin' }, process.env.JWT_SECRET);
const userToken = jwt.sign({ id: 2, email: 'user@shop.com', role: 'user' }, process.env.JWT_SECRET);
const invalidToken = 'invalid.token.here';

// --- Minimal Express App Setup ---
const app = express();
app.use(express.json());
app.use((req, res, next) => {
    // Attach test database and user data via mock middleware
    req.db = testDb;
    // Note: We use the actual middleware on the routes, but we simulate a login context here if needed.
    next();
});
// Use the actual authentication middleware on the router
app.use('/api/sweets', sweetsRoutes); 

let sweetId; 

beforeAll(async () => {
    // 1. Set up tables (needed again as this test runs independently)
    await setupTestDb();
    
    // 2. Insert initial data (requires fresh setup)
    const [id] = await testDb('sweets').insert({
        name: 'Test Sweet', 
        category: 'Test', 
        price: 100, 
        quantity: 5
    });
    sweetId = id;

    // 3. Insert test users
    await testDb('users').insert([
        { id: 1, name: 'Admin', email: 'admin@shop.com', password_hash: 'hash', role: 'admin' },
        { id: 2, name: 'User', email: 'user@shop.com', password_hash: 'hash', role: 'user' }
    ]);
});

afterAll(async () => {
    await testDb.destroy();
});

describe('GET /api/sweets/search', () => {
    it('should fetch all sweets and allow searching', async () => {
        const response = await request(app).get('/api/sweets/search?q=Test');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0].name).toBe('Test Sweet');
    });
});

describe('Sweet Management (Admin only)', () => {
    // POST /api/sweets (Add)
    it('should allow admin to add a new sweet', async () => {
        const newSweet = { name: 'New Sweet', category: 'New', price: 50, quantity: 10 };
        const response = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(newSweet);

        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe('New Sweet');
    });

    // PUT /api/sweets/:id (Update)
    it('should allow admin to update a sweet', async () => {
        const updatePayload = { price: 150 };
        const response = await request(app)
            .put(`/api/sweets/${sweetId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send(updatePayload);

        expect(response.statusCode).toBe(200);
        expect(response.body.price).toBe(150);
    });

    // DELETE /api/sweets/:id (Delete - Admin only)
    it('should prevent standard user from deleting a sweet', async () => {
        const response = await request(app)
            .delete(`/api/sweets/${sweetId}`)
            .set('Authorization', `Bearer ${userToken}`);
        
        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('Not authorized as an admin');
    });

    it('should allow admin to delete a sweet', async () => {
        const response = await request(app)
            .delete(`/api/sweets/${sweetId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(response.statusCode).toBe(204);

        // Verify it's deleted
        const check = await request(app).get(`/api/sweets/search?q=Test`);
        expect(check.body.length).toBe(0);
    });
});

describe('Inventory Management', () => {
    let inventorySweetId;
    beforeEach(async () => {
        const [id] = await testDb('sweets').insert({ name: 'Inv Sweet', category: 'Inv', price: 10, quantity: 20 });
        inventorySweetId = id;
    });
    it('should allow user to purchase a sweet and decrement quantity', async () => {
        // Purchase 5 units of sweet ID 3 (Kaju Katli, initial quantity 20)
        const response = await request(app)
            .post('/api/sweets/3/purchase')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ quantity: 5 });

        // EXPECTED 200 (Now passes because the purchase_history table exists)
        expect(response.statusCode).toBe(200); 
        // Quantity should be 20 - 5 = 15
        expect(response.body.quantity).toBe(15);
    });

    // POST /api/sweets/:id/purchase (Protected)
    it('should allow user to purchase a sweet and decrement quantity', async () => {
        const response = await request(app)
            .post(`/api/sweets/${inventorySweetId}/purchase`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ quantity: 5 });

        expect(response.statusCode).toBe(200);
        expect(response.body.quantity).toBe(15);
    });

    it('should return 400 for insufficient stock during purchase', async () => {
        const response = await request(app)
            .post(`/api/sweets/${inventorySweetId}/purchase`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ quantity: 100 });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('Insufficient stock');
    });

    // POST /api/sweets/:id/restock (Admin only)
    it('should prevent standard user from restocking a sweet', async () => {
        const response = await request(app)
            .post(`/api/sweets/${inventorySweetId}/restock`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ quantity: 10 });

        expect(response.statusCode).toBe(403);
    });

    it('should allow admin to restock a sweet and increment quantity', async () => {
        const response = await request(app)
            .post(`/api/sweets/${inventorySweetId}/restock`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ quantity: 50 });

        expect(response.statusCode).toBe(200);
        // Original quantity was 20, should now be 70
        expect(response.body.quantity).toBe(70); 
    });
});