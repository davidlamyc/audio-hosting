const express = require('express');
const audioController = require('../controllers/audioController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/upload', authMiddleware, upload.single('audio'), audioController.uploadAudio);
router.get('/', authMiddleware, audioController.getUserAudioFiles);
router.get('/:id', authMiddleware, audioController.getAudioFile);
router.delete('/:id', authMiddleware, audioController.deleteAudioFile);

module.exports = router;