const { query } = require('../config/database');

/**
 * Project Model - Data access layer for the projects table
 */
const ProjectModel = {
  /**
   * Find all projects with pagination and filters.
   * @param {Object} filters - { status, category, search }
   * @param {number} page - Page number (1-based)
   * @param {number} limit - Items per page
   * @returns {Promise<{data: Array, total: number}>}
   */
  async findAll(filters = {}, page = 1, limit = 20) {
    let whereClauses = [];
    let params = [];

    // Luôn ẩn dự án bị từ chối khỏi danh sách của Admin
    whereClauses.push('p.current_step != -1');

    if (filters.status) {
      whereClauses.push('p.status = ?');
      params.push(filters.status);
    }
    if (filters.category) {
      whereClauses.push('p.category = ?');
      params.push(filters.category);
    }
    if (filters.search) {
      whereClauses.push('(p.title LIKE ? OR p.description LIKE ?)');
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const whereStr = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';

    // Get total count
    const countSql = `SELECT COUNT(*) as total FROM projects p ${whereStr}`;
    const countResult = await query(countSql, params);
    const total = countResult[0].total;

    // Get paginated data
    const offset = (page - 1) * limit;
    const dataSql = `
      SELECT p.*, p.deadline as end_date, c.name as client_name,
        CASE p.current_step
          WHEN 1 THEN 'Khảo sát và lập kế hoạch'
          WHEN 2 THEN 'Lập báo giá và xác nhận hợp đồng'
          WHEN 3 THEN 'Triển khai lắp đặt'
          WHEN 4 THEN 'Bàn giao và nghiệm thu'
          WHEN 5 THEN 'Thanh toán'
          WHEN 6 THEN 'Hoàn thành'
          WHEN -1 THEN 'Đã từ chối'
          ELSE 'Chờ phê duyệt'
        END as status,
        COALESCE(ROUND((SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'Đã duyệt') / NULLIF((SELECT COUNT(*) FROM tasks t2 WHERE t2.project_id = p.id), 0) * 100), 0) as progress,
        CASE WHEN p.current_step = 6 THEN p.updated_at ELSE NULL END as closed_at,
        (SELECT COUNT(*) FROM project_members pm WHERE pm.project_id = p.id) as member_count,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) as total_tasks,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'Đã duyệt') as approved_tasks,
        (SELECT CONCAT('[', GROUP_CONCAT(JSON_OBJECT('staff_id', s.id, 'name', s.name, 'avatar', s.avatar)), ']')
         FROM project_members pm2 
         INNER JOIN staffs s ON pm2.staff_id = s.id
         INNER JOIN accounts a ON s.account_id = a.id
         WHERE pm2.project_id = p.id AND a.status = 'active') as members_json
      FROM projects p
      LEFT JOIN clients c ON p.client_id = c.id
      ${whereStr}
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const data = await query(dataSql, [...params, String(limit), String(offset)]);

    return { data, total };
  },

  /**
   * Find a project by ID with member count and task stats.
   * @param {string} id - Project ID (PRJxx)
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    const sql = `
      SELECT p.*, p.deadline as end_date, c.name as client_name,
        c.phone as client_phone, c.address as client_address, c.id_number as client_tax_code, c.type as client_type,
        CASE p.current_step
          WHEN 1 THEN 'Khảo sát và lập kế hoạch'
          WHEN 2 THEN 'Lập báo giá và xác nhận hợp đồng'
          WHEN 3 THEN 'Triển khai lắp đặt'
          WHEN 4 THEN 'Bàn giao và nghiệm thu'
          WHEN 5 THEN 'Thanh toán'
          WHEN 6 THEN 'Hoàn thành'
          WHEN -1 THEN 'Đã từ chối'
          ELSE 'Chờ phê duyệt'
        END as status,
        COALESCE(ROUND((SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'Đã duyệt') / NULLIF((SELECT COUNT(*) FROM tasks t2 WHERE t2.project_id = p.id), 0) * 100), 0) as progress,
        CASE WHEN p.current_step = 6 THEN p.updated_at ELSE NULL END as closed_at,
        (SELECT COUNT(*) FROM project_members pm WHERE pm.project_id = p.id) as member_count,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) as total_tasks,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'Đã duyệt') as approved_tasks
      FROM projects p
      LEFT JOIN clients c ON p.client_id = c.id
      WHERE p.id = ?
    `;
    const rows = await query(sql, [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Find projects by client ID.
   * @param {string} clientId - Client ID (KHxxx)
   * @param {number} page
   * @param {number} limit
   * @returns {Promise<{data: Array, total: number}>}
   */
  async findByClient(clientId, page = 1, limit = 20) {
    const countSql = 'SELECT COUNT(*) as total FROM projects WHERE client_id = ?';
    const countResult = await query(countSql, [clientId]);
    const total = countResult[0].total;

    const offset = (page - 1) * limit;
    const dataSql = `
      SELECT p.*, p.deadline as end_date, c.name as client_name,
        CASE p.current_step
          WHEN 1 THEN 'Khảo sát và lập kế hoạch'
          WHEN 2 THEN 'Lập báo giá và xác nhận hợp đồng'
          WHEN 3 THEN 'Triển khai lắp đặt'
          WHEN 4 THEN 'Bàn giao và nghiệm thu'
          WHEN 5 THEN 'Thanh toán'
          WHEN 6 THEN 'Hoàn thành'
          WHEN -1 THEN 'Đã từ chối'
          ELSE 'Chờ phê duyệt'
        END as status,
        COALESCE(ROUND((SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'Đã duyệt') / NULLIF((SELECT COUNT(*) FROM tasks t2 WHERE t2.project_id = p.id), 0) * 100), 0) as progress,
        CASE WHEN p.current_step = 6 THEN p.updated_at ELSE NULL END as closed_at,
        (SELECT COUNT(*) FROM project_members pm WHERE pm.project_id = p.id) as member_count,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) as total_tasks,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'Đã duyệt') as approved_tasks,
        (SELECT CONCAT('[', GROUP_CONCAT(JSON_OBJECT('staff_id', s.id, 'name', s.name, 'avatar', s.avatar)), ']')
         FROM project_members pm2 
         INNER JOIN staffs s ON pm2.staff_id = s.id
         INNER JOIN accounts a ON s.account_id = a.id
         WHERE pm2.project_id = p.id AND a.status = 'active') as members_json
      FROM projects p
      LEFT JOIN clients c ON p.client_id = c.id
      WHERE p.client_id = ?
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const data = await query(dataSql, [clientId, String(limit), String(offset)]);

    return { data, total };
  },

  /**
   * Find projects where a staff member is assigned.
   * @param {string} staffId - Staff ID (NVxxx)
   * @param {number} page
   * @param {number} limit
   * @returns {Promise<{data: Array, total: number}>}
   */
  async findByMember(staffId, page = 1, limit = 20) {
    const countSql = `
      SELECT COUNT(*) as total FROM projects p
      INNER JOIN project_members pm ON p.id = pm.project_id
      WHERE pm.staff_id = ? AND p.current_step NOT IN (-1, 0)
    `;
    const countResult = await query(countSql, [staffId]);
    const total = countResult[0].total;

    const offset = (page - 1) * limit;
    const dataSql = `
      SELECT p.*, p.deadline as end_date, c.name as client_name,
        CASE p.current_step
          WHEN 1 THEN 'Khảo sát và lập kế hoạch'
          WHEN 2 THEN 'Lập báo giá và xác nhận hợp đồng'
          WHEN 3 THEN 'Triển khai lắp đặt'
          WHEN 4 THEN 'Bàn giao và nghiệm thu'
          WHEN 5 THEN 'Thanh toán'
          WHEN 6 THEN 'Hoàn thành'
          WHEN -1 THEN 'Đã từ chối'
          ELSE 'Chờ phê duyệt'
        END as status,
        COALESCE(ROUND((SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'Đã duyệt') / NULLIF((SELECT COUNT(*) FROM tasks t2 WHERE t2.project_id = p.id), 0) * 100), 0) as progress,
        CASE WHEN p.current_step = 6 THEN p.updated_at ELSE NULL END as closed_at,
        (SELECT COUNT(*) FROM project_members pm2 WHERE pm2.project_id = p.id) as member_count,
        (SELECT CONCAT('[', GROUP_CONCAT(JSON_OBJECT('staff_id', s.id, 'name', s.name, 'avatar', s.avatar)), ']')
         FROM project_members pm3 
         INNER JOIN staffs s ON pm3.staff_id = s.id
         INNER JOIN accounts a ON s.account_id = a.id
         WHERE pm3.project_id = p.id AND a.status = 'active') as members_json
      FROM projects p
      INNER JOIN project_members pm ON p.id = pm.project_id
      LEFT JOIN clients c ON p.client_id = c.id
      WHERE pm.staff_id = ? AND p.current_step NOT IN (-1, 0)
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;
    const data = await query(dataSql, [staffId, String(limit), String(offset)]);

    return { data, total };
  },

  /**
   * Create a new project.
   * @param {Object} data - Project data
   * @returns {Promise<Object>} Query result
   */
  async create(data) {
    const sql = `
      INSERT INTO projects (id, title, description, category, client_id, start_date, deadline, current_step, budget, created_by, labor_fee)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await query(sql, [
      data.id,
      data.title,
      data.description || null,
      data.category || null,
      data.client_id || null,
      data.start_date || null,
      data.deadline || null,
      data.current_step !== undefined ? data.current_step : 1,
      data.budget || null,
      data.created_by,
      data.labor_fee || 0
    ]);
    return result;
  },

  /**
   * Update a project by ID.
   * @param {string} id - Project ID
   * @param {Object} data - Fields to update
   * @returns {Promise<Object>} Query result
   */
  async update(id, data) {
    const fields = [];
    const params = [];

    const allowedFields = ['title', 'description', 'category', 'client_id', 'start_date', 'deadline', 'current_step', 'budget', 'labor_fee', 'quotation_status'];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = ?`);
        params.push(data[field]);
      }
    }

    if (fields.length === 0) return null;

    params.push(id);
    const sql = `UPDATE projects SET ${fields.join(', ')} WHERE id = ?`;
    return query(sql, params);
  },

  /**
   * Delete a project by ID. CASCADE handles related records.
   * @param {string} id - Project ID
   * @returns {Promise<Object>} Query result
   */
  async delete(id) {
    return query('DELETE FROM projects WHERE id = ?', [id]);
  },

  /**
   * Get all members of a project.
   * @param {string} projectId - Project ID
   * @returns {Promise<Array>}
   */
  async getMembers(projectId) {
    const sql = `
      SELECT pm.*, s.name as staff_name, s.position, s.department, s.avatar
      FROM project_members pm
      INNER JOIN staffs s ON pm.staff_id = s.id
      INNER JOIN accounts a ON s.account_id = a.id
      WHERE pm.project_id = ? AND a.status = 'active'
      ORDER BY pm.joined_at ASC
    `;
    return query(sql, [projectId]);
  },

  /**
   * Add a member to a project.
   * @param {string} projectId - Project ID
   * @param {string} staffId - Staff ID
   * @param {string} role - Role in project
   * @returns {Promise<Object>} Query result
   */
  async addMember(projectId, staffId, role) {
    const sql = 'INSERT INTO project_members (project_id, staff_id, role) VALUES (?, ?, ?)';
    return query(sql, [projectId, staffId, role || null]);
  },

  /**
   * Remove a member from a project.
   * @param {string} projectId - Project ID
   * @param {string} staffId - Staff ID
   * @returns {Promise<Object>} Query result
   */
  async removeMember(projectId, staffId) {
    const sql = 'DELETE FROM project_members WHERE project_id = ? AND staff_id = ?';
    return query(sql, [projectId, staffId]);
  }
};

module.exports = ProjectModel;
