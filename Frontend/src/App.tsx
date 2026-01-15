import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Sidebar from "./layout/Sidebar";
import SidebarRight from "./layout/SidebarRight";
import MainContent from "./layout/MainContent";
import { authHooks, AUTH_KEYS } from "./hooks/useAuth";

/**
 * ====================================
 * APP COMPONENT - Main Entry Point
 * ====================================
 *
 * ✅ PROPER AUTH FLOW (TanStack Query):
 *
 * 1. App Load (App.tsx mount):
 *    → authHooks.useUser() call
 *    → isCheckingAuth = true (isLoading)
 *    → Loading spinner show
 *
 * 2. Auth Check (Background):
 *    → GET /users/current-user API call
 *    → Cookie sent automatically
 *
 * 3. Auth Check Success:
 *    → User data cached in TanStack Query
 *    → isAuthenticated = true
 *    → isCheckingAuth = false
 *    → UI render
 *
 * 4. Auth Check Failed:
 *    → 401/403 error
 *    → User data = null
 *    → isAuthenticated = false
 *    → ProtectedRoute redirects to /login
 *
 * ⚠️ auth:logout Event:
 * Axios interceptor fires this when token expires.
 * We listen and clear the query cache to log the user out locally.
 */

const App: React.FC = () => {
  const location = useLocation();
  const queryClient = useQueryClient();

  // Auth state from TanStack Query
  // ⚠️ CRITICAL: This call triggers the initial auth check
  const { isAuthenticated, isCheckingAuth } = authHooks.useUser();

  // 🔔 Global logout event listener
  // Axios interceptor fires this when all tokens expire
  useEffect(() => {
    const handleLogout = () => {
      console.log("Global logout event received");
      // Clear user data in cache
      queryClient.setQueryData(AUTH_KEYS.currentUser, null);
    };

    window.addEventListener("auth:logout", handleLogout);
    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, [queryClient]);

  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  const isMessagesPage = location.pathname === "/messages";
  const isStudyHelperPage = location.pathname === "/study-helper";

  // ⏳ Auth check running - Show Loading
  if (isCheckingAuth) {
    return (
      <>
        <Toaster position="top-right" richColors closeButton />
        <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  // For non-authenticated users or auth pages, don't show right sidebar
  const showRightSidebar = isAuthenticated || !isAuthPage;

  if (isAuthPage) {
    return (
      <>
        <Toaster position="top-right" richColors closeButton />
        <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
          <MainContent />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Toast Notifications */}
      <Toaster position="top-right" richColors closeButton />

      <div className="grid h-screen grid-cols-[15rem_1fr_auto] overflow-hidden">
        {/* Left Sidebar - Navigation */}
        <div className="h-full overflow-y-auto bg-gray-50">
          <Sidebar />
        </div>

        {/* Main Content - Middle Column */}
        <div className="h-full overflow-y-auto">
          <div
            className={
              isMessagesPage || isStudyHelperPage ? "mx-5" : "mx-auto w-[750px]"
            }
          >
            <MainContent />
          </div>
        </div>

        {/* Right Sidebar - Trending/Quick Links */}
        {showRightSidebar && (
          <div className="h-full w-75 overflow-y-auto border-l border-gray-500 bg-white">
            <SidebarRight />
          </div>
        )}
      </div>
    </>
  );
};

export default App;
