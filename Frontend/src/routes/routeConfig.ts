import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import Home from "../pages/Home";

// Enhanced Route configuration - Industry standard approach
interface RouteConfig {
  path: string;
  component: LazyExoticComponent<ComponentType> | ComponentType;
  requireAuth: boolean;
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
    component: lazy(() => import("../pages/Branch/Branch")),
    requireAuth: true,
    title: "Branch",
    category: "education",
    meta: { description: "Attend and manage live online classes" },
  },
  {
    path: "/saved",
    component: lazy(() => import("../pages/Saved")),
    requireAuth: true,
    title: "Saved",
    category: "social",
    meta: { description: "Your saved posts and content" },
  },

  // Profile routes
  {
    path: "/profile/edit",
    component: lazy(() => import("../pages/Profile/ProfileEdit")),
    requireAuth: true,
    title: "Edit Profile",
    category: "profile",
    meta: { description: "Edit your profile information" },
  },
  {
    path: "/profile/:username",
    component: lazy(() => import("../pages/Profile/Profile")),
    requireAuth: true,
    title: "Profile",
    category: "profile",
    meta: { description: "View profile" },
  },
  {
    path: "/potrika",
    component: lazy(() => import("../pages/Potrika/Potrikas")),
    requireAuth: true,
    title: "Potrika",
    category: "main",
    meta: { description: "View Potrika publications" },
  },
  {
    path: "/potrika/:potrikaId",
    component: lazy(() => import("../pages/Potrika/PotrikaDetail")),
    requireAuth: true,
    title: "Potrika Details",
    category: "main",
    meta: { description: "View Potrika publications and posts" },
  },
  {
    path: "/settings",
    component: lazy(() => import("../pages/Settings")),
    requireAuth: true,
    title: "Settings",
    category: "utility",
    meta: { description: "Account and app settings" },
  },

  // Blood Donation
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
