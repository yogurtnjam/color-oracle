import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, Trophy, Zap, Home, Star, Target } from 'lucide-react';

const PerformanceTest = ({ userId, coneTestResults, savePerformanceTest }) => {
  const navigate = useNavigate();
  const [gameMode, setGameMode] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [currentColors, setCurrentColors] = useState([]);
  const [targetColor, setTargetColor] = useState('');
  const [matchingColors, setMatchingColors] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  const generateColors = useCallback((count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      colors.push(`rgb(${r}, ${g}, ${b})`);
    }
    return colors;
  }, []);

  const generateSimilarColor = (baseColor) => {
    const rgb = baseColor.match(/\d+/g).map(Number);
    const variation = 30;
    return `rgb(${
      Math.max(0, Math.min(255, rgb[0] + (Math.random() * variation * 2 - variation)))
    }, ${
      Math.max(0, Math.min(255, rgb[1] + (Math.random() * variation * 2 - variation)))
    }, ${
      Math.max(0, Math.min(255, rgb[2] + (Math.random() * variation * 2 - variation)))
    })`;
  };

  const startColorMatchGame = () => {
    const colors = generateColors(6);
    setCurrentColors(colors);
    setTargetColor(colors[Math.floor(Math.random() * colors.length)]);
  };

  const startPatternRecognitionGame = () => {
    const baseColors = generateColors(2);
    const colors = [];
    for (let i = 0; i < 9; i++) {
      colors.push(i % 2 === 0 ? baseColors[0] : baseColors[1]);
    }
    // Shuffle
    colors.sort(() => Math.random() - 0.5);
    setCurrentColors(colors);
    setMatchingColors([baseColors[0]]);
    setSelectedColors([]);
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [gameStarted, timeLeft]);

  useEffect(() => {
    if (gameStarted && gameMode === 'color-match') {
      startColorMatchGame();
    } else if (gameStarted && gameMode === 'pattern') {
      startPatternRecognitionGame();
    }
  }, [gameStarted, currentRound, gameMode]);

  const handleColorMatch = (color) => {
    if (color === targetColor) {
      setScore(score + 10);
      if (currentRound < totalRounds) {
        setCurrentRound(currentRound + 1);
      } else {
        endGame();
      }
    } else {
      setScore(Math.max(0, score - 2));
    }
  };

  const handlePatternClick = (color, index) => {
    if (selectedColors.includes(index)) {
      setSelectedColors(selectedColors.filter(i => i !== index));
    } else {
      const newSelected = [...selectedColors, index];
      setSelectedColors(newSelected);
      
      if (color === matchingColors[0]) {
        setScore(score + 5);
      }
    }
  };

  const submitPattern = () => {
    const correctCount = selectedColors.filter(i => 
      currentColors[i] === matchingColors[0]
    ).length;
    const totalMatching = currentColors.filter(c => c === matchingColors[0]).length;
    
    if (correctCount === totalMatching && selectedColors.length === totalMatching) {
      setScore(score + 20);
    }
    
    if (currentRound < totalRounds) {
      setCurrentRound(currentRound + 1);
    } else {
      endGame();
    }
  };

  const endGame = async () => {
    setGameOver(true);
    setGameStarted(false);
    
    if (userId && savePerformanceTest) {
      await savePerformanceTest({
        testType: gameMode,
        score: score,
        time: 30 - timeLeft,
        difficulty: 'normal'
      });
    }
  };

  const resetGame = () => {
    setGameMode(null);
    setGameStarted(false);
    setScore(0);
    setTimeLeft(30);
    setCurrentRound(1);
    setGameOver(false);
    setCurrentColors([]);
    setTargetColor('');
    setSelectedColors([]);
  };

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

  // Game selection screen
  if (!gameMode) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-nature-forest hover:text-nature-moss mb-6 transition-colors"
          >
            <Home size={20} />
            <span>Back to Dashboard</span>
          </button>

          <div className="text-center mb-12 animate-fadeIn">
            <Trophy size={64} className="text-nature-sunrise mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-nature-forest mb-4">
              Performance Test
            </h1>
            <p className="text-xl text-gray-600">
              Choose a game to test your color perception!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => {
                setGameMode('color-match');
                setGameStarted(true);
              }}
              className="glass-card rounded-3xl p-8 text-left card-hover group"
              data-testid="color-match-game-btn"
            >
              <div className="bg-gradient-to-br from-nature-sunrise to-nature-sunset w-16 h-16 rounded-2xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-nature-forest mb-3">
                Color Match
              </h3>
              <p className="text-gray-600 mb-4">
                Find the matching color as quickly as possible!
              </p>
              <div className="flex items-center gap-2 text-sm text-nature-moss">
                <Timer size={16} />
                <span>30 seconds • 10 rounds</span>
              </div>
            </button>

            <button
              onClick={() => {
                setGameMode('pattern');
                setGameStarted(true);
              }}
              className="glass-card rounded-3xl p-8 text-left card-hover group"
            >
              <div className="bg-gradient-to-br from-nature-leaf to-nature-moss w-16 h-16 rounded-2xl mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-nature-forest mb-3">
                Pattern Recognition
              </h3>
              <p className="text-gray-600 mb-4">
                Identify all tiles with the matching color pattern!
              </p>
              <div className="flex items-center gap-2 text-sm text-nature-moss">
                <Timer size={16} />
                <span>30 seconds • 10 rounds</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game over screen
  if (gameOver) {
    const percentage = (score / (totalRounds * (gameMode === 'color-match' ? 10 : 20))) * 100;
    let rating = '⭐';
    if (percentage >= 90) rating = '⭐⭐⭐⭐⭐';
    else if (percentage >= 75) rating = '⭐⭐⭐⭐';
    else if (percentage >= 60) rating = '⭐⭐⭐';
    else if (percentage >= 40) rating = '⭐⭐';

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card rounded-3xl p-8 md:p-12 max-w-2xl w-full text-center animate-fadeIn">
          <Trophy size={80} className="text-nature-sunrise mx-auto mb-6 animate-float" />
          <h2 className="text-4xl font-bold text-nature-forest mb-4">
            Game Complete!
          </h2>
          
          <div className="bg-gradient-to-br from-nature-leaf/20 to-nature-moss/20 rounded-2xl p-8 mb-6">
            <div className="text-6xl font-bold text-nature-forest mb-2">
              {score}
            </div>
            <div className="text-xl text-gray-600 mb-4">
              Final Score
            </div>
            <div className="text-4xl mb-4">
              {rating}
            </div>
            <div className="text-sm text-gray-600">
              Completed in {30 - timeLeft} seconds
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={resetGame}
              className="w-full btn-nature text-white font-bold py-4 rounded-full"
            >
              Play Again
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full btn-sky text-white font-bold py-4 rounded-full"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active game screen
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Game header */}
        <div className="glass-card rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-nature-forest">
              Score: {score}
            </div>
            <div className="text-gray-600">
              Round {currentRound}/{totalRounds}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xl font-bold text-nature-forest">
            <Timer size={24} className="text-nature-sunrise" />
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* Game content */}
        <div className="glass-card rounded-3xl p-8 md:p-12">
          {gameMode === 'color-match' && (
            <div>
              <h3 className="text-2xl font-bold text-nature-forest text-center mb-8">
                Find this color:
              </h3>
              <div 
                className="w-32 h-32 rounded-2xl mx-auto mb-12 shadow-2xl border-4 border-white"
                style={{ backgroundColor: targetColor }}
              ></div>
              
              <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
                {currentColors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorMatch(color)}
                    className="aspect-square rounded-2xl shadow-lg hover:scale-105 transition-transform border-4 border-white hover:border-nature-leaf"
                    style={{ backgroundColor: color }}
                    data-testid={`color-option-${index}`}
                  />
                ))}
              </div>
            </div>
          )}

          {gameMode === 'pattern' && (
            <div>
              <h3 className="text-2xl font-bold text-nature-forest text-center mb-4">
                Select all tiles matching this color:
              </h3>
              <div 
                className="w-24 h-24 rounded-xl mx-auto mb-8 shadow-xl border-4 border-white"
                style={{ backgroundColor: matchingColors[0] }}
              ></div>
              
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-6">
                {currentColors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handlePatternClick(color, index)}
                    className={`aspect-square rounded-xl shadow-lg transition-all ${
                      selectedColors.includes(index)
                        ? 'border-4 border-nature-leaf scale-95'
                        : 'border-4 border-white hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <button
                onClick={submitPattern}
                className="w-full btn-nature text-white font-bold py-4 rounded-full"
                data-testid="submit-pattern-btn"
              >
                Submit Answer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceTest;
