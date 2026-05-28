const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/projects', require('./routes/project.routes'));
app.use('/api/tasks', require('./routes/task.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/materials', require('./routes/material.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/reports', require('./routes/report.routes'));
app.use('/api/categories', require('./routes/category.routes'));

// Global error handler
app.use(require('./middleware/errorHandler'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Khởi tạo cron job quét deadline mỗi giờ
  const { checkDeadlines } = require('./cron/deadlineChecker');
  // Chạy lần đầu sau 10 giây (chờ DB kết nối)
  setTimeout(checkDeadlines, 10000);
  // Lặp lại mỗi 3 phút
  setInterval(checkDeadlines, 3 * 60 * 1000);
});

module.exports = app;
