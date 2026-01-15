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
  requireAuth?: boolean;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  allowedRoles = [],
}) => {
  const { user, isAuthenticated, isCheckingAuth } = authHooks.useUser();
  const location = useLocation();

  // ⏳ Auth check চলছে - Loading দেখাও
  if (isCheckingAuth) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // 🔒 Auth required but not logged in → Login page এ পাঠাও
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🚫 Already logged in but trying to access login/register → appropriate Home এ পাঠাও
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 🛑 Role check - If role is not allowed, redirect to Home
  if (isAuthenticated && allowedRoles.length > 0 && user) {
    if (!allowedRoles.includes(user.userType)) {
      return <Navigate to="/" replace />;
    }
  }

  // ✅ All checks passed - Content দেখাও
  return <>{children}</>;
};

export default ProtectedRoute;
