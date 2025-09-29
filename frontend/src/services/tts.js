import { ttsAPI } from './api';

class TTSService {
  constructor() {
    this.isSupported = 'speechSynthesis' in window;
    this.isSpeaking = false;
    this.currentUtterance = null;
    this.voices = [];
    this.selectedVoice = null;
    this.settings = {
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      lang: 'pl-PL'
    };

    if (this.isSupported) {
      this.initVoices();
    }
  }

  initVoices() {
    const updateVoices = () => {
      this.voices = speechSynthesis.getVoices();
      // Try to find Polish voice
      this.selectedVoice = this.voices.find(voice => 
        voice.lang.startsWith('pl') || voice.name.toLowerCase().includes('pol')
      ) || this.voices[0];
    };

    updateVoices();
    speechSynthesis.addEventListener('voiceschanged', updateVoices);
  }

  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.isSupported) {
        // Fallback to server TTS
        this.speakWithServer(text, options)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (this.isSpeaking) {
        this.stop();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Apply settings
      utterance.rate = options.rate || this.settings.rate;
      utterance.pitch = options.pitch || this.settings.pitch;
      utterance.volume = options.volume || this.settings.volume;
      utterance.lang = options.lang || this.settings.lang;
      
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.currentUtterance = utterance;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (error) => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        console.error('TTS Error:', error);
        
        // Fallback to server TTS on error
        this.speakWithServer(text, options)
          .then(resolve)
          .catch(reject);
      };

      speechSynthesis.speak(utterance);
    });
  }

  async speakWithServer(text, options = {}) {
    try {
      const response = await ttsAPI.synthesize(text, {
        language: options.lang || 'pl',
        speed: options.rate || 1.0
      });

      const audioBlob = response.data;
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.volume = options.volume || this.settings.volume;
      audio.playbackRate = options.rate || this.settings.rate;

      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          this.isSpeaking = false;
          resolve();
        };

        audio.onerror = (error) => {
          URL.revokeObjectURL(audioUrl);
          this.isSpeaking = false;
          reject(error);
        };

        this.isSpeaking = true;
        audio.play();
      });
    } catch (error) {
      console.error('Server TTS Error:', error);
      throw error;
    }
  }

  stop() {
    if (this.isSupported && this.isSpeaking) {
      speechSynthesis.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  pause() {
    if (this.isSupported && this.isSpeaking) {
      speechSynthesis.pause();
    }
  }

  resume() {
    if (this.isSupported) {
      speechSynthesis.resume();
    }
  }

  setVoice(voiceIndex) {
    if (this.voices[voiceIndex]) {
      this.selectedVoice = this.voices[voiceIndex];
    }
  }

  setSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
  }

  getVoices() {
    return this.voices;
  }

  getSettings() {
    return this.settings;
  }

  getStatus() {
    return {
      isSupported: this.isSupported,
      isSpeaking: this.isSpeaking,
      selectedVoice: this.selectedVoice?.name,
      voiceCount: this.voices.length
    };
  }

  // Utility method to clean text for TTS
  cleanTextForTTS(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold
      .replace(/\*(.*?)\*/g, '$1') // Remove markdown italic
      .replace(/`(.*?)`/g, '$1') // Remove markdown code
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove markdown links
      .replace(/[#\-\+\*]/g, '') // Remove markdown symbols
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }
}

export default new TTSService();