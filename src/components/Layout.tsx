import { Link, Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProgressTracker } from "@/components/ProgressTracker";
import { MODULE_ROUTES } from "@/data/routes";
import { getNextRoute, getPreviousRoute } from "@/lib/progress";
import { Button } from "@/components/ui/button";

export const Layout = () => {
  const location = useLocation();
  const currentRoute = MODULE_ROUTES.find((route) => route.path === location.pathname);
  const previousRoute = getPreviousRoute(location.pathname);
  const nextRoute = getNextRoute(location.pathname);

  return (
    <div className="flex min-h-screen flex-col bg-grid bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto w-full max-w-6xl px-6 pb-4 pt-2 xl:max-w-7xl xl:px-8 2xl:max-w-[90rem] 2xl:px-12">
          <ProgressTracker />
          {currentRoute && (
            <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100 md:text-2xl xl:text-2xl">
                  {currentRoute.label}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 md:text-base xl:text-base">
                  {currentRoute.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {previousRoute && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={previousRoute.path}>← {previousRoute.label}</Link>
                  </Button>
                )}
                {nextRoute && (
                  <Button variant="primary" size="sm" asChild>
                    <Link to={nextRoute.path}>{nextRoute.label} →</Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
