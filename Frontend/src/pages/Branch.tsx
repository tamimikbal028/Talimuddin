import React, { Suspense, lazy } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Header from "../components/Branch/BranchHeader";
import Branches from "./Branch/Branches";
import PageLoader from "./Fallbacks/PageLoader";

// Lazy load pages
const BranchDetails = lazy(() => import("./Branch/BranchDetails"));
const CreateBranchPage = lazy(() => import("./Branch/CreateBranchPage"));
const JoinBranchPage = lazy(() => import("./Branch/JoinBranchPage"));
const EditBranchPage = lazy(() => import("./Branch/EditBranchPage"));
const AllBranches = lazy(() => import("./Branch/AllBranches"));

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
