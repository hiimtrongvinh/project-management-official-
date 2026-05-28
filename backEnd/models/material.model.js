const { query } = require('../config/database');

/**
 * Material Model - Data access layer for the materials table
 */
const MaterialModel = {
  /**
   * Find a material by ID.
   * @param {string} id
   * @returns {Promise<Object|null>} Material or null
   */
  async findById(id) {
    const rows = await query('SELECT * FROM materials WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Find materials with filters.
   * @param {Object} filters - { category, status, supplier_id, search }
   * @returns {Promise<Array>} Material rows
   */
  async findAll(filters = {}) {
    let sql = `
      SELECT m.*, s.name as supplier_name 
      FROM materials m
      LEFT JOIN suppliers s ON m.supplier_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.category) {
      sql += ' AND m.category = ?';
      params.push(filters.category);
    }

    if (filters.status) {
      sql += ' AND m.status = ?';
      params.push(filters.status);
    }

    if (filters.supplierId) {
      sql += ' AND m.supplier_id = ?';
      params.push(filters.supplierId);
    }

    if (filters.search) {
      sql += ' AND (m.name LIKE ? OR m.id LIKE ? OR m.sku LIKE ?)';
      const searchWildcard = `%${filters.search}%`;
      params.push(searchWildcard, searchWildcard, searchWildcard);
    }

    sql += ' ORDER BY m.id ASC';

    return query(sql, params);
  },

  /**
   * Create a new material.
   * @param {Object} data
   * @returns {Promise<void>}
   */
  async create(data) {
    const { id, sku, name, brand, category, unit, price, status = 'Sẵn sàng', image_url, supplier_id, specs, description } = data;
    await query(
      `INSERT INTO materials (id, sku, name, brand, category, unit, price, status, image_url, supplier_id, specs, description) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, sku, name, brand, category, unit, price, status, image_url, supplier_id, specs, description]
    );
  },

  /**
   * Update material status.
   * @param {string} id
   * @param {string} status
   * @returns {Promise<void>}
   */
  async updateStatus(id, status) {
    await query('UPDATE materials SET status = ? WHERE id = ?', [status, id]);
  },

  /**
   * Update material fields.
   * @param {string} id
   * @param {Object} data
   * @returns {Promise<void>}
   */
  async update(id, data) {
    const fields = [];
    const params = [];
    const allowed = ['sku', 'name', 'brand', 'category', 'unit', 'price', 'status', 'image_url', 'supplier_id', 'specs', 'description'];

    for (const key of allowed) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(data[key]);
      }
    }

    if (fields.length === 0) return;
    params.push(id);
    await query(`UPDATE materials SET ${fields.join(', ')} WHERE id = ?`, params);
  },

  /**
   * Delete material by ID.
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    await query('DELETE FROM materials WHERE id = ?', [id]);
  }
};

module.exports = MaterialModel;
