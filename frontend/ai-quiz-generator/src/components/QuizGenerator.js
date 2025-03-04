import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaPause, FaStop, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import Translation from './Translation';

const QuizGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [summarizationType, setSummarizationType] = useState("abstractive");
  const [summaryLength, setSummaryLength] = useState("short"); // Default to short
  const [summaryResult, setSummaryResult] = useState(""); // To display the summary
  const [translatedText, setTranslatedText] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const navigate = useNavigate();

  // Add text-to-speech states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speech, setSpeech] = useState(null);
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Initialize speech synthesis
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Update utterance text when summary changes
  useEffect(() => {
    if (speech && summaryResult) {
      speech.text = summaryResult;
    }
  }, [summaryResult, speech]);

  const handleSummarizeClick = () => {
    setShowModal(true); // Show the modal when "Summarize" button is clicked
  };

  const handleModalClose = () => {
    setShowModal(false); // Close the modal
  };

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      alert("Please enter some text before summarizing.");
      return;
    }

    const file = new Blob([inputText], { type: "text/plain" });
    const formData = new FormData();
    formData.append("text_file", file, "text_input.txt");
    formData.append("summary_type", summarizationType);
    formData.append("summary_length", summaryLength);

    try {
      const response = await fetch("http://127.0.0.1:5000/txt-summarize", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setSummaryResult(data.summary); // Display the summary in the text box
      } else {
        alert(data.message || "Failed to generate summary.");
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      alert("An error occurred while generating the summary. Please try again.");
    }

    setShowModal(false); // Close the modal after summarization
  };

  const handleGenerateQuiz = async () => {
    if (!inputText.trim()) {
      alert("Please enter some text before generating the quiz.");
      return;
    }

    const file = new Blob([inputText], { type: "text/plain" });
    const formData = new FormData();
    formData.append("quiz", file, "quiz.txt");

    try {
      const response = await fetch("http://127.0.0.1:5000/quizup", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Pass the quiz state through navigation
        navigate("/quiz", { 
          state: { 
            showAnswers: true,
            fromGenerator: true
          } 
        });
      } else {
        alert(data.message || "Failed to generate quiz.");
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      alert("An error occurred while generating the quiz. Please try again.");
    }
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

  return (
    <main className="py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 flex flex-col justify-center items-center -mt-44">
        <textarea
          className="w-full border border-gray-300 rounded-md p-4 text-lg resize-none h-32"
          placeholder="Paste or type your text here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        ></textarea>
        <div className="flex justify-around mt-6 flex-wrap gap-4 w-1/2">
          <button
            className="bg-orange-400 text-white px-6 py-2 rounded-md hover:bg-orange-500"
            onClick={handleSummarizeClick}
          >
            Summarize
          </button>
          <button
            className="bg-orange-400 text-white px-8 py-2 rounded-md hover:bg-orange-500"
            onClick={handleGenerateQuiz}
          >
            Generate Quiz
          </button>
        </div>
      </div>

      {/* Modal for Summarization Options */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white text-black p-8 rounded-xl w-[80%] max-w-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Choose Your Summarization Options
            </h2>
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

              {/* Summarize Button */}
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
    </main>
  );
};

export default QuizGenerator;
