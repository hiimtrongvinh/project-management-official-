const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/task.controller');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/roleGuard');
const { checkTaskAccess, checkProjectAccess } = require('../middleware/accessGuard');
const upload = require('../middleware/upload');

// All routes require authentication
router.use(authenticate);

router.get('/my-tasks', TaskController.getMyTasks);
router.get('/project/:projectId', checkProjectAccess, TaskController.getTasksByProject);
router.get('/download-secure', TaskController.downloadSecureFile);
router.get('/:id', checkTaskAccess('view'), TaskController.getTaskById);
router.post('/', authorize('admin'), TaskController.createTask);
router.post('/:id/submit', upload.array('file', 10), checkTaskAccess('submit'), TaskController.submitTask);
router.post('/:id/review', authorize('admin', 'client'), checkTaskAccess('review'), TaskController.reviewTask);
router.put('/:id', authorize('admin'), TaskController.updateTask);
router.delete('/:id', authorize('admin'), TaskController.deleteTask);

module.exports = router;

