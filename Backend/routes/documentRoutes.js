const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const authMiddleware = require('../middleware/authMiddleware');
const { check, validationResult } = require('express-validator');

// Lấy danh sách tài liệu mới nhất
router.get('/newest', [
  check('limit').optional().isInt({ min: 1, max: 20 }).toInt()
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const limit = req.query.limit || 3;
    const documents = await Document.find({ status: 'approved' })
      .sort({ uploadDate: -1 })
      .limit(limit)
      .select('_id title thumbnailImage subjectTypeLabel subjectNameLabel uploadDate views')
      .lean();

    res.json({ documents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Lấy danh sách tài liệu phổ biến
router.get('/popular', [
  check('limit').optional().isInt({ min: 1, max: 20 }).toInt()
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const limit = req.query.limit || 3;
    const documents = await Document.find({ status: 'approved' })
      .sort({ views: -1, uploadDate: -1 })
      .limit(limit)
      .select('_id title thumbnailImage subjectTypeLabel subjectNameLabel uploadDate views')
      .lean();

    res.json({ documents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Lấy tài liệu theo subject
router.get('/by-subject/:subjectTypeSlug/:subjectNameSlug', async (req, res) => {
  try {
    const { subjectTypeSlug, subjectNameSlug } = req.params;
    
    const documents = await Document.find({
      subjectTypeSlug,
      subjectNameSlug,
      status: 'approved'
    })
    .sort({ uploadDate: -1 })
    .select('_id title uploadDate views')
    .lean();

    res.json({ documents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Lấy chi tiết tài liệu
router.get('/:id', async (req, res) => {
  try {
    const document = await Document.findOneAndUpdate(
      { _id: req.params.id, status: 'approved' },
      { $inc: { views: 1 } }, // Tăng view count
      { new: true }
    ).lean();

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json(document);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;