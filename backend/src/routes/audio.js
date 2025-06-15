const express = require('express');
const audioController = require('../controllers/audioController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

/**
 * @swagger
 * /audio/upload:
 *   post:
 *     summary: Upload audio file
 *     description: Upload an audio file with metadata
 *     tags: [Audio Files]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - audio
 *               - description
 *               - category
 *             properties:
 *               audio:
 *                 type: string
 *                 format: binary
 *                 description: Audio file to upload (max 50MB)
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 description: Description of the audio file
 *                 example: "My awesome podcast episode"
 *               category:
 *                 type: string
 *                 enum: [music, podcast, audiobook, sound-effect, voice-recording, other]
 *                 description: Category of the audio file
 *                 example: "podcast"
 *     responses:
 *       201:
 *         description: Audio file uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AudioUploadResponse'
 *       400:
 *         description: No file uploaded or invalid file type
 *       401:
 *         description: Authentication required
 *       413:
 *         description: File too large (max 50MB)
 *       500:
 *         description: Internal server error
 */
router.post('/upload', authMiddleware, upload.single('audio'), audioController.uploadAudio);

/**
 * @swagger
 * /audio:
 *   get:
 *     summary: Get user's audio files
 *     description: Retrieve all audio files uploaded by the authenticated user
 *     tags: [Audio Files]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: List of user's audio files
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AudioListResponse'
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
router.get('/', authMiddleware, audioController.getUserAudioFiles);

/**
 * @swagger
 * /audio/{id}:
 *   get:
 *     summary: Stream/download audio file
 *     description: Stream or download a specific audio file (only accessible to the owner)
 *     tags: [Audio Files]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Audio file ID
 *     responses:
 *       200:
 *         description: Audio file stream
 *         content:
 *           audio/*:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Audio file not found or not accessible
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authMiddleware, audioController.getAudioFile);

/**
 * @swagger
 * /audio/{id}:
 *   delete:
 *     summary: Delete audio file
 *     description: Delete an audio file and remove it from storage
 *     tags: [Audio Files]
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Audio file ID
 *     responses:
 *       200:
 *         description: Audio file deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Audio file deleted successfully"
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Audio file not found or not accessible
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authMiddleware, audioController.deleteAudioFile);

module.exports = router;