const express = require('express');
const gtts = require('node-gtts')(process.env.TTS_LANGUAGE || 'pl');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const router = express.Router();

// Create temp directory for audio files
const tempDir = path.join(__dirname, '../../temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Convert text to speech
router.post('/synthesize', async (req, res) => {
    try {
        const { text, speed = 1.0, language = 'pl' } = req.body;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: 'Tekst nie może być pusty' });
        }

        if (text.length > 1000) {
            return res.status(400).json({ error: 'Tekst jest zbyt długi (maksymalnie 1000 znaków)' });
        }

        const fileName = `tts_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.mp3`;
        const filePath = path.join(tempDir, fileName);

        // Create TTS instance with specified language
        const ttsInstance = require('node-gtts')(language);

        // Generate audio file
        await new Promise((resolve, reject) => {
            ttsInstance.save(filePath, text, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        logger.info(`TTS file generated: ${fileName} for user ${req.user.userId}`);

        // Send file as response
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Cache-Control', 'no-cache');

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        // Clean up file after sending
        fileStream.on('end', () => {
            setTimeout(() => {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        logger.error('Error deleting TTS file:', err);
                    } else {
                        logger.info(`TTS file cleaned up: ${fileName}`);
                    }
                });
            }, 5000); // Delete after 5 seconds
        });

    } catch (error) {
        logger.error('TTS synthesis error:', error);
        res.status(500).json({ 
            error: 'Błąd generowania mowy',
            message: 'Nie udało się wygenerować pliku audio'
        });
    }
});

// Get available TTS languages
router.get('/languages', (req, res) => {
    try {
        const supportedLanguages = [
            { code: 'pl', name: 'Polski' },
            { code: 'en', name: 'English' },
            { code: 'de', name: 'Deutsch' },
            { code: 'fr', name: 'Français' },
            { code: 'es', name: 'Español' },
            { code: 'it', name: 'Italiano' },
            { code: 'pt', name: 'Português' },
            { code: 'ru', name: 'Русский' },
            { code: 'ja', name: '日本語' },
            { code: 'ko', name: '한국어' },
            { code: 'zh', name: '中文' }
        ];

        res.json({
            success: true,
            languages: supportedLanguages,
            default: process.env.TTS_LANGUAGE || 'pl'
        });
    } catch (error) {
        logger.error('Error getting TTS languages:', error);
        res.status(500).json({ error: 'Błąd pobierania listy języków' });
    }
});

// Get TTS settings
router.get('/settings', (req, res) => {
    try {
        res.json({
            success: true,
            settings: {
                defaultLanguage: process.env.TTS_LANGUAGE || 'pl',
                defaultSpeed: parseFloat(process.env.TTS_SPEED) || 1.0,
                maxTextLength: 1000,
                supportedFormats: ['mp3']
            }
        });
    } catch (error) {
        logger.error('Error getting TTS settings:', error);
        res.status(500).json({ error: 'Błąd pobierania ustawień TTS' });
    }
});

// Clean up old temporary files
const cleanupOldFiles = () => {
    try {
        const files = fs.readdirSync(tempDir);
        const now = Date.now();
        const maxAge = 3600000; // 1 hour

        files.forEach(file => {
            const filePath = path.join(tempDir, file);
            const stats = fs.statSync(filePath);
            
            if (now - stats.mtime.getTime() > maxAge) {
                fs.unlinkSync(filePath);
                logger.info(`Cleaned up old TTS file: ${file}`);
            }
        });
    } catch (error) {
        logger.error('Error cleaning up TTS files:', error);
    }
};

// Schedule cleanup every 30 minutes
setInterval(cleanupOldFiles, 30 * 60 * 1000);

module.exports = router;