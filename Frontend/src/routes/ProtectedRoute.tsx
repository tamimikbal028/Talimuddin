import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authHooks } from "../hooks/useAuth";

/**
 * ====================================
 * PROTECTED ROUTE COMPONENT
 * ====================================
 *
 * Route protection এর জন্য এই component use হয়।
 *
 * Props:
 * - children: Protected content
 * - requireAuth: true (default) = Login লাগবে
 *               false = Login থাকলে redirect করো (login/register page এর জন্য)
 *
 * Usage:
 *
 * // Protected route - Login required
 * <Route path="/profile" element={
 *   <ProtectedRoute>
 *     <Profile />
 *   </ProtectedRoute>
 * } />
 *
 * // Public only route - Logged in user দেখতে পাবে না
 * <Route path="/login" element={
 *   <ProtectedRoute requireAuth={false}>
 *     <Login />
 *   </ProtectedRoute>
 * } />
 */

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth: boolean;
}

const ProtectedRoute = ({ children, requireAuth }: ProtectedRouteProps) => {
  const { isAuthenticated } = authHooks.useUser();
  const location = useLocation();

  // Auth required but not logged in → Login page এ পাঠাও
  // location.state এ current path save করো যাতে login এর পর ফেরত আসতে পারে
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Already logged in but trying to access login/register → Home এ পাঠাও
  // Logged in user এর login page দেখার দরকার নেই
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // All checks passed - Content দেখাও
  return <>{children}</>;
};

export default ProtectedRoute;
