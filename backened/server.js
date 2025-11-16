const express = require('express');
const cors = require('cors');
const path = require('path');
// Load environment variables from .env file in the current directory
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Database initialization (Knex/SQLite)
const knex = require('knex');
const db = knex({
  client: 'sqlite3',
  connection: {
    // Uses the DATABASE_FILE path from .env, or defaults
    filename: process.env.DATABASE_FILE || path.join(__dirname, 'db', 'sweets.sqlite'),
  },
  useNullAsDefault: true,
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows cross-origin requests from the frontend
app.use(express.json()); // Parses incoming JSON requests

// Attach database connection object (db) to the request object for use in routes
app.use((req, res, next) => {
    req.db = db;
    next();
});

// Import and use routes. Paths are relative to server.js's location.
const authRoutes = require('./routes/auth');
const sweetRoutes = require('./routes/sweets');
const profileRoutes = require('./routes/profile');

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);
app.use('/api/profile', profileRoutes); // <-- THIS LINE IS ESSENTIAL

// Simple health check endpoint
app.get('/', (req, res) => {
    res.send('Sweet Shop API is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something broke!' });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Base URL: http://localhost:${PORT}/api`);
});