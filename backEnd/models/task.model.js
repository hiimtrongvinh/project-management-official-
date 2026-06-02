const { query } = require('../config/database');

/**
 * Task Model - Data access layer for the tasks table
 */
const TaskModel = {
  /**
   * Helper function to enrich tasks with files, submission notes and feedback comments.
   * @param {Array} tasks
   * @returns {Promise<Array>} Enriched tasks
   */
  async enrichTasks(tasks) {
    if (!tasks || tasks.length === 0) return tasks;

    const taskIds = tasks.map(t => t.id);

    // Fetch documents
    const documents = await query(
      `SELECT id, task_id, file_name, file_path, created_at 
       FROM project_documents 
       WHERE task_id IN (${taskIds.map(() => '?').join(', ')})`,
      taskIds
    );

    // Fetch submission notes (activity logs with action = 'Nộp báo cáo')
    const stringTaskIds = taskIds.map(id => String(id));
    const logs = await query(
      `SELECT entity_id, details, created_at 
       FROM activity_logs 
       WHERE entity_type = 'task' AND action = 'Nộp báo cáo' AND entity_id IN (${stringTaskIds.map(() => '?').join(', ')})
       ORDER BY created_at DESC`,
      stringTaskIds
    );

    // Fetch feedback (task comments)
    const comments = await query(
      `SELECT task_id, content, created_at 
       FROM task_comments 
       WHERE task_id IN (${taskIds.map(() => '?').join(', ')})
       ORDER BY created_at DESC`,
      taskIds
    );

    // Group documents, logs, and comments by task_id
    const docsMap = {};
    documents.forEach(doc => {
      if (!docsMap[doc.task_id]) docsMap[doc.task_id] = [];
      docsMap[doc.task_id].push(doc);
    });

    const logsMap = {};
    logs.forEach(log => {
      if (!logsMap[log.entity_id]) logsMap[log.entity_id] = [];
      logsMap[log.entity_id].push(log);
    });

    const commentsMap = {};
    comments.forEach(comment => {
      if (!commentsMap[comment.task_id]) commentsMap[comment.task_id] = [];
      commentsMap[comment.task_id].push(comment);
    });

    // Enrich tasks
    tasks.forEach(task => {
      task.files = docsMap[task.id] || [];
      // Keep single file_path for backward compatibility
      task.file_path = task.files.length > 0 ? task.files[0].file_path : null;

      // Extract submission note from details
      const taskLogs = logsMap[String(task.id)] || [];
      let submitNote = '';
      if (taskLogs.length > 0) {
        try {
          const details = JSON.parse(taskLogs[0].details);
          submitNote = details.note || '';
        } catch (e) {
          submitNote = '';
        }
      }
      task.submit_note = submitNote;

      // Extract feedback (latest comment)
      const taskComments = commentsMap[task.id] || [];
      task.feedback = taskComments.length > 0 ? taskComments[0].content : null;
    });

    return tasks;
  },

  /**
   * Find a task by ID.
   * @param {string} id
   * @returns {Promise<Object|null>} Task or null
   */
  async findById(id) {
    const rows = await query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    const enriched = await this.enrichTasks(rows);
    return enriched[0];
  },

  /**
   * Find tasks by project ID.
   * @param {string} projectId
   * @returns {Promise<Array>} Task rows
   */
  async findByProjectId(projectId) {
    const tasks = await query(
      `SELECT t.*, a.name as assignee_name 
       FROM tasks t
       LEFT JOIN staffs a ON t.assignee_id = a.id
       WHERE t.project_id = ?
       ORDER BY t.step ASC, t.created_at DESC`,
      [projectId]
    );
    return this.enrichTasks(tasks);
  },

  /**
   * Find tasks assigned to a staff member (based on staff ID).
   * @param {string} staffId
   * @returns {Promise<Array>} Task rows
   */
  async findByAssigneeId(staffId) {
    const tasks = await query(
      `SELECT t.*, p.title as project_title 
       FROM tasks t
       LEFT JOIN projects p ON t.project_id = p.id
       WHERE t.assignee_id = ?
       ORDER BY t.deadline ASC`,
      [staffId]
    );
    return this.enrichTasks(tasks);
  },

  /**
   * Find all tasks (for admin).
   * @returns {Promise<Array>} All task rows
   */
  async findAll() {
    const tasks = await query(
      `SELECT t.*, p.title as project_title, s.name as assignee_name
       FROM tasks t
       LEFT JOIN projects p ON t.project_id = p.id
       LEFT JOIN staffs s ON t.assignee_id = s.id
       ORDER BY t.created_at DESC`
    );
    return this.enrichTasks(tasks);
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
