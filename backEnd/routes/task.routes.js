const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/task.controller');
const authenticate = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/debug-logs', async (req, res) => {
  try {
    const { query } = require('../config/database');
    const docs = await query('SELECT * FROM project_documents ORDER BY id DESC LIMIT 20');
    res.json({ success: true, docs });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// All routes require authentication
router.use(authenticate);

router.get('/my-tasks', TaskController.getMyTasks);
router.get('/project/:projectId', TaskController.getTasksByProject);
router.post('/', TaskController.createTask);
router.post('/:id/submit', upload.array('file', 10), TaskController.submitTask);
router.post('/:id/review', TaskController.reviewTask);
router.put('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

module.exports = router;

