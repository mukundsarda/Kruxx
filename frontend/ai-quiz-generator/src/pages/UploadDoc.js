import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function UploadDoc() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedOption2, setSelectedOption2] = useState("abstractive");
  const [selectedOption3, setSelectedOption3] = useState("short");
  const [message, setMessage] = useState('');
  const [summary, setSummary] = useState(''); // State to store summary text
  const [quizMessage, setQuizMessage] = useState('');
  const [quizGenerated, setQuizGenerated] = useState(false);
  const navigate = useNavigate();

  const handleDocUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setSelectedDoc(file.name);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setMessage('Please upload a document.');
      return;
    }

    const formData = new FormData();
    formData.append('doc', selectedFile);
    formData.append('summaryType', selectedOption2);
    formData.append('summaryLength', selectedOption3);

    try {
      const response = await fetch('http://127.0.0.1:5000/upload-doc', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setSummary(data.summary);
        setMessage(data.message);
      } else {
        setMessage(data.message || 'An error occurred while uploading the document.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
      console.error('Error:', error);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!selectedFile) {
      setQuizMessage('Please upload a document to generate a quiz.');
      return;
    }

    const formData = new FormData();
    formData.append('doc', selectedFile);

    try {
      const response = await fetch('http://127.0.0.1:5000/quiz-doc', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setQuizMessage(data.message);
        setQuizGenerated(true);
        navigate("/quiz"); // Redirects to the /quiz route
      } else {
        setQuizMessage(data.message || 'Failed to generate the quiz.');
      }
    } catch (error) {
      setQuizMessage('An error occurred while generating the quiz.');
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div className="relative bg-orange-400 flex flex-col justify-center items-center text-white text-center pt-24 pb-56 m-5 rounded-xl">
        <div className="w-[60%] flex flex-col justify-center items-center space-y-6">
          <h2 className="text-2xl font-bold">Upload a Document</h2>
          {selectedDoc && (
            <p className="mt-4 bg-white text-blue-400 p-2 rounded shadow">
              {selectedDoc}
            </p>
          )}
          <label
            htmlFor="docInput"
            className="cursor-pointer bg-white text-orange-400 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Choose Document
          </label>
          <input
            id="docInput"
            type="file"
            accept=".doc,.docx"
            className="hidden"
            onChange={handleDocUpload}
          />
        </div>

        <div className="w-[60%] flex justify-center items-start space-y-6 text-white">
          <div className="w-full flex flex-col items-center justify-start py-6">
            <div>
              <p className="text-lg font-semibold">Choose Summary Type:</p>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="summaryType"
                  value="abstractive"
                  checked={selectedOption2 === "abstractive"}
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
                  checked={selectedOption2 === "extractive"}
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
                  checked={selectedOption3 === "short"}
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
                  checked={selectedOption3 === "medium"}
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
                  checked={selectedOption3 === "long"}
                  onChange={(e) => setSelectedOption3(e.target.value)}
                  className="cursor-pointer"
                />
                <span>Long</span>
              </label>
            </div>
          </div>
        </div>

        <div
          className={`${
            summary ? "" : "absolute bottom-20"
          } w-1/3 mt-16 bg-white shadow-lg rounded-xl p-6 flex flex-col justify-center items-center`}
        >
          <div className="flex flex-row justify-around flex-wrap gap-8">
            <button
              className="bg-orange-400 text-white px-6 py-2 rounded-md hover:bg-orange-500"
              onClick={handleSubmit}
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
          {message && <p className="text-red-500 mt-4">{message}</p>}
          {quizMessage && (
            <p className={`mt-4 ${quizGenerated ? "text-green-500" : "text-red-500"}`}>
              {quizMessage}
            </p>
          )}
        </div>
        <div className="w-full">
          {summary && (
            <main className="py-10">
              <div className="w-2/4 h-96 mx-auto bg-white shadow-lg rounded-lg p-12 flex flex-col justify-center items-center">
                <textarea
                  className="w-full border border-gray-300 rounded-md p-4 w-full h-full text-lg resize-none text-black"
                  value={summary}
                  readOnly
                  placeholder="Summary will appear here..."
                ></textarea>
              </div>
            </main>
          )}
        </div>
      </div>
    </>
  );
}

export default UploadDoc;
