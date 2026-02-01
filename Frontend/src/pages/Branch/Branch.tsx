import React, { Suspense, lazy } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Branches from "./Branches";
import Header from "../../components/Branch/BranchHeader";
import PageLoader from "../Fallbacks/PageLoader";

// Lazy load pages
const BranchDetails = lazy(() => import("./BranchDetails"));  
const CreateBranchPage = lazy(() => import("./CreateBranchPage"));
const JoinBranchPage = lazy(() => import("./JoinBranchPage"));
const EditBranchPage = lazy(() => import("./EditBranchPage"));
const AllBranches = lazy(() => import("./AllBranches"));

const BranchLayout: React.FC = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

const Branch: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* With Header */}
        <Route element={<BranchLayout />}>
          <Route index element={<Branches />} />
          <Route path="all" element={<AllBranches />} />
        </Route>

        {/* Standalone Routes (No Header) */}
        <Route path="createbranch" element={<CreateBranchPage />} />
        <Route path="joinbranch" element={<JoinBranchPage />} />
        <Route path="branches/:branchId/edit" element={<EditBranchPage />} />
        <Route path="branches/:branchId/*" element={<BranchDetails />} />
      </Routes>
    </Suspense>
  );
};

export default Branch;
