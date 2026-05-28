const CategoryService = require('../services/category.service');

/**
 * Category Controller - HTTP request handlers for category management
 */
const CategoryController = {
  /**
   * GET /api/categories
   */
  async getCategories(req, res, next) {
    try {
      const grouped = await CategoryService.getCategories();
      res.json({ success: true, data: grouped });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/categories
   */
  async createCategory(req, res, next) {
    try {
      const cat = await CategoryService.createCategory(req.body);
      res.status(201).json({ success: true, data: cat });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ success: false, error: { message: error.message } });
      }
      next(error);
    }
  },

  /**
   * PUT /api/categories/:id
   */
  async updateCategory(req, res, next) {
    try {
      const cat = await CategoryService.updateCategory(req.params.id, req.body);
      res.json({ success: true, data: cat });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ success: false, error: { message: error.message } });
      }
      next(error);
    }
  },

  /**
   * DELETE /api/categories/:id
   */
  async deleteCategory(req, res, next) {
    try {
      await CategoryService.deleteCategory(req.params.id);
      res.json({ success: true, data: { message: 'Category deleted successfully' } });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({ success: false, error: { message: error.message } });
      }
      next(error);
    }
  }
};

module.exports = CategoryController;
