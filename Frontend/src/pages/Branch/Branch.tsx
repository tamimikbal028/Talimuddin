import { Suspense, lazy } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import MyBranch from "../../components/Branch/MyBranch";
import Header from "../../components/Branch/BranchHeader";
import PageLoader from "../Fallbacks/PageLoader";

// Lazy load pages
const BranchDetails = lazy(() => import("./BranchDetails"));
const CreateBranchPage = lazy(() => import("./CreateBranchPage"));
const JoinBranchPage = lazy(() => import("./JoinBranchPage"));
const EditBranchPage = lazy(() => import("./EditBranchPage"));
const AllBranches = lazy(() => import("../../components/Branch/AllBranches"));

const BranchLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

const Branch = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* With Header */}
        <Route element={<BranchLayout />}>
          <Route index element={<MyBranch />} />
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
