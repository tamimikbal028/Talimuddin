import { Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute";
import { routes, getRouteByPath } from "../routes/routeConfig";
import PageLoader from "../pages/Fallbacks/PageLoader";
import { prefetchOnIdle } from "../routes/prefetch";

const MainContent = () => {
  const location = useLocation();
  // Update document title based on current route
  useEffect(() => {
    const currentRoute = getRouteByPath(location.pathname);
    if (currentRoute?.title) {
      document.title = `${currentRoute.title} - SocialHub`;
    } else {
      document.title = "SocialHub";
    }
  }, [location.pathname]);

  // Idle prefetch a few high-traffic routes
  useEffect(() => {
    prefetchOnIdle(["/"]);
  }, []);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {routes.map((route, idx) => {
          const Component = route.component;

          return (
            <Route
              key={idx}
              path={route.path}
              element={
                <ProtectedRoute requireAuth={route.requireAuth}>
                  <Component />
                </ProtectedRoute>
              }
            />
          );
        })}
      </Routes>
    </Suspense>
  );
};

export default MainContent;
