const pool = require('../models/database');
const path = require('path');
const fs = require('fs');

const audioController = {
    async uploadAudio(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const { description, category } = req.body;
            const userId = req.session.userId;

            const result = await pool.query(
                'INSERT INTO audio_files (user_id, filename, original_name, file_path, description, category, file_size) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [
                    userId,
                    req.file.filename,
                    req.file.originalname,
                    req.file.path,
                    description,
                    category,
                    req.file.size
                ]
            );

            res.status(201).json({
                message: 'Audio file uploaded successfully',
                audio: result.rows[0]
            });
        } catch (error) {
            console.error('Upload audio error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async getUserAudioFiles(req, res) {
        try {
            const userId = req.session.userId;

            const result = await pool.query(
                'SELECT * FROM audio_files WHERE user_id = $1 ORDER BY created_at DESC',
                [userId]
            );

            res.json({
                audioFiles: result.rows
            });
        } catch (error) {
            console.error('Get audio files error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async getAudioFile(req, res) {
        try {
            const audioId = req.params.id;
            const userId = req.session.userId;

            const result = await pool.query(
                'SELECT * FROM audio_files WHERE id = $1 AND user_id = $2',
                [audioId, userId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Audio file not found' });
            }

            const audioFile = result.rows[0];
            const filePath = path.resolve(audioFile.file_path);

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ message: 'File not found on server' });
            }

            res.sendFile(filePath);
        } catch (error) {
            console.error('Get audio file error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async deleteAudioFile(req, res) {
        try {
            const audioId = req.params.id;
            const userId = req.session.userId;

            const result = await pool.query(
                'SELECT * FROM audio_files WHERE id = $1 AND user_id = $2',
                [audioId, userId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Audio file not found' });
            }

            const audioFile = result.rows[0];

            // Delete file from filesystem
            if (fs.existsSync(audioFile.file_path)) {
                fs.unlinkSync(audioFile.file_path);
            }

            // Delete from database
            await pool.query('DELETE FROM audio_files WHERE id = $1', [audioId]);

            res.json({ message: 'Audio file deleted successfully' });
        } catch (error) {
            console.error('Delete audio file error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = audioController;