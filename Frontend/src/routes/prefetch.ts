// Lightweight route prefetch helpers
// Call the same dynamic imports used by React.lazy so chunks are cached before navigation

type Importer = () => Promise<unknown>;

const pathToImporter: Record<string, Importer> = {
  "/": () => import("../pages/Home"),
  "/gaming": () => import("../pages/Gaming/Gaming"),
  "/university": () => import("../pages/University/University"),
  "/classroom": () => import("../pages/ClassRoom"),
  "/search": () => import("../pages/Search"),
  "/files": () => import("../pages/FilesAndArchive"),
  "/store": () => import("../pages/StudentStore"),
  "/tuition": () => import("../pages/Tuition"),
  "/groups": () => import("../pages/Group/Groups"),
  "/notifications": () => import("../pages/Notifications"),
  "/messages": () => import("../pages/Messages"),
  "/saved": () => import("../pages/Saved"),
  "/friends": () => import("../pages/Friends"),
  "/videos": () => import("../pages/Videos"),
  "/profile": () => import("../pages/Profile/Profile"),
  "/settings": () => import("../pages/Settings"),
};

export const prefetchRoute = async (path: string) => {
  const importer = pathToImporter[path];
  if (!importer) return;
  try {
    await importer();
  } catch {
    // ignore prefetch errors
  }
};

export const prefetchOnIdle = (paths: string[]) => {
  const cb = () => {
    paths.forEach((p) => {
      void prefetchRoute(p);
    });
  };

  // Prefer requestIdleCallback when available
  type IdleCallback = (cb: () => void) => void;
  const ric: IdleCallback | undefined =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).requestIdleCallback as IdleCallback | undefined;
  if (typeof ric === "function") {
    ric(cb);
  } else {
    setTimeout(cb, 500);
  }
};
