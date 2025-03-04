import React, { useState } from 'react';
// import axios from 'axios';
import TextToSpeech from '../components/TextToSpeech';
import Translation from '../components/Translation';
import { FaPlay, FaPause, FaStop, FaVolumeUp, FaVolumeMute } from "react-icons/fa";

const UploadImage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedOption1, setSelectedOption1] = useState('faster');
  const [selectedOption2, setSelectedOption2] = useState('abstractive');
  const [selectedOption3, setSelectedOption3] = useState('short');
  const [message, setMessage] = useState('');
  const [summary, setSummary] = useState('');  // State to store summary text
  const [translatedText, setTranslatedText] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speech, setSpeech] = useState(null);
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setMessage('Please upload an image.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('performance', selectedOption1);
    formData.append('summaryType', selectedOption2);
    formData.append('summaryLength', selectedOption3);

    try {
      const response = await fetch('http://127.0.0.1:5000/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Set the summary text from the response
        setSummary(data.summary);
      } else {
        setMessage(data.message || 'An error occurred while uploading the image.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
      console.error('Error:', error);
    }
  };

  const handleSpeak = () => {
    const synth = window.speechSynthesis;
    const textToSpeak = translatedText || summary;

    if (!isPlaying) {
      if (isPaused && speech) {
        synth.resume();
        setIsPlaying(true);
        setIsPaused(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = currentLanguage;
        utterance.rate = rate;
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

  return (
    <div className="relative bg-orange-400 flex flex-col justify-center items-center text-white text-center pt-24 pb-56 m-5 rounded-xl">
      <div className="w-[60%] flex flex-col justify-center items-center space-y-6">
        <h2 className="text-2xl font-bold">Upload an Image</h2>
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Selected"
            className="mt-4 w-40 h-40 object-cover rounded-full shadow"
          />
        )}
        <label
          htmlFor="imageInput"
          className="cursor-pointer bg-white text-orange-400 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
        >
          Choose Image
        </label>
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      <div className="w-[60%] flex justify-center items-start space-y-6 text-white">
        <div className="w-full flex flex-col items-center justify-start py-6">
          <div>
            <p className="text-lg font-semibold">Choose Performance:</p>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="performance"
                value="faster"
                checked={selectedOption1 === 'faster'}
                onChange={(e) => setSelectedOption1(e.target.value)}
                className="cursor-pointer"
              />
              <span>Faster</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="performance"
                value="better"
                checked={selectedOption1 === 'better'}
                onChange={(e) => setSelectedOption1(e.target.value)}
                className="cursor-pointer"
              />
              <span>Better</span>
            </label>
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-start space-y-3">
          <div>
            <p className="text-lg font-semibold">Choose Summary Type:</p>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="summaryType"
                value="abstractive"
                checked={selectedOption2 === 'abstractive'}
                onChange={(e) => setSelectedOption2(e.target.value)}
                className="cursor-pointer"
              />
              <span>Abstractive</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="summaryType"
                value="extractive"
                checked={selectedOption2 === 'extractive'}
                onChange={(e) => setSelectedOption2(e.target.value)}
                className="cursor-pointer"
              />
              <span>Extractive</span>
            </label>
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-start space-y-3">
          <div>
            <p className="text-lg font-semibold">Choose Summary Length:</p>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="summaryLength"
                value="short"
                checked={selectedOption3 === 'short'}
                onChange={(e) => setSelectedOption3(e.target.value)}
                className="cursor-pointer"
              />
              <span>Short</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="summaryLength"
                value="medium"
                checked={selectedOption3 === 'medium'}
                onChange={(e) => setSelectedOption3(e.target.value)}
                className="cursor-pointer"
              />
              <span>Medium</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="summaryLength"
                value="long"
                checked={selectedOption3 === 'long'}
                onChange={(e) => setSelectedOption3(e.target.value)}
                className="cursor-pointer"
              />
              <span>Long</span>
            </label>
          </div>
        </div>
      </div>

      <div className={`${summary ? "" : "absolute bottom-20"} w-1/3 mt-16 bg-white shadow-lg rounded-xl p-6 flex flex-col justify-center items-center`}>
        <div className="flex flex-row justify-around flex-wrap gap-8">
          <button
            className="bg-orange-400 text-white px-6 py-2 rounded-md hover:bg-orange-500"
            onClick={handleSubmit}
          >
            Summarize
          </button>
          <button className="bg-orange-400 text-white px-8 py-2 rounded-md hover:bg-orange-500">
            Generate Quiz
          </button>
        </div>
        {message && <p className="text-red-500 mt-4">{message}</p>}
      </div>
      <div className='w-full'>


      {/* Display the summary box if summary is available */}
      {summary && (
        <main className="py-10">
          <div className="w-2/4 h-96 mx-auto bg-white shadow-lg rounded-lg p-12 flex flex-col justify-center items-center">
            <textarea
              className="w-full border border-gray-300 rounded-md p-4 w-full h-full text-lg resize-none text-black"
              value={translatedText || summary}
              readOnly
              placeholder="Summary will appear here..."
            />
            <div className="flex flex-col items-center gap-4 mt-4">
              <Translation 
                text={summary} 
                onTranslate={setTranslatedText} 
                onLanguageChange={setCurrentLanguage}
              />
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
                  onClick={() => setIsMuted(!isMuted)}
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
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
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
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
      </div>
    </div>
  );
};

export default UploadImage;
