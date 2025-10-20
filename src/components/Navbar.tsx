import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MODULE_ROUTES } from "@/data/routes";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleNavigate = () => setIsOpen(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4 xl:max-w-full xl:px-8 2xl:px-12">
        <NavLink to="/" className="flex items-center gap-3" onClick={handleNavigate}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 shrink-0">
            <span className="text-lg font-bold text-primary">TM</span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-primary md:text-base xl:text-base">Building Complex Machines</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 md:text-sm xl:text-sm">
              Understanding Turing Machine Composition
            </p>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-2 lg:flex">
          {MODULE_ROUTES.map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }: { isActive: boolean }) =>
                cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition hover:bg-primary/10 xl:px-5 xl:py-2.5 xl:text-sm",
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300"
                )
              }
              onClick={handleNavigate}
            >
              {route.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="rounded-full p-2 text-slate-600 transition hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800/70 lg:hidden"
            onClick={handleToggle}
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border-t border-slate-200 bg-white/95 px-6 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/95 lg:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-2 xl:max-w-7xl">
              {MODULE_ROUTES.map((route) => (
                <NavLink
                  key={route.path}
                  to={route.path}
                  className={({ isActive }: { isActive: boolean }) =>
                    cn(
                      "rounded-2xl px-4 py-3 text-sm font-medium",
                      isActive
                        ? "bg-primary text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-primary/10 dark:bg-slate-900 dark:text-slate-200"
                    )
                  }
                  onClick={handleNavigate}
                >
                  {route.label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
