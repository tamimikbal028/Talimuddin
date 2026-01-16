import React, { useState, useEffect, useMemo, useCallback } from "react";

interface MathCompetitionProps {
  onBackToMenu: () => void;
}

type GameScreen = "menu" | "finding" | "playing" | "finished";
type GameType = "classic" | "time_attack";
type Difficulty = "easy" | "hard";

interface Question {
  question: string;
  options: string[];
  correct: number;
}

const MathCompetition: React.FC<MathCompetitionProps> = ({ onBackToMenu }) => {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>("menu");
  const [gameType, setGameType] = useState<GameType>("classic");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameResult, setGameResult] = useState<"win" | "lose" | "draw" | null>(
    null
  );

  // Sample questions with useMemo
  const questions = useMemo<Question[]>(
    () => [
      {
        question: "What is 15 + 27?",
        options: ["42", "41", "43", "40"],
        correct: 0,
      },
      {
        question: "What is 8 × 9?",
        options: ["71", "72", "73", "74"],
        correct: 1,
      },
      {
        question: "What is 144 ÷ 12?",
        options: ["11", "12", "13", "14"],
        correct: 1,
      },
      {
        question: "What is 25²?",
        options: ["625", "525", "725", "425"],
        correct: 0,
      },
      {
        question: "What is √81?",
        options: ["8", "9", "10", "7"],
        correct: 1,
      },
    ],
    []
  );

  const endGame = useCallback(() => {
    if (playerScore > opponentScore) {
      setGameResult("win");
    } else if (playerScore < opponentScore) {
      setGameResult("lose");
    } else {
      setGameResult("draw");
    }
    setCurrentScreen("finished");
  }, [playerScore, opponentScore]);

  // Timer effect for gameplay
  useEffect(() => {
    if (currentScreen === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (currentScreen === "playing" && timeLeft === 0) {
      // Time's up, end game
      endGame();
    }
  }, [currentScreen, timeLeft, endGame]);

  // Simulate finding match
  useEffect(() => {
    if (currentScreen === "finding") {
      const timer = setTimeout(() => {
        setCurrentScreen("playing");
        setCurrentQuestion(questions[0]);
        setTimeLeft(gameType === "time_attack" ? 30 : 60);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen, gameType, questions]);

  const startGame = () => {
    setCurrentScreen("finding");
    setPlayerScore(0);
    setOpponentScore(0);
    setQuestionIndex(0);
  };

  const handleAnswer = (selectedOption: number) => {
    if (!currentQuestion) return;

    const isCorrect = selectedOption === currentQuestion.correct;
    if (isCorrect) {
      setPlayerScore((prev) => prev + 1);
    }

    // Simulate opponent answer (random)
    if (Math.random() > 0.3) {
      setOpponentScore((prev) => prev + 1);
    }

    // Next question or end game
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      setCurrentQuestion(questions[questionIndex + 1]);
      setTimeLeft(gameType === "time_attack" ? 30 : 60);
    } else {
      endGame();
    }
  };

  const resetGame = () => {
    setCurrentScreen("menu");
    setPlayerScore(0);
    setOpponentScore(0);
    setQuestionIndex(0);
    setGameResult(null);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "menu":
        return (
          <div className="p-8">
            {/* Back Button - Top Left */}
            <button
              onClick={onBackToMenu}
              className="mb-6 rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
            >
              ← Back to Games
            </button>

            <div className="text-center">
              <h2 className="mb-6 text-3xl font-bold text-gray-900">
                Math Competition
              </h2>

              {/* Game Type Selection */}
              <div className="mb-6">
                <h3 className="mb-4 text-lg font-medium text-gray-700">
                  Choose Game Type
                </h3>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setGameType("classic")}
                    className={`rounded-lg px-6 py-3 font-medium transition-colors ${
                      gameType === "classic"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Classic Race
                  </button>
                  <button
                    onClick={() => setGameType("time_attack")}
                    className={`rounded-lg px-6 py-3 font-medium transition-colors ${
                      gameType === "time_attack"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Time Attack
                  </button>
                </div>
              </div>

              {/* Difficulty Selection */}
              <div className="mb-8">
                <h3 className="mb-4 text-lg font-medium text-gray-700">
                  Choose Difficulty
                </h3>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setDifficulty("easy")}
                    className={`rounded-lg px-6 py-3 font-medium transition-colors ${
                      difficulty === "easy"
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Easy
                  </button>
                  <button
                    onClick={() => setDifficulty("hard")}
                    className={`rounded-lg px-6 py-3 font-medium transition-colors ${
                      difficulty === "hard"
                        ? "bg-red-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Hard
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={startGame}
                  className="w-full max-w-md rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                >
                  🎯 Find Random Opponent
                </button>
                <button
                  onClick={startGame}
                  className="w-full max-w-md rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700"
                >
                  👥 Challenge a Friend
                </button>
              </div>
            </div>
          </div>
        );

      case "finding":
        return (
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
            </div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Finding Match...
            </h2>
            <p className="text-gray-600">
              Searching for an opponent with similar skill level...
            </p>
          </div>
        );

      case "playing":
        return (
          <div className="p-8">
            {/* Score Display */}
            <div className="mb-6 flex items-center justify-between">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {playerScore}
                </div>
                <div className="text-sm text-gray-600">You</div>
              </div>

              {/* Progress Bar */}
              <div className="mx-8 flex-1">
                <div className="mb-2 flex justify-between text-sm text-gray-600">
                  <span>
                    Question {questionIndex + 1}/{questions.length}
                  </span>
                  <span>Time: {timeLeft}s</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-600 transition-all duration-1000"
                    style={{
                      width: `${(timeLeft / (gameType === "time_attack" ? 30 : 60)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {opponentScore}
                </div>
                <div className="text-sm text-gray-600">Opponent</div>
              </div>
            </div>

            {/* Question */}
            {currentQuestion && (
              <div className="text-center">
                <h3 className="mb-8 text-2xl font-bold text-gray-900">
                  {currentQuestion.question}
                </h3>

                {/* Answer Options */}
                <div className="mx-auto grid max-w-2xl grid-cols-2 gap-4">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className="rounded-lg border-2 border-gray-200 bg-white p-4 text-lg font-medium transition-colors hover:border-blue-500 hover:bg-blue-50"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "finished":
        return (
          <div className="p-8">
            {/* Back Button - Top Left */}
            <button
              onClick={onBackToMenu}
              className="mb-6 rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
            >
              ← Back to Games
            </button>

            <div className="text-center">
              <div className="mb-6">
                <div className="mb-4 text-6xl">
                  {gameResult === "win"
                    ? "🏆"
                    : gameResult === "lose"
                      ? "😔"
                      : "🤝"}
                </div>
                <h2
                  className={`mb-2 text-3xl font-bold ${
                    gameResult === "win"
                      ? "text-green-600"
                      : gameResult === "lose"
                        ? "text-red-600"
                        : "text-yellow-600"
                  }`}
                >
                  {gameResult === "win"
                    ? "You Win!"
                    : gameResult === "lose"
                      ? "You Lose!"
                      : "It's a Draw!"}
                </h2>
                <p className="text-gray-600">
                  Final Score: You {playerScore} - {opponentScore} Opponent
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={resetGame}
                  className="w-full max-w-md rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                >
                  🔄 Play Again
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="min-h-[600px]">{renderScreen()}</div>;
};

export default MathCompetition;
