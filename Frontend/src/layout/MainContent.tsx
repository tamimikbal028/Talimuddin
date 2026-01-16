import React from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "../routes/AppRoutes";
import Navbar from "./Navbar";

const MainContent: React.FC = () => {
  const location = useLocation();

  // 🔒 Auth pages এ Navbar দেখানোর দরকার নেই
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {/* Auth pages এ Navbar hide করো */}
      {!isAuthPage && <Navbar />}
      <div className={isAuthPage ? "" : "space-y-5 py-5"}>
        <AppRoutes />
      </div>
    </>
  );
};

export default MainContent;
