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



// <div
//                     key={optionIndex}
//                     onChange={() => {
//                               handleAnswerChange(questionNumber, option);
//                               setSelected(optionIndex);
//                             }}
//                     className={`
//                       p-3 rounded-lg transition-all duration-200 ease-in-out cursor-pointer
//                       ${selected === optionIndex 
//                         ? 'bg-orange-500 text-white' 
//                         : 'bg-orange-100 text-gray-800 hover:bg-orange-200'}
//                     `}
//                     >
//                     <span className="mr-2">
//                       {selected === optionIndex ? '✓' : '○'}
//                     </span>
//                     {option}
//                   </div>
//                   ))}
//                 </div>



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
            <h3 className="text-2xl font-bold text-center text-white">You got {result.correct} out of {result.total} correct!</h3>
            {/* <p className="text-lg text-center mt-4 text-white">
              You got {result.correct} out of {result.total} correct!
            </p> */}
          </section>
        )}
      </section>
    </div>
  );
}

export default QuizPage;
