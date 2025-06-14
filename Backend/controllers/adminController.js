const Document = require('../models/Document');

exports.uploadMultipleDocuments = async (req, res) => {
  try {
    const { titlePrefix, documentType, subjectTypeSlug, subjectNameSlug } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'Chưa chọn file nào' });
    }

    const documents = files.map((file, index) => ({
      title: `${titlePrefix || 'Tài liệu'} ${index + 1}`,
      documentType,
      subjectTypeSlug,
      subjectNameSlug,
      fileUrl: `/uploads/${file.filename}`,
      uploader: 'Admin',
      status: 'approved',
      uploadDate: new Date()
    }));

    const inserted = await Document.insertMany(documents);

    res.json({ success: true, insertedCount: inserted.length, documents: inserted });
  } catch (err) {
    console.error('[uploadMultipleDocuments]', err);
    res.status(500).json({ message: 'Lỗi máy chủ khi upload nhiều file' });
  }
};
