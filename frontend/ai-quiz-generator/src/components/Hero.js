import React, { useState } from "react";
import { FaYoutube, FaLink } from "react-icons/fa"; // Icons for YouTube and Hyperlink
import { Link } from "react-router-dom";

const Hero = () => {
  const [mode, setMode] = useState("youtube"); // State for toggle button
  const [inputValue, setInputValue] = useState("");
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [summarizationType, setSummarizationType] = useState("abstractive");
  const [summaryLength, setSummaryLength] = useState("short"); // Default to short
  const [summaryResult, setSummaryResult] = useState(""); // To store the generated summary

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
    // Check whether the input is a YouTube URL or a website link
    const isYoutube = mode === "youtube";

    try {
      const endpoint = isYoutube ? "/video-upload" : "/link-upload"; // Choose route based on input type
      const response = await fetch(endpoint, {
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
      if (response.ok) {
        setSummaryResult(data.summary); // Display the result in the bottom box
      } else {
        alert(data.message || "Error generating summary");
      }
    } catch (error) {
      alert("Please make sure you've selected the correct link type.");
    }

    // Close the modal after summarization
    setShowModal(false);
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
          <Link to="/uploadPPT">
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
          <div className="mt-8 p-4 border rounded-lg shadow-md bg-white text-black max-w-2xl mx-auto">
            <h3 className="font-semibold text-xl mb-4">Generated Summary:</h3>
            <p>{summaryResult}</p>
          </div>
        )}
      </div>
    </header>
  );
};

export default Hero;
