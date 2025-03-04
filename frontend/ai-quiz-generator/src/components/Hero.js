import React, { useState, useEffect } from "react";
import { FaYoutube, FaLink, FaPlay, FaPause, FaStop, FaVolumeUp, FaVolumeMute } from "react-icons/fa"; // Icons for YouTube and Hyperlink
import { Link } from "react-router-dom";
import TextToSpeech from './TextToSpeech';
import Translation from './Translation';

const Hero = () => {
  const [mode, setMode] = useState("youtube"); // State for toggle button
  const [inputValue, setInputValue] = useState("");
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [summarizationType, setSummarizationType] = useState("abstractive");
  const [summaryLength, setSummaryLength] = useState("short"); // Default to short
  const [summaryResult, setSummaryResult] = useState(""); // To store the generated summary
  const [isPlaying, setIsPlaying] = useState(false);
  const [speech, setSpeech] = useState(null);
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Initialize speech synthesis
  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance();
    setSpeech(u);

    return () => {
      synth.cancel();
    };
  }, []);

  // Update utterance text when summary changes
  useEffect(() => {
    if (speech && summaryResult) {
      speech.text = summaryResult;
    }
  }, [summaryResult, speech]);

  // Toggle between YouTube and Website modes
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "youtube" ? "website" : "youtube"));
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSummarizeClick = () => {
    setShowModal(true); // Show the modal when "Summarize" button is clicked
  };

  const handleModalClose = () => {
    setShowModal(false); // Close the modal
  };

  const handleSummarize = async () => {
    // Validate input URL
    if (!inputValue) {
      alert("Please enter a URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(inputValue);
    } catch (e) {
      alert("Please enter a valid URL");
      return;
    }

    // Check whether the input is a YouTube URL or a website link
    const isYoutube = mode === "youtube" && 
      (inputValue.includes("youtube.com") || inputValue.includes("youtu.be"));
    
    const isWebsite = mode === "website" && 
      !inputValue.includes("youtube.com") && !inputValue.includes("youtu.be");

    if ((mode === "youtube" && !isYoutube) || (mode === "website" && !isWebsite)) {
      alert(`Please enter a valid ${mode === "youtube" ? "YouTube" : "website"} URL`);
      return;
    }

    try {
      const endpoint = isYoutube ? "/video-upload" : "/link-upload";
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          link: inputValue,
          summary_type: summarizationType,
          summary_length: summaryLength,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSummaryResult(data.summary);
      } else {
        alert(data.message || "Error generating summary");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing your request. Please try again.");
    }

    // Close the modal after summarization attempt
    setShowModal(false);
  };

  const handleSpeak = () => {
    const synth = window.speechSynthesis;
    const textToSpeak = translatedText || summaryResult;

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
    <header className="bg-orange-400 flex justify-center items-center text-white text-center pt-24 pb-56 m-5 rounded-xl">
      <div className="w-[60%] flex flex-col justify-center items-center space-y-6">
        <h1 className="text-7xl font-bold">Kruxx</h1>

        <p className="text-xl mt-12 pt-6 pb-12 w-2/3 text-center font-bold">
          How would you like to summarize?
        </p>

        <div className="flex space-x-6 mt-6">
          <Link to="/uploadImage">
            <button className="bg-white text-black font-bold py-6 px-10 rounded-xl shadow-md hover:bg-gray-200 text-lg">
              Upload Image
            </button>
          </Link>
          <Link to="/uploadPdf">
            <button className="bg-white text-black font-bold py-6 px-10 rounded-xl shadow-md hover:bg-gray-200 text-lg">
              Upload PDF
            </button>
          </Link>
          <Link to="/uploadPpt">
            <button className="bg-white text-black font-bold py-6 px-10 rounded-xl shadow-md hover:bg-gray-200 text-lg">
              Upload PPT
            </button>
          </Link>
          <Link to="/uploadDoc">
            <button className="bg-white text-black font-bold py-6 px-10 rounded-xl shadow-md hover:bg-gray-200 text-lg">
              Upload DOC
            </button>
          </Link>
        </div>

        <div className="flex justify-center items-center gap-6 w-2/3 pt-6">
          <div className="relative flex items-center w-full">
            <button
              onClick={toggleMode}
              className="bg-white text-black p-4 rounded-l-full shadow-md flex items-center justify-center hover:bg-gray-200 transition duration-300"
            >
              {mode === "youtube" ? (
                <FaYoutube className="text-red-600 text-2xl" />
              ) : (
                <FaLink className="text-blue-600 text-2xl" />
              )}
            </button>
            <input
              type="text"
              placeholder={
                mode === "youtube" ? "Enter YouTube link..." : "Enter website link..."
              }
              value={inputValue}
              onChange={handleInputChange}
              className="flex-1 py-4 px-6 rounded-r-full text-black shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          {inputValue && (
            <div className="flex justify-center">
              <button
                onClick={handleSummarizeClick}
                className="bg-black p-4 w-full max-w-md py-2 text-lg font-semibold rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
                size="lg"
              >
                Summarize
              </button>
            </div>
          )}
        </div>

        {/* Modal for Summarization Options */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white text-black p-8 rounded-xl w-[80%] max-w-lg">
              <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Summarization Options</h2>
              <div className="flex justify-evenly">
                {/* Summarization Type */}
                <div className="mb-4">
                  <p className="font-semibold">Summary Type:</p>
                  <div className="flex flex-col items-start pt-2">
                    <label>
                      <input
                        type="radio"
                        value="abstractive"
                        checked={summarizationType === "abstractive"}
                        onChange={(e) => setSummarizationType(e.target.value)}
                      />
                      Abstractive
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="extractive"
                        checked={summarizationType === "extractive"}
                        onChange={(e) => setSummarizationType(e.target.value)}
                      />
                      Extractive
                    </label>
                  </div>
                </div>

                {/* Summary Length */}
                <div className="mb-6">
                  <p className="font-semibold">Summary Length:</p>
                  <div className="flex flex-col items-start pt-2">
                    <label>
                      <input
                        type="radio"
                        value="short"
                        checked={summaryLength === "short"}
                        onChange={(e) => setSummaryLength(e.target.value)}
                      />
                      Short
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="medium"
                        checked={summaryLength === "medium"}
                        onChange={(e) => setSummaryLength(e.target.value)}
                      />
                      Medium
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="long"
                        checked={summaryLength === "long"}
                        onChange={(e) => setSummaryLength(e.target.value)}
                      />
                      Long
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 w-full pt-2">
                {/* Close Button */}
                <div className="flex-1 justify-center">
                  <button
                    onClick={handleModalClose}
                    className="text-gray-500 hover:text-gray-700 font-bold border rounded-full w-full shadow-md max-w-sm p-4"
                  >
                    Close
                  </button>
                </div>

                <div className="flex-1 justify-center">
                  <button
                    onClick={handleSummarize}
                    className="bg-orange-400 opacity-90 hover:opacity-100 text-white p-4 rounded-full w-full max-w-sm"
                  >
                    Summarize
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Display the generated summary here */}
        {summaryResult && (
          <main className="py-10 w-full">
            <div className="w-2/4 h-96 mx-auto bg-white shadow-lg rounded-lg p-12 flex flex-col justify-center items-center">
              <textarea
                className="w-full border border-gray-300 rounded-md p-4 w-full h-full text-lg resize-none text-black"
                value={translatedText || summaryResult}
                readOnly
                placeholder="Summary will appear here..."
              />
              <div className="flex flex-col items-center gap-4 mt-4">
                <Translation 
                  text={summaryResult}
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
    </header>
  );
};

export default Hero;
