const { query } = require('../config/database');
const StaffModel = require('../models/staff.model');
const ClientModel = require('../models/client.model');
const SupplierModel = require('../models/supplier.model');
const ProjectModel = require('../models/project.model');
const TaskModel = require('../models/task.model');
const OrderModel = require('../models/order.model');
const MaterialModel = require('../models/material.model');

/**
 * Middleware to check user profile update / avatar upload authorization.
 * Allows admin, or the user themselves.
 * Strips sensitive fields for non-admin on updates.
 */
async function checkUserAccess(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing user ID parameter.' }
      });
    }

    if (req.user.role === 'admin') {
      return next();
    }

    // Determine target user type
    let targetAccountId = null;
    if (id.startsWith('NV')) {
      const staff = await StaffModel.findById(id);
      if (staff) targetAccountId = staff.account_id;
    } else if (id.startsWith('KH')) {
      const client = await ClientModel.findById(id);
      if (client) targetAccountId = client.account_id;
    } else if (id.startsWith('NC')) {
      const supplier = await SupplierModel.findById(id);
      if (supplier) targetAccountId = supplier.account_id;
    }

    if (!targetAccountId || targetAccountId !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: { message: 'Forbidden: You do not have permission to access/modify this user.' }
      });
    }

    // Prevent non-admin from updating sensitive fields
    if (req.body) {
      delete req.body.department;
      delete req.body.position;
      delete req.body.status;
      delete req.body.role;
    }

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Middleware to check project access.
 * Admin: allowed.
 * Staff: allowed if assigned project member.
 * Client: allowed if project belongs to them.
 */
