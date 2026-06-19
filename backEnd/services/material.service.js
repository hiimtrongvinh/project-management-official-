const MaterialModel = require('../models/material.model');
const { generateMaterialId } = require('../utils/helpers');

/**
 * Material Service - Business logic for materials management
 */
const MaterialService = {
  /**
   * Get all materials with filters.
   * @param {Object} filters
   * @returns {Promise<Array>}
   */
  async getMaterials(filters = {}) {
    return MaterialModel.findAll(filters);
  },

  /**
   * Get material by ID.
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getMaterialById(id) {
    const material = await MaterialModel.findById(id);
    if (!material) {
      const error = new Error('Material not found');
      error.statusCode = 404;
      throw error;
    }
    return material;
  },

  /**
   * Create a new material.
   * @param {Object} data
   * @param {string|null} supplierId - supplier_id from token (if supplier role)
   * @returns {Promise<Object>}
   */
  async createMaterial(data, supplierId) {
    if (!data.name) {
      const error = new Error('Material name is required');
      error.statusCode = 400;
      throw error;
    }

    const materialId = await generateMaterialId();
    const materialData = {
      id: materialId,
      sku: data.sku || null,
      name: data.name,
      brand: data.brand || null,
      category: data.category || null,
      unit: data.unit || 'cái',
      price: data.price || 0,
      status: data.status || 'Sẵn sàng',
      image_url: data.image_url || null,
      supplier_id: supplierId || data.supplier_id || null,
      specs: data.specs || null,
      description: data.description || null
    };

    await MaterialModel.create(materialData);
    return MaterialModel.findById(materialId);
  },

  /**
   * Update a material.
   * @param {string} id
   * @param {Object} data
   * @param {string|null} supplierId - supplier_id from token (if supplier role)
   * @returns {Promise<Object>}
   */
  /**
   * Update a material.
   * @param {string} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async updateMaterial(id, data) {
    const material = await MaterialModel.findById(id);
    if (!material) {
      const error = new Error('Material not found');
      error.statusCode = 404;
      throw error;
    }

    await MaterialModel.update(id, data);
    return MaterialModel.findById(id);
  },

  /**
   * Delete a material.
   * @param {string} id
   * @returns {Promise<void>}
   */
  async deleteMaterial(id) {
    const material = await MaterialModel.findById(id);
    if (!material) {
      const error = new Error('Material not found');
      error.statusCode = 404;
      throw error;
    }

    await MaterialModel.delete(id);
  }
};

module.exports = MaterialService;
