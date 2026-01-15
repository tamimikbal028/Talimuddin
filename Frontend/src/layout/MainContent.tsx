import React from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "../routes/AppRoutes";
const MainContent: React.FC = () => {
  const location = useLocation();

  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      <div className={isAuthPage ? "" : "space-y-5 py-5"}>
        <AppRoutes />
      </div>
    </>
  );
};

export default MainContent;
