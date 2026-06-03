const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/task.controller');
const authenticate = require('../middleware/auth');
const upload = require('../middleware/upload');

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

