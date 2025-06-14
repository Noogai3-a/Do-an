const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Đường dẫn tạm để lưu file
const blogAdminController = require('../controllers/blogAdminController');
const requireAdmin = require('../middleware/requireAdmin');
const documentController = require('../controllers/documentController');
const adminController = require('../controllers/adminController');

router.get('/stats', requireAdmin, blogAdminController.getAdminStats);

router.get('/blogs', requireAdmin, blogAdminController.getAllItemsForAdmin);

// Route lấy danh sách bài chưa duyệt
router.get('/pending-blogs', requireAdmin, blogAdminController.getPendingBlogs);

// Route duyệt bài (approve)
router.put('/approve-blog/:id', requireAdmin, blogAdminController.approveBlog);

router.put('/approve-document/:id', documentController.approveDocument);

router.post(
  '/upload-multiple',
  requireAdmin,
  upload.array('files', 10), // cho phép tối đa 10 file/lần
  adminController.uploadMultipleDocuments
);

module.exports = router;
