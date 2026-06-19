const mysql = require('mysql2/promise');

// Create connection pool using environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'eteck_project_management',
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

/**
 * Execute a parameterized query using the connection pool.
 * @param {string} sql - SQL query string with ? placeholders
 * @param {Array} params - Array of parameter values
 * @returns {Promise<Array>} Query result rows
 */
async function query(sql, params = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error.message);
    console.error('Query:', sql);
    throw error;
  }
}

// Handle pool connection errors
pool.on('connection', (connection) => {
  console.log('New database connection established (id: %d)', connection.threadId);
});

pool.on('enqueue', () => {
  console.warn('Database pool: waiting for available connection slot');
});

// Test database connectivity on startup
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully (thread id: %d)', connection.threadId);
    connection.release();

    // Auto-migrate: Add quotation_status to projects table if it doesn't exist
    try {
      const columns = await query("SHOW COLUMNS FROM projects LIKE 'quotation_status'");
      if (columns.length === 0) {
        console.log('Migrating: Adding quotation_status column to projects table...');
        await query("ALTER TABLE projects ADD COLUMN quotation_status VARCHAR(20) DEFAULT 'pending'");
        console.log('Migration completed successfully.');
      }
    } catch (migrateErr) {
      console.error('Migration failed:', migrateErr.message);
    }

  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.error('Retrying in 5 seconds...');
    setTimeout(testConnection, 5000);
  }
}

testConnection();

module.exports = { pool, query };
