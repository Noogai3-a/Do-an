function isAdmin(req, res, next) {
  const admin = req.session.admin;
  if (!admin || !admin.username || admin.username !== 'admin') {
    return res.status(403).json({ error: 'Không có quyền truy cập admin' });
  }
  next();
}
