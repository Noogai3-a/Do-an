// routes/userRouter.js
const express = require('express');
const router = express.Router();
const { requireLogin, requireUser } = require('../middleware/authMiddleware');

// Các route dành riêng cho USER
router.get('/userQL', requireLogin, requireUser, (req, res) => {
  res.json({ msg: 'Đây là trang quản lý của user' });
});

router.get('/usertk', requireLogin, requireUser, (req, res) => {
  res.json({ msg: 'Đây là trang thông tin tài khoản user' });
});

module.exports = router;
