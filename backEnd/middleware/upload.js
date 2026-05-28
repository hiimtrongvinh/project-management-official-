const multer = require('multer');
const path = require('path');
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
 * Files are stored in 'uploads/' directory with UUID-based filenames.
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
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
