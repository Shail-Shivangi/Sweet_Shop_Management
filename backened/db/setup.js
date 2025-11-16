// db/setup.js

const knex = require('knex');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load environment variables from the parent directory's .env file
// The path goes up one level ('..') to find the .env file in the 'backend' folder
require('dotenv').config({ path: path.join(__dirname, '..', '.env') }); 

const db = knex({
  client: 'sqlite3',
  connection: {
    // Correctly uses the DATABASE_FILE path from the .env file
    filename: process.env.DATABASE_FILE || path.join(__dirname, 'sweets.sqlite'),
  },
  useNullAsDefault: true,
});

// IMPORTANT: This path must correctly point to the sweets.json file.
// Assuming 'backend' and 'frontend' are siblings, we go up one level, into 'frontend', then into 'src/data'.
const sweetsData = require(
    path.join(process.cwd(), '..', 'frontend','incubyte', 'src', 'data', 'sweets.json')
).sweets;
async function setupDatabase() {
  try {
    // Create 'users' table
    if (!(await db.schema.hasTable('users'))) {
      await db.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('email').unique().notNullable();
        table.string('mobile').nullable(); // ADDED: Mobile column
        table.string('password_hash').notNullable();
        table.enum('role', ['user', 'admin']).notNullable().defaultTo('user');
      });
      console.log('Created users table');
    }
    
    // Create 'sweets' table
    if (!(await db.schema.hasTable('sweets'))) {
      await db.schema.createTable('sweets', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('category').notNullable();
        table.float('price').notNullable();
        table.integer('quantity').notNullable();
        table.string('image').nullable();
        table.text('description').nullable();
      });
      console.log('Created sweets table');

      // Seed data
      await db('sweets').insert(sweetsData);
      console.log('Seeded sweets data');
    }
    
    // NEW: Create 'purchase_history' table
    if (!(await db.schema.hasTable('purchase_history'))) {
      await db.schema.createTable('purchase_history', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.integer('sweet_id').unsigned().notNullable().references('id').inTable('sweets').onDelete('RESTRICT');
        table.integer('quantity').notNullable();
        table.timestamp('purchase_date').defaultTo(db.fn.now());
      });
      console.log('Created purchase_history table');
    }
    
    // Seed an admin user (password 'admin')
    const adminExists = await db('users').where({ email: 'admin@shop.com' }).first();
    if (!adminExists) {
      const adminPasswordHash = await bcrypt.hash('admin', 10);
      await db('users').insert({
          name: 'Admin User',
          email: 'admin@shop.com',
          mobile: '1234567890', // Default mobile for admin
          password_hash: adminPasswordHash,
          role: 'admin'
      });
      console.log('Seeded admin user (admin@shop.com / admin)');
    }
    
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await db.destroy();
  }
}

setupDatabase();