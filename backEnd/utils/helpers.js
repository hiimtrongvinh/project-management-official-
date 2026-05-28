const { query } = require('../config/database');

/**
 * Generate the next staff ID in format NVxxx (e.g., NV001, NV002...)
 * @returns {Promise<string>} Next staff ID
 */
async function generateStaffId() {
  const rows = await query('SELECT id FROM staffs ORDER BY id DESC LIMIT 1');
  if (rows.length === 0) return 'NV001';
  const lastNum = parseInt(rows[0].id.replace('NV', ''), 10);
  return `NV${String(lastNum + 1).padStart(3, '0')}`;
}

/**
 * Generate the next client ID in format KHxxx (e.g., KH001, KH002...)
 * @returns {Promise<string>} Next client ID
 */
async function generateClientId() {
  const rows = await query('SELECT id FROM clients ORDER BY id DESC LIMIT 1');
  if (rows.length === 0) return 'KH001';
  const lastNum = parseInt(rows[0].id.replace('KH', ''), 10);
  return `KH${String(lastNum + 1).padStart(3, '0')}`;
}

/**
 * Generate the next supplier ID in format NCxxx (e.g., NC001, NC002...)
 * @returns {Promise<string>} Next supplier ID
 */
async function generateSupplierId() {
  const rows = await query('SELECT id FROM suppliers ORDER BY id DESC LIMIT 1');
  if (rows.length === 0) return 'NC001';
  const lastNum = parseInt(rows[0].id.replace('NC', ''), 10);
  return `NC${String(lastNum + 1).padStart(3, '0')}`;
}

/**
 * Generate the next project ID in format PRJxx (e.g., PRJ01, PRJ02...)
 * @returns {Promise<string>} Next project ID
 */
async function generateProjectId() {
  const rows = await query('SELECT id FROM projects ORDER BY id DESC LIMIT 1');
  if (rows.length === 0) return 'PRJ01';
  const lastNum = parseInt(rows[0].id.replace('PRJ', ''), 10);
  return `PRJ${String(lastNum + 1).padStart(2, '0')}`;
}

/**
 * Generate the next order ID in format POxxx (e.g., PO001, PO002...)
 * @returns {Promise<string>} Next order ID
 */
async function generateOrderId() {
  const rows = await query('SELECT id FROM orders ORDER BY id DESC LIMIT 1');
  if (rows.length === 0) return 'PO001';
  const lastNum = parseInt(rows[0].id.replace('PO', ''), 10);
  return `PO${String(lastNum + 1).padStart(3, '0')}`;
}

module.exports = {
  generateStaffId,
  generateClientId,
  generateSupplierId,
  generateProjectId,
  generateOrderId,
  generateMaterialId
};

/**
 * Generate the next material ID in format Mxxx (e.g., M001, M002...)
 * @returns {Promise<string>} Next material ID
 */
async function generateMaterialId() {
  const rows = await query('SELECT id FROM materials ORDER BY CAST(SUBSTRING(id, 2) AS UNSIGNED) DESC LIMIT 1');
  if (rows.length === 0) return 'M001';
  const lastNum = parseInt(rows[0].id.replace('M', ''), 10);
  return `M${String(lastNum + 1).padStart(3, '0')}`;
}
