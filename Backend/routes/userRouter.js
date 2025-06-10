const express = require('express');
const router = express.Router();

// Middleware kiểm tra đăng nhập
function requireLogin(req, res, next) {
  if (!req.session.user && !req.session.admin) {
    return res.status(401).json({ msg: 'Bạn chưa đăng nhập' });
  }
  next();
}

// Middleware kiểm tra role user
function requireUser(req, res, next) {
  if (req.session.user?.role === 'user') return next();
  return res.status(403).json({ msg: 'Chỉ người dùng được truy cập' });
}

// Trang quản lý user - chỉ cho user
router.get('/userql', requireLogin, requireUser, (req, res) => {
  res.json({ msg: 'Đây là trang userQL' });
});

router.get('/usertk', requireLogin, requireUser, (req, res) => {
  res.json({ msg: 'Đây là trang usertk' });
});

module.exports = router;
