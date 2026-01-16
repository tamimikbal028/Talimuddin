import { useState } from "react";
import StudyArchiveHeader from "./CommunityStudyArchive/StudyArchiveHeader";
import ArchiveTabs from "./CommunityStudyArchive/ArchiveTabs";
import FolderSection from "./CommunityStudyArchive/FolderSection";

export default function CommunityStudyArchive() {
  // TODO: Replace with API data
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedTerm, setSelectedTerm] = useState("all");
  const [activeArchiveTab, setActiveArchiveTab] = useState<
    "official" | "seniors" | "classmates"
  >("official");
  const [searchQuery, setSearchQuery] = useState("");
  const levels = ["all", "1", "2", "3", "4"];
  const terms = ["all", "1", "2"];

  return (
    <div className="space-y-3">
      {/* Header Section */}
      <StudyArchiveHeader
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        selectedTerm={selectedTerm}
        setSelectedTerm={setSelectedTerm}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        levels={levels}
        terms={terms}
      />

      {/* Archive Tabs */}
      <ArchiveTabs
        activeArchiveTab={activeArchiveTab}
        setActiveArchiveTab={setActiveArchiveTab}
      />

      {/* Main Content - Folder Sections */}
      <FolderSection />
    </div>
  );
}
