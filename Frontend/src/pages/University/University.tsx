import React from "react";
import { Routes, Route } from "react-router-dom";
import UniversityNavbar from "../../components/University/UniversityNavbar";
import UniversityHeader from "../../components/University/UniversityHeader";
import AcademicTimeline from "./AcademicTimeline";
import CRCorner from "./CRCorner";
import UniversityDashboard from "./Dashboard";
import UniversityEvents from "./Events";
import UniversityMore from "./More";
import UniversityNoticeBoard from "./NoticeBoard";
import TeachersCorner from "./TeachersCorner";
import NotFound from "../Fallbacks/NotFound";

// More pages imports
import CareerServices from "./More/CareerServices";
import Clubs from "./More/Clubs";
import CourseMaterials from "./More/CourseMaterials";
import ClassSchedule from "./More/ClassSchedule";
import Results from "./More/Results";
import Classmates from "./More/Classmates";
import LibraryPortal from "./More/LibraryPortal";
import StudentPortal from "./More/StudentPortal";
import FacultyDirectory from "./More/FacultyDirectory";
import ELearning from "./More/ELearning";
import UniversityNews from "./More/UniversityNews";
import FinancialAid from "./More/FinancialAid";
import AlumniNetwork from "./More/AlumniNetwork";
import CampusMap from "./More/CampusMap";
import SportsFacilities from "./More/SportsFacilities";
import HealthServices from "./More/HealthServices";
import BusSchedule from "./More/BusSchedule";
import ITSupport from "./More/ITSupport";

const University: React.FC = () => {
  return (
    <>
      <UniversityHeader />
      <UniversityNavbar />
      <div>
        <Routes>
          <Route index element={<UniversityDashboard />} />
          <Route path="noticeboard" element={<UniversityNoticeBoard />} />
          <Route path="academictimeline" element={<AcademicTimeline />} />
          <Route path="crcorner" element={<CRCorner />} />
          <Route path="events" element={<UniversityEvents />} />
          <Route path="teacherscorner" element={<TeachersCorner />} />
          <Route path="more" element={<UniversityMore />} />
          {/* More section routes */}
          <Route path="more/clubs" element={<Clubs />} />{" "}
          <Route path="more/career-services" element={<CareerServices />} />
          <Route path="more/course-materials" element={<CourseMaterials />} />
          <Route path="more/class-schedule" element={<ClassSchedule />} />
          <Route path="more/results" element={<Results />} />
          <Route path="more/classmates" element={<Classmates />} />
          <Route path="more/library-portal" element={<LibraryPortal />} />
          <Route path="more/student-portal" element={<StudentPortal />} />
          <Route path="more/faculty-directory" element={<FacultyDirectory />} />
          <Route path="more/e-learning" element={<ELearning />} />
          <Route path="more/university-news" element={<UniversityNews />} />
          <Route path="more/financial-aid" element={<FinancialAid />} />
          <Route path="more/alumni-network" element={<AlumniNetwork />} />
          <Route path="more/campus-map" element={<CampusMap />} />
          <Route path="more/sports-facilities" element={<SportsFacilities />} />
          <Route path="more/health-services" element={<HealthServices />} />
          <Route path="more/bus-schedule" element={<BusSchedule />} />
          <Route path="more/it-support" element={<ITSupport />} />
          {/* Default route: show 404 not found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
};

export default University;
