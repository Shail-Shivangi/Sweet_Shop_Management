const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const authRoutes = require('../routes/auth');
const { testDb, setupTestDb } = require('../db/testSetup');
process.env.JWT_SECRET = 'JSWEBTOKENLOGIN443'; 
// Create a minimal Express app for testing and attach the test database
const app = express();
app.use(express.json());
app.use((req, res, next) => {
    req.db = testDb;
    next();
});
app.use('/api/auth', authRoutes);

// Test variables
const adminEmail = 'testadmin@shop.com';
const userEmail = 'testuser@shop.com';
const password = 'password123';
let adminToken;

beforeAll(async () => {
    // 1. Set up the in-memory database tables
    await setupTestDb(); 

    // 2. Insert test admin and user for login tests
    const adminPasswordHash = await bcrypt.hash(password, 10);
    await testDb('users').insert([
        { name: 'Admin', email: adminEmail, password_hash: adminPasswordHash, role: 'admin' },
        { name: 'User', email: userEmail, password_hash: adminPasswordHash, role: 'user' }
    ]);
});

// Clean up after tests are done
afterAll(async () => {
    await testDb.destroy();
});

describe('POST /api/auth/register', () => {
    const newUser = {
        name: 'Alice',
        email: 'alice@test.com',
        mobile: '9876543210', // ADDED MOBILE
        password: 'password123',
    };
    
    it('should register a new user successfully', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send(newUser);

        // EXPECTED 201
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('token');
        expect(response.body.user.email).toBe('alice@test.com');
        expect(response.body.user.mobile).toBe('9876543210'); // CHECK MOBILE FIELD
        expect(response.body.user.role).toBe('user');
    });

    it('should return 400 if user email already exists', async () => {
        // First register the user
        await request(app).post('/api/auth/register').send(newUser); 

        // Try to register again
        const response = await request(app)
            .post('/api/auth/register')
            .send(newUser);

        // EXPECTED 400 with the correct message
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('User already exists'); 
    });
});

describe('POST /api/auth/login', () => {
    it('should log in a standard user and return a token', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: userEmail, password });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body.user.email).toBe(userEmail);
    });

    it('should log in an admin user and return a token', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: adminEmail, password });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body.user.email).toBe(adminEmail);
        adminToken = response.body.token; // Save token for protected routes
    });

    it('should return 401 for invalid password', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: userEmail, password: 'wrongpassword' });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Invalid credentials');
    });
});