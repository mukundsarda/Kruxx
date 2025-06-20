import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaStop, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

const TextToSpeech = ({ text, language = 'en' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speech, setSpeech] = useState(null);
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();
    
    if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const getVoiceForLanguage = (lang) => {
    // Try to find a voice that matches the language
    const languageVoice = availableVoices.find(voice => 
      voice.lang.toLowerCase().startsWith(lang.toLowerCase())
    );

    // If no specific language voice found, try to find a female voice
    if (!languageVoice) {
      return availableVoices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('woman')
      );
    }

    return languageVoice;
  };

  const handleSpeak = () => {
    const synth = window.speechSynthesis;

    if (!isPlaying) {
      if (isPaused && speech) {
        synth.resume();
        setIsPlaying(true);
        setIsPaused(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set the language and find appropriate voice
        utterance.lang = language;
        const voice = getVoiceForLanguage(language);
        if (voice) {
          utterance.voice = voice;
        }

        utterance.rate = rate;
        utterance.pitch = 1.2;
        utterance.volume = isMuted ? 0 : volume;
        
        utterance.onend = () => {
          setIsPlaying(false);
          setIsPaused(false);
          setSpeech(null);
        };

        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          setIsPlaying(false);
          setIsPaused(false);
          setSpeech(null);
        };

        setSpeech(utterance);
        synth.speak(utterance);
        setIsPlaying(true);
        setIsPaused(false);
      }
    } else {
      synth.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setSpeech(null);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    if (speech) {
      speech.volume = !isMuted ? 0 : volume;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (speech) {
      speech.volume = isMuted ? 0 : newVolume;
    }
  };

  const handleRateChange = (e) => {
    const newRate = parseFloat(e.target.value);
    setRate(newRate);
    if (speech) {
      speech.rate = newRate;
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      <div className="flex items-center gap-4">
        <button
          onClick={handleSpeak}
          className="flex items-center gap-2 bg-orange-400 text-white px-4 py-2 rounded-md hover:bg-orange-500 transition-colors"
        >
          {isPlaying ? <FaPause className="text-lg" /> : <FaPlay className="text-lg" />}
          {isPlaying ? 'Pause' : (isPaused ? 'Resume' : 'Listen')}
        </button>
        {(isPlaying || isPaused) && (
          <button
            onClick={handleStop}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            <FaStop className="text-lg" />
            Stop
          </button>
        )}
        <button
          onClick={handleMute}
          className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
        >
          {isMuted ? <FaVolumeMute className="text-lg" /> : <FaVolumeUp className="text-lg" />}
        </button>
      </div>
      
      <div className="flex items-center gap-4 w-full max-w-md">
        <div className="flex flex-col items-center gap-2 w-1/2">
          <label className="text-sm text-gray-600">Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full"
          />
        </div>
        
        <div className="flex flex-col items-center gap-2 w-1/2">
          <label className="text-sm text-gray-600">Speed</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={handleRateChange}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech; 