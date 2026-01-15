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
    meta: { description: "Your dashboard" },
  },
  {
    path: "/classroom/*",
    component: lazy(() => import("../pages/ClassRoom")),
    requireAuth: true,
    title: "ClassRoom",
    category: "education",
    meta: { description: "Branch rooms and classes" },
  },

  // Utility routes

  // Social features
  {
    path: "/notifications",
    component: lazy(() => import("../pages/Notifications")),
    requireAuth: true,
    title: "Notifications",
    category: "utility",
    meta: { description: "Your notifications" },
  },
  {
    path: "/saved",
    component: lazy(() => import("../pages/Saved")),
    requireAuth: true,
    title: "Saved",
    category: "utility",
    meta: { description: "Your saved posts and content" },
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
    path: "/settings",
    component: lazy(() => import("../pages/Settings")),
    requireAuth: true,
    title: "Settings",
    category: "utility",
    meta: { description: "Account and app settings" },
  },

  // Blood Donation route
  {
    path: "/blood-donation",
    component: lazy(() => import("../pages/BloodDonation")),
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
