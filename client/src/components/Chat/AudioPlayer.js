import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, X, RotateCcw } from 'lucide-react';
import './AudioPlayer.css';

const AudioPlayer = ({ audioUrl, text, onComplete, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (onComplete) {
        onComplete();
      }
    };

    const handleError = (e) => {
      console.error('Audio playback error:', e);
      setError('Nie udało się odtworzyć audio');
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      // Auto-play the audio
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error('Auto-play failed:', error);
        setError('Kliknij play aby odtworzyć audio');
      });
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [onComplete]);

  const handlePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Play/pause error:', error);
      setError('Błąd odtwarzania audio');
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleRestart = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    setCurrentTime(0);
    if (!isPlaying) {
      handlePlayPause();
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  };

  return (
    <div className="audio-player-overlay">
      <div className="audio-player">
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="auto"
        />

        <div className="audio-player-header">
          <div className="audio-title">
            <Volume2 size={16} />
            <span>Odtwarzanie odpowiedzi Blue Queen</span>
          </div>
          <button
            className="close-btn"
            onClick={onClose}
            title="Zamknij"
          >
            <X size={16} />
          </button>
        </div>

        <div className="audio-text">
          <p>{text}</p>
        </div>

        {error ? (
          <div className="audio-error">
            <p>{error}</p>
          </div>
        ) : (
          <div className="audio-controls">
            <button
              className="control-btn restart-btn"
              onClick={handleRestart}
              disabled={isLoading}
              title="Od początku"
            >
              <RotateCcw size={16} />
            </button>

            <button
              className="control-btn play-btn"
              onClick={handlePlayPause}
              disabled={isLoading}
              title={isPlaying ? 'Pauza' : 'Odtwórz'}
            >
              {isLoading ? (
                <div className="loading-spinner" />
              ) : isPlaying ? (
                <Pause size={20} />
              ) : (
                <Play size={20} />
              )}
            </button>

            <div className="time-display">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        )}

        <div className="progress-container">
          <div
            className="progress-bar"
            onClick={handleSeek}
          >
            <div
              className="progress-fill"
              style={{ width: `${getProgressPercentage()}%` }}
            />
            <div
              className="progress-handle"
              style={{ left: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;