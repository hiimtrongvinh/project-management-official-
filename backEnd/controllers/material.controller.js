const MaterialService = require('../services/material.service');
const { query } = require('../config/database');

/**
 * Helper: lấy supplier_id từ account_id (nếu role = supplier)
 */
async function getSupplierIdFromAccount(accountId, role) {
  if (role !== 'supplier') return null;
  const rows = await query('SELECT id FROM suppliers WHERE account_id = ?', [accountId]);
  return rows.length > 0 ? rows[0].id : null;
}

/**
 * Material Controller - HTTP request handlers for materials management
 */
const MaterialController = {
  /**
   * GET /api/materials
   */
  async getMaterials(req, res, next) {
    try {
      const filters = {
        category: req.query.category,
        status: req.query.status,
        supplierId: req.query.supplierId,
        search: req.query.search
      };

      const materials = await MaterialService.getMaterials(filters);

      res.json({
        success: true,
        data: materials
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/materials/:id
   */
  async getMaterialById(req, res, next) {
    try {
      const { id } = req.params;
      const material = await MaterialService.getMaterialById(id);

      res.json({
        success: true,
        data: material
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          error: { message: error.message }
        });
      }
      next(error);
    }
  },

  /**
   * POST /api/materials
   */
  async createMaterial(req, res, next) {
    try {
      const { id: accountId, role } = req.user;
      const supplierId = await getSupplierIdFromAccount(accountId, role);

      if (req.file) {
        const subfolder = req.file.mimetype.startsWith('image/') ? 'images' : 'documents';
        req.body.image_url = `/uploads/${subfolder}/${req.file.filename}`;
      }

      const material = await MaterialService.createMaterial(req.body, supplierId);

      res.status(201).json({
        success: true,
        data: material
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          error: { message: error.message }
        });
      }
      next(error);
    }
  },

  /**
   * PUT /api/materials/:id
   */
  async updateMaterial(req, res, next) {
    try {
      if (req.file) {
        const subfolder = req.file.mimetype.startsWith('image/') ? 'images' : 'documents';
        req.body.image_url = `/uploads/${subfolder}/${req.file.filename}`;
      }

      const material = await MaterialService.updateMaterial(req.params.id, req.body);

      res.json({
        success: true,
        data: material
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          error: { message: error.message }
        });
      }
      next(error);
    }
  },

  /**
   * DELETE /api/materials/:id
   */
  async deleteMaterial(req, res, next) {
    try {
      await MaterialService.deleteMaterial(req.params.id);

      res.json({
        success: true,
        data: { message: 'Material deleted successfully' }
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          error: { message: error.message }
        });
      }
      next(error);
    }
  }
};

module.exports = MaterialController;
