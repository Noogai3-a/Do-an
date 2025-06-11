const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

// [GET] /api/documents/by-subject/:subjectTypeSlug/:subjectNameSlug
router.get(
  '/by-subject/:subjectTypeSlug/:subjectNameSlug',
  documentController.getDocumentsBySubject
);

// [GET] /api/documents/latest
router.get('/latest', documentController.getLatestDocuments);

// [GET] /api/documents/popular
router.get('/popular', documentController.getPopularDocuments);

module.exports = router;
