const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/task.controller');
const authenticate = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/debug-logs', async (req, res) => {
  try {
    const fs = require('fs');
    const path = '/var/log/nginx/access.log';
    if (!fs.existsSync(path)) {
      return res.json({ success: false, error: 'Log file not found' });
    }
    const logContent = fs.readFileSync(path, 'utf8');
    const lines = logContent.split('\n').filter(Boolean).slice(-100);
    res.json({ success: true, lines });
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

