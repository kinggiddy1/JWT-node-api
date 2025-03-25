const express = require('express');
const { upload, uploadFile  } = require('../controllers/fileController');
const router = express.Router();



// Upload route
router.post('/upload', upload.single('file'), uploadFile);

module.exports = router;
