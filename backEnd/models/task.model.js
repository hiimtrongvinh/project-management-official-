const { query } = require('../config/database');

/**
 * Task Model - Data access layer for the tasks table
 */
const TaskModel = {
  /**
   * Find a task by ID.
   * @param {string} id
   * @returns {Promise<Object|null>} Task or null
   */
  async findById(id) {
    const rows = await query('SELECT * FROM tasks WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Find tasks by project ID.
   * @param {string} projectId
   * @returns {Promise<Array>} Task rows
   */
  async findByProjectId(projectId) {
    return query(
      `SELECT t.*, a.name as assignee_name 
       FROM tasks t
       LEFT JOIN staffs a ON t.assignee_id = a.id
       WHERE t.project_id = ?
       ORDER BY t.step ASC, t.created_at DESC`,
      [projectId]
    );
  },

  /**
   * Find tasks assigned to a staff member (based on staff ID).
   * @param {string} staffId
   * @returns {Promise<Array>} Task rows
   */
  async findByAssigneeId(staffId) {
    return query(
      `SELECT t.*, p.title as project_title 
       FROM tasks t
       LEFT JOIN projects p ON t.project_id = p.id
       WHERE t.assignee_id = ?
       ORDER BY t.deadline ASC`,
      [staffId]
    );
  },

  /**
   * Find all tasks (for admin).
   * @returns {Promise<Array>} All task rows
   */
  async findAll() {
    return query(
      `SELECT t.*, p.title as project_title, s.name as assignee_name
       FROM tasks t
       LEFT JOIN projects p ON t.project_id = p.id
       LEFT JOIN staffs s ON t.assignee_id = s.id
       ORDER BY t.created_at DESC`
    );
  },

  /**
   * Create a new task.
   * @param {Object} data
   * @returns {Promise<void>}
   */
  async create(data) {
    const { project_id, step, title, description = null, assignee_id = null, deadline = null, priority = 'Trung bình', status = 'Chưa nộp' } = data;
    const result = await query(
      `INSERT INTO tasks (project_id, step, title, description, assignee_id, deadline, priority, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [project_id, step, title, description, assignee_id, deadline, priority, status]
    );
    return result.insertId;
  },

  /**
   * Update task status and other submit details.
   * @param {string} id
   * @param {Object} updateData - { status, file_path, feedback, feedback_by }
   * @returns {Promise<void>}
   */
  async update(id, updateData) {
    const fields = [];
    const params = [];

    Object.keys(updateData).forEach(key => {
      fields.push(`${key} = ?`);
      params.push(updateData[key] === undefined ? null : updateData[key]);
    });

    params.push(id);

    await query(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`, params);
  },

  /**
   * Add a note to a task.
   * @param {string} taskId
   * @param {string} content
   * @param {number} createdBy
   * @returns {Promise<void>}
   */
  async addNote(taskId, content, createdBy) {
    await query(
      'INSERT INTO task_comments (task_id, content, created_by) VALUES (?, ?, ?)',
      [taskId, content, createdBy]
    );
  },

  /**
   * Log task status changes.
   * @param {Object} logData - { task_id, action, old_status, new_status, note, performed_by }
   * @returns {Promise<void>}
   */
  async logHistory(logData) {
    const { task_id, action, old_status = null, new_status = null, note = null, performed_by } = logData;
    const details = JSON.stringify({ old_status, new_status, note });
    await query(
      `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) 
       VALUES (?, ?, 'task', ?, ?)`,
      [performed_by, action, String(task_id), details]
    );
  },

  /**
   * Delete task by ID.
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id) {
    await query('DELETE FROM tasks WHERE id = ?', [id]);
  }
};

module.exports = TaskModel;
