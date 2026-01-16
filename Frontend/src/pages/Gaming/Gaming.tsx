import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import GamingHeader from "../../components/Gaming/shared/GamingHeader.tsx";
import Dashboard from "./Dashboard";
import Play from "./Play";
import Leaderboard from "./Leaderboard";
import Achievements from "./Achievements";
import Tournament from "./Tournament";
import MathCompetition from "./Play/MathCompetition.tsx";
import Sudoku from "./Play/Sudoku.tsx";
import AcademicArena from "./Play/AcademicArena.tsx";
import NotFound from "../Fallbacks/NotFound";

const Gaming: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToMenu = () => {
    navigate("/gaming/play");
  };

  return (
    <>
      <GamingHeader />
      <div>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="play" element={<Play />} />
          <Route
            path="play/math-competition"
            element={<MathCompetition onBackToMenu={handleBackToMenu} />}
          />
          <Route
            path="play/sudoku"
            element={<Sudoku onBackToMenu={handleBackToMenu} />}
          />
          <Route
            path="play/academic-arena"
            element={<AcademicArena onBackToMenu={handleBackToMenu} />}
          />
          <Route path="tournament" element={<Tournament />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="achievements" element={<Achievements />} />

          {/* Default route: show 404 not found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
};

export default Gaming;
