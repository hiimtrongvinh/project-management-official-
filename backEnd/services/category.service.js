const CategoryModel = require('../models/category.model');

/**
 * Category Service - Business logic for category management
 */
const CategoryService = {
  async getCategories() {
    const rows = await CategoryModel.findAll();
    // Group by group_name
    const grouped = {};
    rows.forEach(row => {
      if (!grouped[row.group_name]) grouped[row.group_name] = [];
      grouped[row.group_name].push(row);
    });
    return grouped;
  },

  async createCategory(data) {
    if (!data.group_name || !data.value) {
      const error = new Error('group_name and value are required');
      error.statusCode = 400;
      throw error;
    }
    return CategoryModel.create(data);
  },

  async updateCategory(id, data) {
    const cat = await CategoryModel.findById(id);
    if (!cat) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }
    await CategoryModel.update(id, data);
    return CategoryModel.findById(id);
  },

  async deleteCategory(id) {
    const cat = await CategoryModel.findById(id);
    if (!cat) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }
    await CategoryModel.delete(id);
  }
};

module.exports = CategoryService;
