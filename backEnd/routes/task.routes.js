const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const TaskController = require('../controllers/task.controller');
const authenticate = require('../middleware/auth');

// Configure Multer storage
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// All routes require authentication
router.use(authenticate);

router.get('/my-tasks', TaskController.getMyTasks);
router.get('/project/:projectId', TaskController.getTasksByProject);
router.post('/', TaskController.createTask);
router.post('/:id/submit', upload.array('file',10), TaskController.submitTask);
router.post('/:id/review', TaskController.reviewTask);
router.put('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);
upload.fields([{ name: 'images', maxCount: 5 }, { name: 'docs', maxCount: 5 }])
module.exports = router;

