import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import Home from "../pages/Home";

// Enhanced Route configuration - Industry standard approach
interface RouteConfig {
  path: string;
  component: LazyExoticComponent<ComponentType> | ComponentType;
  requireAuth?: boolean;
  title?: string;
  preload?: boolean;
  category?: string;
  meta?: {
    description?: string;
    keywords?: string[];
    ogTitle?: string;
  };
}

export const routes: RouteConfig[] = [
  // Public routes
  {
    path: "/login",
    component: lazy(() => import("../pages/Auth/Login")),
    requireAuth: false,
    title: "Login",
    category: "auth",
    meta: {
      description: "Login to your account",
      keywords: ["login", "signin"],
    },
  },
  {
    path: "/register",
    component: lazy(() => import("../pages/Auth/Register")),
    requireAuth: false,
    title: "Register",
    category: "auth",
    meta: {
      description: "Create a new account",
      keywords: ["register", "signup"],
    },
  },

  // Core app routes
  {
    path: "/",
    component: Home, // Eager loaded for instant navigation
    requireAuth: true,
    title: "Home",
    preload: true,
    category: "main",
    meta: { description: "Your social hub dashboard" },
  },
  {
    path: "/gaming/*",
    component: lazy(() => import("../pages/Gaming/Gaming")),
    requireAuth: true,
    title: "Gaming",
    category: "entertainment",
    meta: { description: "Gaming hub and competitions" },
  },
  {
    path: "/cr-corner",
    component: lazy(() => import("../pages/CRCorner")),
    requireAuth: true,
    title: "CR Corner",
    category: "education",
    meta: {
      description: "Class announcements, polls, and updates from your CR",
    },
  },
  {
    path: "/teachers-corner",
    component: lazy(() => import("../pages/TeachersCorner")),
    requireAuth: true,
    title: "Teachers' Corner",
    category: "education",
    meta: {
      description: "Resources, schedules, and tools for faculty members",
    },
  },
  {
    path: "/university",
    component: lazy(() => import("../pages/University/University")),
    requireAuth: true,
    title: "University",
    category: "education",
    meta: { description: "University resources and academics" },
  },
  // Catch-all for university subpages
  {
    path: "/university/*",
    component: lazy(() => import("../pages/University/University")),
    requireAuth: true,
    title: "University",
    category: "education",
    meta: { description: "University resources and academics (nested)" },
  },
  {
    path: "/classroom/*",
    component: lazy(() => import("../pages/ClassRoom")),
    requireAuth: true,
    title: "ClassRoom",
    category: "education",
    meta: { description: "Attend and manage live online classes" },
  },
  {
    path: "/institutions",
    component: lazy(() => import("../pages/Institution/InstitutionLanding")),
    requireAuth: true,
    title: "Join Institution",
    category: "education",
    meta: { description: "Find and join your institution" },
  },
  {
    path: "/institutions/:instId/*",
    component: lazy(() => import("../pages/Institution/InstitutionDetail")),
    requireAuth: true,
    title: "Institution",
    category: "education",
    meta: { description: "Official institution page and departments" },
  },
  {
    path: "/institutions/:instId/edit",
    component: lazy(() => import("../pages/Institution/EditInstitutionPage")),
    requireAuth: true,
    title: "Edit Institution",
    category: "education",
    meta: { description: "Manage institution settings and information" },
  },
  {
    path: "/departments",
    component: lazy(() => import("../pages/Department/DepartmentLanding")),
    requireAuth: true,
    title: "Join Department",
    category: "education",
    meta: { description: "Find and join your department" },
  },
  {
    path: "/departments/:deptId/*",
    component: lazy(() => import("../pages/Department/DepartmentDetail")),
    requireAuth: true,
    title: "Department",
    category: "education",
    meta: { description: "Official department page and updates" },
  },
  {
    path: "/departments/:deptId/edit",
    component: lazy(() => import("../pages/Department/EditDepartmentPage")),
    requireAuth: true,
    title: "Edit Department",
    category: "education",
    meta: { description: "Manage department settings and information" },
  },

  // Utility routes
  {
    path: "/search",
    component: lazy(() => import("../pages/Search")),
    requireAuth: true,
    title: "Search",
    category: "utility",
    meta: { description: "Search across the platform" },
  },
  {
    path: "/files",
    component: lazy(() => import("../pages/FilesAndArchive")),
    requireAuth: true,
    title: "Files & Archive",
    category: "education",
    meta: {
      description: "Manage personal files and explore community study archive",
    },
  },
  {
    path: "/store",
    component: lazy(() => import("../pages/StudentStore")),
    requireAuth: true,
    title: "Store",
    category: "shopping",
    meta: { description: "Student marketplace and store" },
  },
  {
    path: "/tuition",
    component: lazy(() => import("../pages/Tuition")),
    requireAuth: true,
    title: "Tuition",
    category: "education",
    meta: { description: "Find tutors and tuition services" },
  },

  // Social features
  {
    path: "/groups/*",
    component: lazy(() => import("../pages/Group/Groups")),
    requireAuth: true,
    title: "Groups",
    category: "social",
    meta: { description: "Join and manage groups" },
  },
  {
    path: "/groups/:slug/edit",
    component: lazy(() => import("../pages/Group/EditGroupPage")),
    requireAuth: true,
    title: "Manage Group",
    category: "social",
    meta: { description: "Edit group information and settings" },
  },
  {
    path: "/notifications",
    component: lazy(() => import("../pages/Notifications")),
    requireAuth: true,
    title: "Notifications",
    category: "social",
    meta: { description: "Your notifications and updates" },
  },
  {
    path: "/messages",
    component: lazy(() => import("../pages/Messages")),
    requireAuth: true,
    title: "Messages",
    category: "social",
    meta: { description: "Chat and messaging" },
  },
  {
    path: "/study-helper",
    component: lazy(() => import("../pages/StudyHelperAI")),
    requireAuth: true,
    title: "Study Helper AI",
    category: "education",
    meta: { description: "AI-powered study assistant" },
  },
  {
    path: "/open-study",
    component: lazy(() => import("../pages/OpenStudy")),
    requireAuth: true,
    title: "Open Study",
    category: "education",
    meta: { description: "Open discussions and chat rooms" },
  },
  {
    path: "/career-hub",
    component: lazy(() => import("../pages/CareerHub")),
    requireAuth: true,
    title: "Career Hub",
    category: "career",
    meta: { description: "Find jobs and internship opportunities" },
  },
  {
    path: "/saved",
    component: lazy(() => import("../pages/Saved")),
    requireAuth: true,
    title: "Saved",
    category: "utility",
    meta: { description: "Your saved posts and content" },
  },
  {
    path: "/friends/*",
    component: lazy(() => import("../pages/Friends")),
    requireAuth: true,
    title: "Friends",
    category: "social",
    meta: { description: "Manage your friends and connections" },
  },
  {
    path: "/videos",
    component: lazy(() => import("../pages/Videos")),
    requireAuth: true,
    title: "Videos",
    category: "entertainment",
    meta: { description: "Watch and share videos" },
  },

  // Profile routes
  {
    path: "/profile",
    component: lazy(() => import("../pages/Profile/Profile")),
    requireAuth: true,
    title: "Profile",
    category: "profile",
    meta: { description: "Your profile page" },
  },
  {
    path: "/profile/:username",
    component: lazy(() => import("../pages/Profile/Profile")),
    requireAuth: true,
    title: "User Profile",
    category: "profile",
    meta: { description: "View user profile" },
  },
  {
    path: "/profile/edit",
    component: lazy(() => import("../pages/Profile/ProfileEdit")),
    requireAuth: true,
    title: "Edit Profile",
    category: "profile",
    meta: { description: "Edit your profile information" },
  },
  {
    path: "/profile/saved",
    component: lazy(() => import("../pages/Saved")),
    requireAuth: true,
    title: "Saved Items",
    category: "profile",
    meta: { description: "View your saved items" },
  },
  {
    path: "/profile/details",
    component: lazy(() => import("../pages/Profile/ProfileDetails")),
    requireAuth: true,
    title: "Profile Details",
    category: "profile",
    meta: { description: "View detailed profile information" },
  },
  {
    path: "/profile/:username/details",
    component: lazy(() => import("../pages/Profile/ProfileDetails")),
    requireAuth: true,
    title: "User Profile Details",
    category: "profile",
    meta: { description: "View user's detailed profile information" },
  },
  {
    path: "/settings",
    component: lazy(() => import("../pages/Settings")),
    requireAuth: true,
    title: "Settings",
    category: "utility",
    meta: { description: "Account and app settings" },
  },

  // More section routes
  {
    path: "/more",
    component: lazy(() => import("../pages/MainMore")),
    requireAuth: true,
    title: "More",
    category: "utility",
    meta: { description: "Additional features and services" },
  },
  {
    path: "/more/blood-donation",
    component: lazy(() => import("../pages/MainMore/BloodDonation")),
    requireAuth: true,
    title: "Blood Donation",
    category: "utility",
    meta: { description: "Find blood donors and save lives" },
  },

  // 404 route
  {
    path: "*",
    component: lazy(() => import("../pages/Fallbacks/NotFound")),
    requireAuth: false,
    title: "Page Not Found",
    category: "error",
    meta: { description: "The page you're looking for doesn't exist" },
  },
];

export const getRouteByPath = (path: string) =>
  routes.find((route) => route.path === path);
