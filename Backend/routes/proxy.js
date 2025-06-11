const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/proxy-image', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('Thiếu URL');

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    res.set('Content-Type', response.headers['content-type']);
    res.send(response.data);
  } catch (err) {
    res.status(500).send('Lỗi khi lấy ảnh từ Google Drive');
  }
});

module.exports = router;
