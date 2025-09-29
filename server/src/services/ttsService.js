const gtts = require('node-gtts');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');

class TTSService {
  constructor() {
    // Create audio directory if it doesn't exist
    this.audioDir = path.join(__dirname, '../../audio');
    this.ensureAudioDirectory();
    
    // Cleanup old audio files periodically (every hour)
    setInterval(() => this.cleanupOldFiles(), 60 * 60 * 1000);
  }

  async ensureAudioDirectory() {
    try {
      await fs.mkdir(this.audioDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create audio directory:', error);
    }
  }

  async generateSpeech(text, userId) {
    try {
      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        throw new Error('Invalid text provided for TTS');
      }

      // Limit text length to prevent very long audio files
      const maxLength = 1000;
      const truncatedText = text.length > maxLength ? 
        text.substring(0, maxLength) + '...' : text;

      const audioId = uuidv4();
      const fileName = `tts_${audioId}.mp3`;
      const filePath = path.join(this.audioDir, fileName);

      console.log(`[TTS] Generating speech for user ${userId}: ${truncatedText.substring(0, 50)}...`);

      // Create TTS instance for Polish language
      const speech = gtts('pl');
      
      return new Promise((resolve, reject) => {
        speech.save(filePath, truncatedText, (err) => {
          if (err) {
            console.error('TTS generation error:', err);
            reject(new Error('Failed to generate speech'));
            return;
          }

          // Return relative URL for client access
          const audioUrl = `/api/audio/file/${fileName}`;
          console.log(`[TTS] Speech generated successfully: ${audioUrl}`);
          resolve(audioUrl);
        });
      });

    } catch (error) {
      console.error('TTS service error:', error);
      throw new Error('Speech generation failed');
    }
  }

  async getAudioFile(fileName) {
    try {
      const filePath = path.join(this.audioDir, fileName);
      
      // Check if file exists and is valid
      const stats = await fs.stat(filePath);
      if (!stats.isFile()) {
        throw new Error('File not found');
      }

      return filePath;
    } catch (error) {
      console.error('Audio file retrieval error:', error);
      throw new Error('Audio file not found');
    }
  }

  async cleanupOldFiles() {
    try {
      const files = await fs.readdir(this.audioDir);
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      for (const file of files) {
        if (file.startsWith('tts_') && file.endsWith('.mp3')) {
          const filePath = path.join(this.audioDir, file);
          const stats = await fs.stat(filePath);
          
          if (now - stats.mtime.getTime() > maxAge) {
            await fs.unlink(filePath);
            console.log(`[TTS] Cleaned up old audio file: ${file}`);
          }
        }
      }
    } catch (error) {
      console.error('Audio cleanup error:', error);
    }
  }

  // Get TTS service statistics
  async getStats() {
    try {
      const files = await fs.readdir(this.audioDir);
      const audioFiles = files.filter(f => f.startsWith('tts_') && f.endsWith('.mp3'));
      
      return {
        totalFiles: audioFiles.length,
        audioDirectory: this.audioDir
      };
    } catch (error) {
      return { totalFiles: 0, audioDirectory: this.audioDir };
    }
  }
}

module.exports = new TTSService();