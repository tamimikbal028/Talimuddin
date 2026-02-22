import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Sidebar from "./layout/Sidebar";
import MainContent from "./layout/MainContent";
import { authHooks, AUTH_KEYS } from "./hooks/useAuth";

const App = () => {
  const queryClient = useQueryClient();

  const { isCheckingAuth, isAuthenticated } = authHooks.useUser();

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

  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-right" richColors closeButton />
        <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
          <MainContent />
        </div>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" richColors closeButton />

      <div className="grid h-screen grid-cols-[15rem_1fr] overflow-hidden bg-gray-100">
        <div className="h-full overflow-y-auto border-r border-gray-200 bg-gray-50">
          <Sidebar />
        </div>

        <div className="h-full overflow-y-auto scroll-smooth">
          <div className="mx-auto w-[750px] space-y-5 py-3">
            <MainContent />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
