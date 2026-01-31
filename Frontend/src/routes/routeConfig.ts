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
    path: "/branch/*",
    component: lazy(() => import("../pages/Branch")),
    requireAuth: true,
    title: "ClassRoom",
    category: "education",
    meta: { description: "Attend and manage live online classes" },
  },

  {
    path: "/notifications",
    component: lazy(() => import("../pages/Notifications")),
    requireAuth: true,
    title: "Notifications",
    category: "social",
    meta: { description: "Your notifications and updates" },
  },

  // Profile routes
  {
    path: "/profile/:username",
    component: lazy(() => import("../pages/Profile/Profile")),
    requireAuth: true,
    title: "Profile",
    category: "profile",
    meta: { description: "View profile" },
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
    path: "/profile/:username/details",
    component: lazy(() => import("../pages/Profile/ProfileDetails")),
    requireAuth: true,
    title: "Profile Details",
    category: "profile",
    meta: { description: "View detailed profile information" },
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
