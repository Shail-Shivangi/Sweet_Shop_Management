// db/testSetup.js

const knex = require('knex');

// Configuration for an in-memory test database
const testDb = knex({
  client: 'sqlite3',
  connection: {
    // In-memory database, wiped clean after tests finish
    filename: ':memory:', 
  },
  useNullAsDefault: true,
});

async function setupTestDb() {
  // Create tables needed for testing
  await testDb.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').unique().notNullable();
    table.string('mobile').nullable(); // ADDED: Mobile column
    table.string('password_hash').notNullable();
    table.enum('role', ['user', 'admin']).notNullable().defaultTo('user');
  });

  await testDb.schema.createTable('sweets', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('category').notNullable();
    table.float('price').notNullable();
    table.integer('quantity').notNullable();
    table.string('image').nullable();
    table.text('description').nullable();
  });
  
  // ADDED: purchase_history table
  await testDb.schema.createTable('purchase_history', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('sweet_id').unsigned().notNullable().references('id').inTable('sweets').onDelete('RESTRICT');
    table.integer('quantity').notNullable();
    table.timestamp('purchase_date').defaultTo(testDb.fn.now());
  });
}

module.exports = { testDb, setupTestDb };