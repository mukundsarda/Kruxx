import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Quiz = () => {
  const [questions, setQuestions] = useState({});
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const showAnswers = location.state?.showAnswers;
  const fromGenerator = location.state?.fromGenerator;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/quiz', {
          method: 'GET'
        });
        const data = await response.json();
        if (data.success) {
          setQuestions(data.questions);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerSelect = (questionNumber, optionNumber) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionNumber]: optionNumber
    }));
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const totalQuestions = Object.keys(questions).length;
    const answeredQuestions = Object.keys(userAnswers).length;
    
    if (answeredQuestions < totalQuestions) {
      alert(`Please answer all questions. ${answeredQuestions} out of ${totalQuestions} answered.`);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userAnswers)
      });

      const data = await response.json();
      if (data.success) {
        setScore({
          correct: data.correct,
          total: data.total
        });
        setSubmitted(true);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

  const findCorrectAnswer = (question) => {
    for (const [optionNum, optionText] of Object.entries(question.options)) {
      if (optionText === question.answer) {
        return parseInt(optionNum);
      }
    }
    return null;
  };

  const getAnswerStyle = (questionNum, optionNum) => {
    if (!submitted) return '';

    const correctAnswer = findCorrectAnswer(questions[questionNum]);
    const userAnswer = userAnswers[questionNum];

    if (correctAnswer === optionNum) {
      return 'bg-green-200';
    } else if (userAnswer === optionNum && userAnswer !== correctAnswer) {
      return 'bg-red-200';
    }
    return '';
  };

  if (showResults) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">Quiz Results</h1>
        <div className="bg-orange-100 p-6 rounded-lg mb-8 text-center">
          <p className="text-2xl font-bold mb-2">Your Score: {score.correct} out of {score.total}</p>
          <p className="text-lg">Percentage: {((score.correct / score.total) * 100).toFixed(1)}%</p>
        </div>

        <div className="space-y-6">
          {Object.entries(questions).map(([questionNum, questionData]) => {
            const userAnswer = userAnswers[questionNum];
            const correctAnswer = findCorrectAnswer(questionData);
            const isCorrect = userAnswer === correctAnswer;

            return (
              <div key={questionNum} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-2 mb-4">
                  <span className="font-bold">{questionNum}.</span>
                  <div className="flex-1">
                    <p className="font-semibold mb-2">{questionData.question}</p>
                    <div className="space-y-2">
                      {Object.entries(questionData.options).map(([optionNum, optionText]) => (
                        <div
                          key={optionNum}
                          className={`p-3 rounded-md border ${
                            parseInt(optionNum) === correctAnswer
                              ? 'bg-green-200 border-green-500'
                              : parseInt(optionNum) === userAnswer && userAnswer !== correctAnswer
                              ? 'bg-red-200 border-red-500'
                              : 'border-gray-200'
                          }`}
                        >
                          {optionText}
                          {parseInt(optionNum) === correctAnswer && (
                            <span className="ml-2 text-green-600 font-semibold">(Correct Answer)</span>
                          )}
                          {parseInt(optionNum) === userAnswer && userAnswer !== correctAnswer && (
                            <span className="ml-2 text-red-600 font-semibold">(Your Answer)</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="ml-4">
                    {isCorrect ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-red-600">✗</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-8 gap-4">
          <button
            onClick={() => navigate('/')}
            className="bg-orange-400 text-white px-8 py-3 rounded-md hover:bg-orange-500 transition-colors"
          >
            Back to Home
          </button>
          <button
            onClick={() => setShowResults(false)}
            className="bg-gray-500 text-white px-8 py-3 rounded-md hover:bg-gray-600 transition-colors"
          >
            Review Questions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Quiz</h1>
      
      {Object.entries(questions).map(([questionNum, questionData]) => (
        <div key={questionNum} className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <p className="text-lg font-semibold mb-4">{questionNum}. {questionData.question}</p>
          
          <div className="space-y-2">
            {Object.entries(questionData.options).map(([optionNum, optionText]) => (
              <div 
                key={optionNum} 
                className={`p-3 rounded-md cursor-pointer border ${
                  userAnswers[questionNum] === parseInt(optionNum) ? 'border-orange-500' : 'border-gray-200'
                } hover:bg-orange-50 transition-colors`}
                onClick={() => !submitted && handleAnswerSelect(questionNum, parseInt(optionNum))}
              >
                {optionText}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          className="bg-orange-400 text-white px-8 py-3 rounded-md hover:bg-orange-500 transition-colors"
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
};

export default Quiz; 