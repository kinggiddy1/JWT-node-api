const express = require('express');
const { upload } = require('../controllers/fileController');
const router = express.Router();



// Upload route
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ message: 'File uploaded successfully', file: req.file });
});

module.exports = router;
