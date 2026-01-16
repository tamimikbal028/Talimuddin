import React, { Suspense, lazy } from "react";
import { Routes, Route, NavLink, Navigate, Outlet } from "react-router-dom";
import GroupsHeader from "../../components/Groups/utils/GroupsHeader.tsx";
import MyGroups from "../../components/Groups/group-tabs/MyGroups.tsx";
import SuggestedGroups from "../../components/Groups/group-tabs/SuggestedGroups.tsx";
import CareerGroups from "../../components/Groups/group-tabs/CareerGroups.tsx";
import UniversityGroups from "../../components/Groups/group-tabs/UniversityGroups.tsx";
import SentGroupRequests from "../../components/Groups/group-tabs/SentGroupRequests.tsx";
import InvitedGroup from "../../components/Groups/group-tabs/InvitedGroup.tsx";
import PageLoader from "./../Fallbacks/PageLoader";

// Lazy load detail and create pages to avoid circular deps or large bundles
const GroupDetail = lazy(() => import("./../Group/GroupDetail.tsx"));
const CreateGroupPage = lazy(() => import("./CreateGroupPage.tsx"));

const GroupsLayout: React.FC = () => {
  const tabs = [
    { path: "/groups/my", label: "My Groups" },
    { path: "/groups/university", label: "University" },
    { path: "/groups/career", label: "Career & Job" },
    { path: "/groups/suggested", label: "Suggested" },
    { path: "/groups/requests", label: "Sent Requests" },
    { path: "/groups/invited", label: "Invited" },
  ];

  return (
    <>
      <GroupsHeader />
      <div className="flex justify-between border-b border-gray-200 px-3">
        {tabs.map((t) => (
          <NavLink
            key={t.path}
            to={t.path}
            replace
            className={({ isActive }) =>
              `py-1 font-medium transition-colors ${
                isActive
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </div>
      <Outlet />
    </>
  );
};

const Groups: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<GroupsLayout />}>
          <Route path="/" element={<Navigate to="my" replace />} />
          <Route path="my" element={<MyGroups />} />
          <Route path="university" element={<UniversityGroups />} />
          <Route path="career" element={<CareerGroups />} />
          <Route path="suggested" element={<SuggestedGroups />} />
          <Route path="requests" element={<SentGroupRequests />} />
          <Route path="invited" element={<InvitedGroup />} />
        </Route>

        {/* Standalone Routes (No Header/Tabs) */}
        <Route path="creategroup" element={<CreateGroupPage />} />
        <Route path=":slug/*" element={<GroupDetail />} />
      </Routes>
    </Suspense>
  );
};

export default Groups;
