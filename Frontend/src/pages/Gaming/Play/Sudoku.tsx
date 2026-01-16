import React, { useState } from "react";

interface SudokuProps {
  onBackToMenu: () => void;
}

type Difficulty = "easy" | "medium" | "hard";
type CellValue = number | null;
type SudokuBoard = CellValue[][];

const Sudoku: React.FC<SudokuProps> = ({ onBackToMenu }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [board, setBoard] = useState<SudokuBoard>([]);
  const [initialBoard, setInitialBoard] = useState<SudokuBoard>([]);
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  // Create initial Sudoku board (simplified for demo)
  const createBoard = (): { board: SudokuBoard; initial: SudokuBoard } => {
    // Create a 9x9 grid with some pre-filled numbers based on difficulty
    const newBoard: SudokuBoard = Array(9)
      .fill(null)
      .map(() => Array(9).fill(null));
    const initialBoard: SudokuBoard = Array(9)
      .fill(null)
      .map(() => Array(9).fill(null));

    // Sample easy puzzle
    const easyPuzzle = [
      [5, 3, null, null, 7, null, null, null, null],
      [6, null, null, 1, 9, 5, null, null, null],
      [null, 9, 8, null, null, null, null, 6, null],
      [8, null, null, null, 6, null, null, null, 3],
      [4, null, null, 8, null, 3, null, null, 1],
      [7, null, null, null, 2, null, null, null, 6],
      [null, 6, null, null, null, null, 2, 8, null],
      [null, null, null, 4, 1, 9, null, null, 5],
      [null, null, null, null, 8, null, null, 7, 9],
    ];

    // Copy puzzle to both boards
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        newBoard[i][j] = easyPuzzle[i][j];
        initialBoard[i][j] = easyPuzzle[i][j];
      }
    }

    return { board: newBoard, initial: initialBoard };
  };

  const startGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    const { board: newBoard, initial } = createBoard();
    setBoard(newBoard);
    setInitialBoard(initial);
    setGameStarted(true);
    setSelectedCell(null);
  };

  const handleCellClick = (row: number, col: number) => {
    if (initialBoard[row]?.[col] === null) {
      setSelectedCell({ row, col });
    }
  };

  const handleNumberInput = (number: number) => {
    if (
      selectedCell &&
      initialBoard[selectedCell.row]?.[selectedCell.col] === null
    ) {
      const newBoard = [...board];
      newBoard[selectedCell.row][selectedCell.col] = number;
      setBoard(newBoard);
    }
  };

  const handleErase = () => {
    if (
      selectedCell &&
      initialBoard[selectedCell.row]?.[selectedCell.col] === null
    ) {
      const newBoard = [...board];
      newBoard[selectedCell.row][selectedCell.col] = null;
      setBoard(newBoard);
    }
  };

  const checkPuzzle = () => {
    // Simple check - just alert for demo
    alert("Puzzle checking feature would validate the solution here!");
  };

  const resetBoard = () => {
    setBoard([...initialBoard]);
    setSelectedCell(null);
  };

  const isHighlighted = (row: number, col: number): boolean => {
    if (!selectedCell) return false;

    // Highlight row, column, and 3x3 box
    if (selectedCell.row === row || selectedCell.col === col) return true;

    const boxRow = Math.floor(selectedCell.row / 3) * 3;
    const boxCol = Math.floor(selectedCell.col / 3) * 3;
    const cellBoxRow = Math.floor(row / 3) * 3;
    const cellBoxCol = Math.floor(col / 3) * 3;

    return boxRow === cellBoxRow && boxCol === cellBoxCol;
  };

  if (!gameStarted) {
    return (
      <div className="p-8 min-h-[600px]">
        {/* Back Button - Top Left */}
        <button
          onClick={onBackToMenu}
          className="mb-6 rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
        >
          ← Back to Games
        </button>

        <div className="text-center flex items-center justify-center min-h-[500px]">
          <div>
            <h2 className="mb-8 text-3xl font-bold text-gray-900">
              Sudoku Solver
            </h2>

            <p className="mb-8 text-gray-600 max-w-md mx-auto">
              Choose your difficulty level and challenge your logical thinking
              with classic Sudoku puzzles.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => startGame("easy")}
                className="w-full max-w-xs rounded-lg bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600 transition-colors"
              >
                🟢 Easy
              </button>
              <button
                onClick={() => startGame("medium")}
                className="w-full max-w-xs rounded-lg bg-yellow-500 px-6 py-3 font-medium text-white hover:bg-yellow-600 transition-colors"
              >
                🟡 Medium
              </button>
              <button
                onClick={() => startGame("hard")}
                className="w-full max-w-xs rounded-lg bg-red-500 px-6 py-3 font-medium text-white hover:bg-red-600 transition-colors"
              >
                🔴 Hard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-[600px]">
      {/* Back Button - Top Left */}
      <button
        onClick={onBackToMenu}
        className="mb-6 rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
      >
        ← Back to Games
      </button>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Sudoku - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </h2>
          <p className="text-gray-600">
            Fill the grid so each row, column, and 3×3 box contains all digits
            1-9
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Sudoku Board */}
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="grid grid-cols-9 gap-1 w-fit mx-auto">
              {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={`
                      w-12 h-12 flex items-center justify-center text-lg font-medium border-2 transition-colors
                      ${
                        selectedCell?.row === rowIndex &&
                        selectedCell?.col === colIndex
                          ? "bg-blue-200 border-blue-500"
                          : isHighlighted(rowIndex, colIndex)
                            ? "bg-blue-50 border-blue-200"
                            : "bg-white border-gray-300"
                      }
                      ${
                        initialBoard[rowIndex][colIndex] !== null
                          ? "font-bold text-gray-900 cursor-default"
                          : "text-blue-600 hover:bg-gray-50 cursor-pointer"
                      }
                      ${(rowIndex + 1) % 3 === 0 && rowIndex !== 8 ? "border-b-4 border-b-gray-800" : ""}
                      ${(colIndex + 1) % 3 === 0 && colIndex !== 8 ? "border-r-4 border-r-gray-800" : ""}
                    `}
                  >
                    {cell || ""}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Controls
            </h3>

            {/* Number Buttons */}
            <div className="mb-6">
              <p className="mb-3 text-sm text-gray-600">Select a number:</p>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                  <button
                    key={number}
                    onClick={() => handleNumberInput(number)}
                    className="w-12 h-12 rounded-lg bg-blue-100 text-blue-800 font-medium hover:bg-blue-200 transition-colors"
                  >
                    {number}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleErase}
                className="w-full rounded-lg bg-red-100 text-red-800 px-4 py-2 font-medium hover:bg-red-200 transition-colors"
              >
                🗑️ Erase
              </button>
              <button
                onClick={checkPuzzle}
                className="w-full rounded-lg bg-green-100 text-green-800 px-4 py-2 font-medium hover:bg-green-200 transition-colors"
              >
                ✓ Check Puzzle
              </button>
              <button
                onClick={resetBoard}
                className="w-full rounded-lg bg-yellow-100 text-yellow-800 px-4 py-2 font-medium hover:bg-yellow-200 transition-colors"
              >
                ↻ Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sudoku;
