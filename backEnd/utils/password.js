const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

/**
 * Hash a plain text password using bcrypt.
 * @param {string} plain - Plain text password
 * @returns {Promise<string>} Hashed password
 */
async function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

/**
 * Compare a plain text password against a bcrypt hash.
 * @param {string} plain - Plain text password
 * @param {string} hash - Bcrypt hashed password
 * @returns {Promise<boolean>} True if password matches
 */
async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

module.exports = { hashPassword, comparePassword };
