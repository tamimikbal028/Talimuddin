export interface Player {
  id: number;
  name: string;
  score: number;
  game: "math" | "sudoku" | "arena";
  level: number;
  winRate: number;
  achievements: number;
  lastActive: string;
  avatar: string;
}

export const leaderboardPlayers: Player[] = [
  {
    id: 1,
    name: "MathWizard",
    score: 2450,
    game: "math",
    level: 15,
    winRate: 92,
    achievements: 12,
    lastActive: "2 hours ago",
    avatar: "🧙‍♂️",
  },
  {
    id: 2,
    name: "SudokuMaster",
    score: 2380,
    game: "sudoku",
    level: 18,
    winRate: 88,
    achievements: 15,
    lastActive: "1 hour ago",
    avatar: "🏆",
  },
  {
    id: 3,
    name: "ArenaChamp",
    score: 2290,
    game: "arena",
    level: 12,
    winRate: 85,
    achievements: 9,
    lastActive: "3 hours ago",
    avatar: "⚡",
  },
  {
    id: 4,
    name: "QuickSolver",
    score: 2180,
    game: "math",
    level: 13,
    winRate: 89,
    achievements: 8,
    lastActive: "30 min ago",
    avatar: "🚀",
  },
  {
    id: 5,
    name: "PuzzleKing",
    score: 2050,
    game: "sudoku",
    level: 16,
    winRate: 91,
    achievements: 11,
    lastActive: "1 day ago",
    avatar: "👑",
  },
  {
    id: 6,
    name: "BrainStorm",
    score: 1980,
    game: "arena",
    level: 11,
    winRate: 83,
    achievements: 7,
    lastActive: "4 hours ago",
    avatar: "🧠",
  },
  {
    id: 7,
    name: "SpeedRunner",
    score: 1890,
    game: "math",
    level: 10,
    winRate: 87,
    achievements: 6,
    lastActive: "5 hours ago",
    avatar: "💨",
  },
  {
    id: 8,
    name: "LogicLord",
    score: 1820,
    game: "sudoku",
    level: 14,
    winRate: 94,
    achievements: 10,
    lastActive: "2 days ago",
    avatar: "🎯",
  },
];
