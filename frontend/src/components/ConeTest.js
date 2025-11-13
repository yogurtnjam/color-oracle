import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ArrowRight, CheckCircle, Circle } from 'lucide-react';

const ConeTest = ({ userId, saveConeTest }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState(null);

  // Test questions for each cone type
  const testQuestions = [
    // L-cone (Red) tests
    {
      id: 'l1',
      type: 'L',
      question: 'Which square appears more vibrant?',
      options: [
        { color: '#FF0000', label: 'A' },
        { color: '#CC0000', label: 'B' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l2',
      type: 'L',
      question: 'Can you see the number in this pattern?',
      options: [
        { color: '#FF6B6B', pattern: true, number: '5', label: 'Yes' },
        { color: '#CCCCCC', pattern: false, label: 'No' }
      ],
      correctAnswer: 0
    },
    {
      id: 'l3',
      type: 'L',
      question: 'Which red shade is darker?',
      options: [
        { color: '#8B0000', label: 'A' },
        { color: '#DC143C', label: 'B' }
      ],
      correctAnswer: 0
    },
    // M-cone (Green) tests
    {
      id: 'm1',
      type: 'M',
      question: 'Which green appears brighter?',
      options: [
        { color: '#00FF00', label: 'A' },
        { color: '#00CC00', label: 'B' }
      ],
      correctAnswer: 0
    },
    {
      id: 'm2',
      type: 'M',
      question: 'Can you distinguish these two greens?',
      options: [
        { color: '#228B22', label: 'A' },
        { color: '#2E8B57', label: 'B' }
      ],
      correctAnswer: 0
    },
    {
      id: 'm3',
      type: 'M',
      question: 'Which shade is more olive-like?',
      options: [
        { color: '#556B2F', label: 'A' },
        { color: '#6B8E23', label: 'B' }
      ],
      correctAnswer: 0
    },
    // S-cone (Blue) tests
    {
      id: 's1',
      type: 'S',
      question: 'Which blue is more intense?',
      options: [
        { color: '#0000FF', label: 'A' },
        { color: '#0000CC', label: 'B' }
      ],
      correctAnswer: 0
    },
    {
      id: 's2',
      type: 'S',
      question: 'Can you see the difference in these blues?',
      options: [
        { color: '#4169E1', label: 'A' },
        { color: '#1E90FF', label: 'B' }
      ],
      correctAnswer: 0
    },
    {
      id: 's3',
      type: 'S',
      question: 'Which appears more purple?',
      options: [
        { color: '#6A5ACD', label: 'A' },
        { color: '#4682B4', label: 'B' }
      ],
      correctAnswer: 1
    }
  ];

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers({
      ...answers,
      [questionId]: answerIndex
    });
  };

  const handleNext = () => {
    if (currentStep < testQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    const lQuestions = testQuestions.filter(q => q.type === 'L');
    const mQuestions = testQuestions.filter(q => q.type === 'M');
    const sQuestions = testQuestions.filter(q => q.type === 'S');

    const lCorrect = lQuestions.filter(q => answers[q.id] === q.correctAnswer).length;
    const mCorrect = mQuestions.filter(q => answers[q.id] === q.correctAnswer).length;
    const sCorrect = sQuestions.filter(q => answers[q.id] === q.correctAnswer).length;

    const lCone = (lCorrect / lQuestions.length) * 100;
    const mCone = (mCorrect / mQuestions.length) * 100;
    const sCone = (sCorrect / sQuestions.length) * 100;

    const calculatedResults = {
      lCone: Math.round(lCone),
      mCone: Math.round(mCone),
      sCone: Math.round(sCone)
    };

    setResults(calculatedResults);
    setIsComplete(true);
    
    if (userId && saveConeTest) {
      saveConeTest(calculatedResults);
    }
  };

  const currentQuestion = testQuestions[currentStep];
  const progress = ((currentStep + 1) / testQuestions.length) * 100;

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card rounded-3xl p-8 max-w-md text-center">
          <p className="text-xl text-gray-700 mb-4">Please create an account first</p>
          <button
            onClick={() => navigate('/')}
            className="btn-nature text-white font-bold px-8 py-3 rounded-full"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (isComplete && results) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card rounded-3xl p-8 md:p-12 max-w-2xl w-full animate-fadeIn">
          <div className="text-center mb-8">
            <CheckCircle size={64} className="text-nature-leaf mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-nature-forest mb-4">
              Test Complete!
            </h2>
            <p className="text-gray-700 text-lg">
              Here are your cone sensitivity results:
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {/* L-Cone Result */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-nature-forest">L-Cone (Red) Sensitivity</span>
                <span className="font-bold text-red-600">{results.lCone}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill bg-red-500" 
                  style={{ width: `${results.lCone}%` }}
                ></div>
              </div>
            </div>

            {/* M-Cone Result */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-nature-forest">M-Cone (Green) Sensitivity</span>
                <span className="font-bold text-green-600">{results.mCone}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill bg-green-500" 
                  style={{ width: `${results.mCone}%` }}
                ></div>
              </div>
            </div>

            {/* S-Cone Result */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-nature-forest">S-Cone (Blue) Sensitivity</span>
                <span className="font-bold text-blue-600">{results.sCone}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill bg-blue-500" 
                  style={{ width: `${results.sCone}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-nature-leaf/10 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-nature-forest mb-2">What does this mean?</h3>
            <p className="text-gray-700 text-sm">
              Your results show how well you perceive different color wavelengths. 
              We'll use this data to customize your color experience and provide 
              personalized recommendations.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 btn-nature text-white font-bold py-4 rounded-full"
              data-testid="view-dashboard-btn"
            >
              View Dashboard
            </button>
            <button
              onClick={() => navigate('/simulator')}
              className="flex-1 btn-sky text-white font-bold py-4 rounded-full"
            >
              Try Simulator
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card rounded-3xl p-8 md:p-12 max-w-3xl w-full animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-8">
          <Eye size={48} className="text-nature-forest mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-nature-forest mb-2">
            Cone Contrast Test
          </h2>
          <p className="text-gray-600">
            Question {currentStep + 1} of {testQuestions.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar mb-8">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-nature-forest text-center mb-8">
            {currentQuestion.question}
          </h3>

          {/* Options */}
          <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(currentQuestion.id, index)}
                className={`p-8 rounded-2xl border-4 transition-all duration-300 ${
                  answers[currentQuestion.id] === index
                    ? 'border-nature-leaf shadow-lg scale-105'
                    : 'border-gray-200 hover:border-nature-moss'
                }`}
                data-testid={`option-${index}`}
              >
                <div
                  className="w-full h-32 rounded-xl mb-4 shadow-inner"
                  style={{ backgroundColor: option.color }}
                ></div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-nature-forest">
                    {option.label}
                  </span>
                  {answers[currentQuestion.id] === index && (
                    <CheckCircle className="text-nature-leaf mx-auto mt-2" size={24} />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-6 py-3 rounded-full border-2 border-nature-moss text-nature-moss font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-nature-moss hover:text-white transition-colors"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={answers[currentQuestion.id] === undefined}
            className="btn-nature text-white font-bold px-8 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            data-testid="next-btn"
          >
            {currentStep === testQuestions.length - 1 ? 'Finish' : 'Next'}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConeTest;
