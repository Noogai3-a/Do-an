const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})
const multer = require('multer'); // Nếu chưa có

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('[Multer Error]', err);
    return res.status(400).json({ message: 'Lỗi Multer: ' + err.message });
  }
  if (err) {
    console.error('[Unknown Upload Error]', err);
    return res.status(500).json({ message: 'Lỗi không xác định khi upload' });
  }
  next();
});

module.exports = mongoose.model('Admin', UserSchema);