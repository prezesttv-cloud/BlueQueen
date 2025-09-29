const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const router = express.Router();

// Simple in-memory user storage (for demo purposes)
// In production, use a proper database
const users = [
    {
        id: 1,
        username: 'demo',
        email: 'demo@blueQueen.pl',
        passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    }
];

// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Wszystkie pola są wymagane' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Hasło musi mieć co najmniej 6 znaków' });
        }

        // Check if user exists
        const existingUser = users.find(u => u.username === username || u.email === email);
        if (existingUser) {
            return res.status(400).json({ error: 'Użytkownik już istnieje' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = {
            id: users.length + 1,
            username,
            email,
            passwordHash
        };

        users.push(newUser);

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.id, username: newUser.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        logger.info(`New user registered: ${username}`);

        res.status(201).json({
            message: 'Użytkownik utworzony pomyślnie',
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error) {
        logger.error('Registration error:', error);
        res.status(500).json({ error: 'Błąd serwera podczas rejestracji' });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Nazwa użytkownika i hasło są wymagane' });
        }

        // Find user
        const user = users.find(u => u.username === username || u.email === username);
        if (!user) {
            return res.status(401).json({ error: 'Nieprawidłowe dane logowania' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Nieprawidłowe dane logowania' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        logger.info(`User logged in: ${username}`);

        res.json({
            message: 'Zalogowano pomyślnie',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        logger.error('Login error:', error);
        res.status(500).json({ error: 'Błąd serwera podczas logowania' });
    }
});

// Token validation endpoint
router.get('/validate', (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ valid: false, error: 'Brak tokenu' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = users.find(u => u.id === decoded.userId);
        
        if (!user) {
            return res.status(401).json({ valid: false, error: 'Użytkownik nie istnieje' });
        }

        res.json({
            valid: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(401).json({ valid: false, error: 'Nieprawidłowy token' });
    }
});

module.exports = router;