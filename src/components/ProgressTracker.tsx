import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { MODULE_ROUTES } from "@/data/routes";
import { getRouteProgress } from "@/lib/progress";

export const ProgressTracker = () => {
  const { pathname } = useLocation();
  const progress = getRouteProgress(pathname);

  return (
    <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
      <motion.div
        key={pathname}
        initial={{ width: 0 }}
        animate={{ width: `${Math.round(progress * 100)}%` }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="h-full bg-gradient-to-r from-primary to-accent"
      />
      <div className="absolute inset-0 flex justify-between px-0.5 text-[0px]">
        {MODULE_ROUTES.map((route) => (
          <span key={route.path} className="h-full w-0.5 bg-transparent" />
        ))}
      </div>
    </div>
  );
};
