const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../models/database');

const authController = {
    async login(req, res) {
        try {
            const { username, password } = req.body;

            // Find user
            const userResult = await pool.query(
                'SELECT * FROM users WHERE username = $1',
                [username]
            );

            if (userResult.rows.length === 0) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const user = userResult.rows[0];

            // Check password
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Create session
            req.session.userId = user.id;
            req.session.username = user.username;

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, username: user.username },
                process.env.JWT_SECRET || 'jwt-secret',
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                },
                token
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: 'Could not log out' });
            }
            res.json({ message: 'Logout successful' });
        });
    },

    async checkAuth(req, res) {
        if (req.session.userId) {
            res.json({
                authenticated: true,
                user: {
                    id: req.session.userId,
                    username: req.session.username
                }
            });
        } else {
            res.json({ authenticated: false });
        }
    }
};

module.exports = authController;