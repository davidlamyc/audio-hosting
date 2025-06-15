const bcrypt = require('bcryptjs');
const pool = require('../models/database');

const userController = {
    async createUser(req, res) {
        try {
            const { username, email, password } = req.body;

            // Check if user already exists
            const existingUser = await pool.query(
                'SELECT * FROM users WHERE username = $1 OR email = $2',
                [username, email]
            );

            if (existingUser.rows.length > 0) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user
            const result = await pool.query(
                'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
                [username, email, hashedPassword]
            );

            res.status(201).json({
                message: 'User created successfully',
                user: result.rows[0]
            });
        } catch (error) {
            console.error('Create user error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async updateUser(req, res) {
        try {
            const userId = req.params.id;
            const { username, email } = req.body;

            // Check if user exists and belongs to session user
            // if (parseInt(userId) !== req.session.userId) {
            //     return res.status(403).json({ message: 'Unauthorized' });
            // }

            const result = await pool.query(
                'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email',
                [username, email, userId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({
                message: 'User updated successfully',
                user: result.rows[0]
            });
        } catch (error) {
            console.error('Update user error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async deleteUser(req, res) {
        try {
            const userId = req.params.id;

            // Check if user belongs to session user
            // if (parseInt(userId) !== req.session.userId) {
            //     return res.status(403).json({ message: 'Unauthorized' });
            // }

            // Delete user's audio files first
            await pool.query('DELETE FROM audio_files WHERE user_id = $1', [userId]);

            // Delete user
            const result = await pool.query('DELETE FROM users WHERE id = $1', [userId]);

            if (result.rowCount === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Destroy session
            // req.session.destroy();

            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async getUsers(req, res) {
        try {

            const result = await pool.query(
                'SELECT * FROM users'
            );

            res.json({
                users: result.rows
            });
        } catch (error) {
            console.error('Get users error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
};

module.exports = userController;