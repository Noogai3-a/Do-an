const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadDocumentController = require('../controllers/uploadDocumentController');

// Lưu file vào thư mục uploads/
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/upload', upload.single('file'), uploadDocumentController.uploadDocument);

module.exports = router;