async function checkProjectAccess(req, res, next) {
  try {
    const projectId = req.params.id || req.params.projectId || (req.body && req.body.project_id);
    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing project ID parameter.' }
      });
    }

    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: { message: 'Project not found' }
      });
    }

    const { id: userId, role } = req.user;

    if (role === 'admin') {
      req.project = project;
      return next();
    }

    if (role === 'staff') {
      const staff = await StaffModel.findByAccountId(userId);
      if (!staff) {
        return res.status(403).json({
          success: false,
          error: { message: 'Access denied. Staff record not found.' }
        });
      }

      const memberRows = await query(
        'SELECT id FROM project_members WHERE project_id = ? AND staff_id = ?',
        [projectId, staff.id]
      );
      if (memberRows.length === 0) {
        return res.status(403).json({
          success: false,
          error: { message: 'Access denied. You are not a member of this project.' }
        });
      }

      req.project = project;
      return next();
    }

    if (role === 'client') {
      const client = await ClientModel.findByAccountId(userId);
      if (!client || project.client_id !== client.id) {
        return res.status(403).json({
          success: false,
          error: { message: 'Access denied. This project does not belong to you.' }
        });
      }

      req.project = project;
      return next();
    }

    return res.status(403).json({
      success: false,
      error: { message: 'Forbidden. Insufficient permissions.' }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Middleware to check task access.
 * action: 'submit' or default 'view'
 */
function checkTaskAccess(action = 'view') {
  return async (req, res, next) => {
    try {
      const taskId = parseInt(req.params.id, 10);
      if (Number.isNaN(taskId)) {
        return res.status(400).json({
          success: false,
          error: { message: 'Invalid task ID.' }
        });
      }

      const task = await TaskModel.findById(taskId);
      if (!task) {
        return res.status(404).json({
          success: false,
          error: { message: 'Task not found' }
        });
      }

      const { id: userId, role } = req.user;

      if (role === 'admin') {
        req.task = task;
        return next();
      }

      if (role === 'staff') {
        const staff = await StaffModel.findByAccountId(userId);
        if (!staff) {
          return res.status(403).json({
            success: false,
            error: { message: 'Access denied. Staff record not found.' }
          });
        }

        if (action === 'submit') {
          if (task.assignee_id !== staff.id) {
            return res.status(403).json({
              success: false,
              error: { message: 'Bạn không được phân công thực hiện công việc này.' }
            });
          }
        } else {
          // Check if staff is a member of the project
          const memberRows = await query(
            'SELECT id FROM project_members WHERE project_id = ? AND staff_id = ?',
            [task.project_id, staff.id]
          );
          if (memberRows.length === 0) {
            return res.status(403).json({
              success: false,
              error: { message: 'Access denied. You are not a member of the project for this task.' }
            });
          }
        }

        req.task = task;
        return next();
      }

      if (role === 'client') {
        if (action === 'submit') {
          return res.status(403).json({
            success: false,
            error: { message: 'Clients cannot submit task deliverables.' }
          });
        }

        const client = await ClientModel.findByAccountId(userId);
        const project = await ProjectModel.findById(task.project_id);
        if (!client || !project || project.client_id !== client.id) {
          return res.status(403).json({
            success: false,
            error: { message: 'Access denied. This task does not belong to your project.' }
          });
        }

        req.task = task;
        return next();
      }

      return res.status(403).json({
        success: false,
        error: { message: 'Forbidden. Insufficient permissions.' }
      });
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Middleware to check order access.
 * Admin: allowed.
 * Staff: allowed if member of the order's project.
 * Supplier: allowed if order is assigned to this supplier.
 */
async function checkOrderAccess(req, res, next) {
  try {
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing order ID.' }
      });
    }

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: { message: 'Order not found' }
      });
    }

    const { id: userId, role } = req.user;

    if (role === 'admin') {
      req.order = order;
      return next();
    }

    if (role === 'staff') {
      const staff = await StaffModel.findByAccountId(userId);
      if (!staff) {
        return res.status(403).json({
          success: false,
          error: { message: 'Access denied. Staff record not found.' }
        });
      }

      const memberRows = await query(
        'SELECT id FROM project_members WHERE project_id = ? AND staff_id = ?',
        [order.project_id, staff.id]
      );
      if (memberRows.length === 0) {
        return res.status(403).json({
          success: false,
          error: { message: 'Access denied. You are not a member of the project for this order.' }
        });
      }

      req.order = order;
      return next();
    }

    if (role === 'supplier') {
      const supplier = await SupplierModel.findByAccountId(userId);
      if (!supplier || order.supplier_id !== supplier.id) {
        return res.status(403).json({
          success: false,
          error: { message: 'Access denied. This order does not belong to you.' }
        });
      }

      req.order = order;
      return next();
    }

    return res.status(403).json({
      success: false,
      error: { message: 'Forbidden. Insufficient permissions.' }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Middleware to check material access.
 * Admin: allowed.
 * Supplier: allowed if material is owned by them.
 */
async function checkMaterialAccess(req, res, next) {
  try {
    const materialId = req.params.id;
    if (!materialId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing material ID.' }
      });
    }

    const material = await MaterialModel.findById(materialId);
    if (!material) {
      return res.status(404).json({
        success: false,
        error: { message: 'Material not found' }
      });
    }

    const { id: userId, role } = req.user;

    if (role === 'admin') {
      req.material = material;
      return next();
    }

    if (role === 'supplier') {
      const supplier = await SupplierModel.findByAccountId(userId);
      if (!supplier || material.supplier_id !== supplier.id) {
        return res.status(403).json({
          success: false,
          error: { message: 'Access denied. You do not own this material.' }
        });
      }

      req.material = material;
      return next();
    }

    return res.status(403).json({
      success: false,
      error: { message: 'Forbidden. Insufficient permissions.' }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Middleware to check project estimation (materials and labor fee) updates.
 * Admin: allowed at any step.
 * Client: allowed at step 1 & 2 for their own project.
 * Staff: allowed at step 1 & 2 if they are project member AND assigned to step 1/2 tasks.
 */
async function checkProjectEstimationAccess(req, res, next) {
  try {
    const { id: userId, role } = req.user;
    let projectId = req.params.projectId || (req.body && req.body.project_id);

    if (!projectId && req.params.id) {
      if (req.originalUrl.includes('/project-item')) {
        const rows = await query('SELECT project_id FROM project_items WHERE id = ?', [req.params.id]);
        if (rows.length > 0) {
          projectId = rows[0].project_id;
        }
      } else {
        projectId = req.params.id;
      }
    }

    if (!projectId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing project ID parameter.' }
      });
    }

    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: { message: 'Project not found' }
      });
    }

    if (role === 'admin') {
      req.project = project;
      return next();
    }

    // Client & Staff can only edit at Step 1 or Step 2
    if (project.current_step !== 1 && project.current_step !== 2) {
      return res.status(403).json({
        success: false,
        error: { message: 'Chỉnh sửa vật tư và chi phí nhân công chỉ được thực hiện ở Bước 1 và Bước 2.' }
      });
    }

    if (role === 'client') {
      const client = await ClientModel.findByAccountId(userId);
      if (!client || project.client_id !== client.id) {
        return res.status(403).json({
          success: false,
          error: { message: 'Bạn không có quyền chỉnh sửa thông tin của dự án này.' }
        });
      }

      // Non-admin can only update labor_fee on project resource
      if (req.method === 'PUT' && req.originalUrl.includes('/api/projects')) {
        const allowedKeys = ['labor_fee', 'laborFee'];
        for (const key of Object.keys(req.body)) {
          if (!allowedKeys.includes(key)) {
            delete req.body[key];
          }
        }
        if (req.body.laborFee !== undefined) {
          req.body.labor_fee = req.body.laborFee;
          delete req.body.laborFee;
        }
        if (req.body.labor_fee === undefined) {
          return res.status(400).json({
            success: false,
            error: { message: 'Chỉ được phép cập nhật chi phí nhân công (labor fee).' }
          });
        }
      }

      req.project = project;
      return next();
    }

    if (role === 'staff') {
      const staff = await StaffModel.findByAccountId(userId);
      if (!staff) {
        return res.status(403).json({
          success: false,
          error: { message: 'Access denied. Staff record not found.' }
        });
      }

      // Check if project member
      const memberRows = await query(
        'SELECT id FROM project_members WHERE project_id = ? AND staff_id = ?',
        [projectId, staff.id]
      );
      if (memberRows.length === 0) {
        return res.status(403).json({
          success: false,
          error: { message: 'Bạn không phải là thành viên của dự án này.' }
        });
      }

      // Check if assigned to tasks in step 1 or 2
      const taskRows = await query(
        'SELECT id FROM tasks WHERE project_id = ? AND assignee_id = ? AND step IN (1, 2)',
        [projectId, staff.id]
      );
      if (taskRows.length === 0) {
        return res.status(403).json({
          success: false,
          error: { message: 'Bạn không được giao nhiệm vụ tiếp quản ở Bước 1 và Bước 2 của dự án này.' }
        });
      }

      // Non-admin can only update labor_fee on project resource
      if (req.method === 'PUT' && req.originalUrl.includes('/api/projects')) {
        const allowedKeys = ['labor_fee', 'laborFee'];
        for (const key of Object.keys(req.body)) {
          if (!allowedKeys.includes(key)) {
            delete req.body[key];
          }
        }
        if (req.body.laborFee !== undefined) {
          req.body.labor_fee = req.body.laborFee;
          delete req.body.laborFee;
        }
        if (req.body.labor_fee === undefined) {
          return res.status(400).json({
            success: false,
            error: { message: 'Chỉ được phép cập nhật chi phí nhân công (labor fee).' }
          });
        }
      }

      req.project = project;
      return next();
    }

    return res.status(403).json({
      success: false,
      error: { message: 'Forbidden. Insufficient permissions.' }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Middleware to restrict specific actions based on the project step assignment.
 * Only admin, or staff members assigned to tasks at the specified step, are allowed.
 */
function checkProjectStepActionAccess(requiredStep) {
  return async (req, res, next) => {
    try {
      const { id: userId, role } = req.user;
      const projectId = req.params.id || req.params.projectId || (req.body && req.body.project_id);

      if (!projectId) {
        return res.status(400).json({
          success: false,
          error: { message: 'Missing project ID parameter.' }
        });
      }

      if (role === 'admin') {
        return next();
      }

      if (role === 'staff') {
        const staff = await StaffModel.findByAccountId(userId);
        if (!staff) {
          return res.status(403).json({
            success: false,
            error: { message: 'Access denied. Staff record not found.' }
          });
        }

        // Check project membership
        const memberRows = await query(
          'SELECT id FROM project_members WHERE project_id = ? AND staff_id = ?',
          [projectId, staff.id]
        );
        if (memberRows.length === 0) {
          return res.status(403).json({
            success: false,
            error: { message: 'Bạn không phải là thành viên của dự án này.' }
          });
        }

        // Check if assigned to a task at the required step
        const taskRows = await query(
          'SELECT id FROM tasks WHERE project_id = ? AND assignee_id = ? AND step = ?',
          [projectId, staff.id, requiredStep]
        );
        if (taskRows.length === 0) {
          return res.status(403).json({
            success: false,
            error: { message: `Bạn không được giao nhiệm vụ tiếp quản ở Bước ${requiredStep} của dự án này.` }
          });
        }

        return next();
      }

      return res.status(403).json({
        success: false,
        error: { message: 'Forbidden. Insufficient permissions.' }
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  checkUserAccess,
  checkProjectAccess,
  checkTaskAccess,
  checkOrderAccess,
  checkMaterialAccess,
  checkProjectEstimationAccess,
  checkProjectStepActionAccess
};
