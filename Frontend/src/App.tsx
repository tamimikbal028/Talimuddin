import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Sidebar from "./layout/Sidebar";
import MainContent from "./layout/MainContent";
import { authHooks, AUTH_KEYS } from "./hooks/useAuth";

/**
 * ====================================
 * APP COMPONENT - Main Entry Point
 * ====================================
 *
 * PROPER AUTH FLOW (TanStack Query):
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
 * auth:logout Event:
 * Axios interceptor fires this when token expires.
 * We listen and clear the query cache to log the user out locally.
 */

const App = () => {
  const location = useLocation();
  const queryClient = useQueryClient();

  const { isCheckingAuth } = authHooks.useUser();

  // Global logout event listener
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

  if (isCheckingAuth) {
    return (
      <>
        <Toaster position="top-right" richColors closeButton />
        <div className="flex h-screen w-screen items-center justify-center text-5xl font-semibold text-gray-600">
          Checking Authentication...
        </div>
      </>
    );
  }

  if (isAuthPage) {
    return (
      <>
        <Toaster position="top-right" richColors closeButton />
        <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
          <MainContent isAuthPage={isAuthPage} />
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" richColors closeButton />

      <div className="grid h-screen grid-cols-[15rem_1fr_auto] overflow-hidden bg-gray-100">
        <div className="h-full overflow-y-auto bg-gray-50">
          <Sidebar />
        </div>

        <div className="h-full overflow-y-auto">
          <div className="mx-auto w-[750px]">
            <MainContent isAuthPage={isAuthPage} />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
