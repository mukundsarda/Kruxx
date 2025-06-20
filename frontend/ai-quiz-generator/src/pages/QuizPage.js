import React, { useState, useEffect } from "react";

function QuizPage() {
  const [questions, setQuestions] = useState({});
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isQuizLoaded, setIsQuizLoaded] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch quiz questions from Flask backend
  useEffect(() => {
    fetch("http://127.0.0.1:5000/quiz", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch quiz data.");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setQuestions(data.questions);
          setTotalQuestions(Object.keys(data.questions).length);
          setIsQuizLoaded(true);
        } else {
          setErrorMessage(data.message || "No quiz available to display. Please generate one.");
        }
      })
      .catch((error) => {
        console.error("Error fetching quiz:", error);
        setErrorMessage("An error occurred while fetching the quiz.");
      });
  }, []);

  // Handle answer selection
  const handleAnswerChange = (questionNumber, selectedOption) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionNumber]: selectedOption,
    }));
  };

  // Submit answers and fetch results
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers), // Directly send the answers object
      });

      if (!response.ok) {
        throw new Error("Failed to submit quiz.");
      }

      const data = await response.json();

      if (data.success) {
        setResult({
          correct: data.correct,
          total: data.total,
        });
      } else {
        setErrorMessage(data.message || "An error occurred while submitting the quiz.");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setErrorMessage("An error occurred while submitting the quiz.");
    }
  };

  return (
    <div className="container bg-orange-400 m-5 rounded-xl p-12">
      <section className="top">
        <div className="container top">
          <h3 className="text-7xl font-bold text-white text-center">{result ? 'Quiz Result' : 'Quiz'}</h3>
        </div>
      </section>

      <section className="mid mt-8">
        {/* Display Error Message */}
        {errorMessage && (
          <div className="error-message text-red-500 text-center">
            {errorMessage}
          </div>
        )}

        {/* Display Quiz Form */}
        {isQuizLoaded && !result && (
          <form onSubmit={handleSubmit}>
            {Object.entries(questions).map(([questionNumber, questionData], index) => (
              <div key={questionNumber} className="mb-6 bg-white rounded-xl p-4">
                <h4 className="font-semibold">
                  {index + 1}. {questionData.question}
                </h4>
                <div className="options">
                  {questionData.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="option mt-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`question${questionNumber}`}
                          value={option}
                          onChange={() =>
                            handleAnswerChange(questionNumber, option)
                          }
                          className="cursor-pointer"
                        />
                        <span>{option}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-100 font-bold"
            >
              Submit Quiz
            </button>
          </div>
          </form>
        )}

        {/* Display Results */}
        {result && (
          <section className="result mt-8">
            <div className="bg-white p-6 rounded-xl mb-8 text-center">
              <h3 className="text-2xl font-bold text-orange-500 mb-4">Quiz Results</h3>
              <p className="text-xl font-bold">
                You got {result.correct} out of {result.total} correct!
              </p>
              <p className="text-lg mt-2">
                Percentage: {((result.correct / result.total) * 100).toFixed(1)}%
              </p>
            </div>

            {/* Display Questions with Correct Answers */}
            <div className="space-y-6">
              {Object.entries(questions).map(([questionNumber, questionData], index) => (
                <div key={questionNumber} className="bg-white rounded-xl p-6">
                  <h4 className="font-semibold mb-4">
                    {index + 1}. {questionData.question}
                  </h4>
                  <div className="space-y-2">
                    {questionData.options.map((option, optionIndex) => {
                      const isUserAnswer = answers[questionNumber] === option;
                      const isCorrectAnswer = questionData.answer === option;
                      
                      return (
                        <div
                          key={optionIndex}
                          className={`p-3 rounded-lg ${
                            isCorrectAnswer 
                              ? 'bg-green-200 border-2 border-green-500'
                              : isUserAnswer && !isCorrectAnswer
                              ? 'bg-red-200 border-2 border-red-500'
                              : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{option}</span>
                            {isCorrectAnswer && (
                              <span className="text-green-600 font-semibold">✓ Correct Answer</span>
                            )}
                            {isUserAnswer && !isCorrectAnswer && (
                              <span className="text-red-600 font-semibold">✗ Your Answer</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Back to Home Button */}
            <div className="flex justify-center mt-8">
              <a 
                href="/"
                className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-100 font-bold"
              >
                Back to Home
              </a>
            </div>
          </section>
        )}
      </section>
    </div>
  );
}

export default QuizPage;
