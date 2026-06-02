const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

/**
 * Allowed MIME types for file uploads.
 * Supports: PDF, Word (doc/docx), Excel (xls/xlsx), DWG, PNG, JPEG
 */
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/png',
  'image/jpeg',
  'application/octet-stream' // for .dwg files
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Multer disk storage configuration.
 * Files are dynamically stored based on environment and sorted into subfolders.
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // process.cwd() tự lấy đường dẫn gốc của project Back-end trên cả Local và VPS
    let targetPath = path.join(process.cwd(), 'uploads');

    // Tự động phân loại thư mục con theo định dạng file
    if (file.mimetype.startsWith('image/')) {
      targetPath = path.join(targetPath, 'images');
    } else {
      targetPath = path.join(targetPath, 'documents');
    }

    // Tự động tạo cây thư mục nếu chưa tồn tại, tránh lỗi sập server (ENOENT)
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }

    cb(null, targetPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`; // Đổi tên file sang chuỗi UUID ngẫu nhiên để tránh trùng lặp
    cb(null, filename);
  }
});

/**
 * File filter to validate MIME types.
 */
function fileFilter(req, file, cb) {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error('File type not allowed. Accepted types: PDF, DOCX, XLSX, DWG, PNG, JPG.');
    error.statusCode = 400;
    cb(error, false);
  }
}

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter
});

module.exports = upload;