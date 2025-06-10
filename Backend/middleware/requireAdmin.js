function isAdmin(req, res, next) {
  if (!req.session.admin) {
    return res.status(403).json({ error: 'Không có quyền truy cập admin' });
  }
  next();
}
