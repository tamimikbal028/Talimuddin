import React, { useState, useEffect } from "react";
import DailyXPClaim from "../../components/Gaming/Dashboard/DailyXPClaim";
import RegisterTournament from "../../components/Gaming/Dashboard/RegisterTournament";
import MatchmakingStatus from "../../components/Gaming/Tournament/MatchmakingStatus";
import PrizePool from "../../components/Gaming/Dashboard/PrizePool";
import TournamentSchedule from "../../components/Gaming/Dashboard/TournamentSchedule";
import TournamentRules from "../../components/Gaming/Dashboard/TournamentRules";
import { TOURNAMENT_CONSTANTS } from "../../components/Gaming/data/tournamentData";

const Dashboard: React.FC = () => {
  // TODO: Replace with API data
  const currentTournament = {
    id: "1",
    name: "Math Championship",
    status: "open",
    startDate: new Date().toISOString(),
    registeredPlayers: [] as { id: string; name: string }[],
    currentRound: "round-1",
  };
  const userXP = 0;
  const userRegistered = false;

  // Matchmaking state
  const [isSearching, setIsSearching] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const [opponent, setOpponent] = useState<{
    name: string;
    avatar: string;
    rating: number;
  } | null>(null);
  const [matchTime, setMatchTime] = useState<string | null>(null);

  // Generate random match time between 12 PM - 11:59 PM
  const generateMatchTime = () => {
    const hour = Math.floor(Math.random() * 12) + 12; // 12-23 (12 PM to 11 PM)
    const minute = Math.floor(Math.random() * 60);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };

  // Start matchmaking when user registers
  useEffect(() => {
    if (userRegistered && !matchFound && !isSearching) {
      // Start searching animation
      setIsSearching(true);

      // Simulate finding a match after 3-6 seconds
      const searchDuration = Math.floor(Math.random() * 3000) + 3000;
      const searchTimeout = setTimeout(() => {
        const mockOpponents = [
          {
            name: "Shakib Rahman",
            avatar: "https://i.pravatar.cc/150?img=12",
            rating: 1850,
          },
          {
            name: "Nusrat Jahan",
            avatar: "https://i.pravatar.cc/150?img=45",
            rating: 1920,
          },
          {
            name: "Rafiq Ahmed",
            avatar: "https://i.pravatar.cc/150?img=33",
            rating: 1780,
          },
          {
            name: "Mim Akter",
            avatar: "https://i.pravatar.cc/150?img=47",
            rating: 1890,
          },
          {
            name: "Kamal Hassan",
            avatar: "https://i.pravatar.cc/150?img=68",
            rating: 1800,
          },
          {
            name: "Rina Begum",
            avatar: "https://i.pravatar.cc/150?img=49",
            rating: 1940,
          },
        ];

        const randomOpponent =
          mockOpponents[Math.floor(Math.random() * mockOpponents.length)];
        setOpponent(randomOpponent);
        setMatchTime(generateMatchTime());
        setMatchFound(true);
        setIsSearching(false);
      }, searchDuration);

      return () => clearTimeout(searchTimeout);
    }
  }, [userRegistered, matchFound, isSearching]);

  return (
    <div className="space-y-5">
      {/* Registration - Only show when not registered */}
      {currentTournament.status === "registration" && !userRegistered && (
        <RegisterTournament
          entryFee={TOURNAMENT_CONSTANTS.ENTRY_FEE}
          userXP={userXP}
        />
      )}

      {/* Matchmaking Status - Show after registration */}
      {userRegistered && (
        <MatchmakingStatus
          isSearching={isSearching}
          matchFound={matchFound}
          opponent={opponent}
          matchTime={matchTime}
        />
      )}

      {/* Prize Pool Card - After Registration */}
      <PrizePool />

      {/* Tournament Schedule Card */}
      <TournamentSchedule />

      {/* Tournament Rules Card */}
      <TournamentRules />

      {/* Daily XP Claim - At Bottom */}
      <DailyXPClaim />
    </div>
  );
};

export default Dashboard;
