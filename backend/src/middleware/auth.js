const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ error: 'Brak tokenu autoryzacji' });
        }

        const token = authHeader.split(' ')[1]; // Bearer TOKEN
        
        if (!token) {
            return res.status(401).json({ error: 'Nieprawidłowy format tokenu' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        
        logger.info(`User ${decoded.userId} authenticated successfully`);
        next();
    } catch (error) {
        logger.error('Authentication error:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token wygasł' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Nieprawidłowy token' });
        }
        
        return res.status(401).json({ error: 'Błąd autoryzacji' });
    }
};

module.exports = authMiddleware;