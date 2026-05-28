const { query } = require('../config/database');

/**
 * Category Model - Data access layer for the categories table
 */
const CategoryModel = {
  async findAll() {
    return query('SELECT * FROM categories ORDER BY group_name ASC, sort_order ASC');
  },

  async findById(id) {
    const rows = await query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  async create(data) {
    const { group_name, value, sort_order = 0 } = data;
    const result = await query(
      'INSERT INTO categories (group_name, value, sort_order) VALUES (?, ?, ?)',
      [group_name, value, sort_order]
    );
    return { id: result.insertId, group_name, value, sort_order };
  },

  async update(id, data) {
    const fields = [];
    const params = [];

    if (data.value !== undefined) { fields.push('value = ?'); params.push(data.value); }
    if (data.group_name !== undefined) { fields.push('group_name = ?'); params.push(data.group_name); }
    if (data.sort_order !== undefined) { fields.push('sort_order = ?'); params.push(data.sort_order); }

    if (fields.length === 0) return;
    params.push(id);
    await query(`UPDATE categories SET ${fields.join(', ')} WHERE id = ?`, params);
  },

  async delete(id) {
    await query('DELETE FROM categories WHERE id = ?', [id]);
  }
};

module.exports = CategoryModel;
