import { MODULE_ROUTES } from "@/data/routes";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white/80 py-8 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950/80 dark:text-slate-400 md:py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between xl:max-w-7xl xl:px-8 2xl:max-w-[90rem] 2xl:px-12">
        <div className="space-y-1 text-center md:text-left">
          <p className="font-semibold text-slate-700 dark:text-slate-200 md:text-base xl:text-lg">
            Inspired by Peter Linz, Section 9.2
          </p>
          <p className="text-sm md:text-base xl:text-lg">
            Building Complex Machines: Understanding Turing Machine Composition
          </p>
        </div>
        <nav className="flex flex-wrap justify-center gap-3 md:justify-end">
          {MODULE_ROUTES.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className="rounded-full border border-slate-200 px-4 py-1 text-sm transition hover:border-primary hover:text-primary dark:border-slate-700 md:px-5 md:py-2 md:text-base"
            >
              {route.label}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-center md:text-right md:text-sm">
          For educational purposes · View source on <a className="underline" href="https://github.com/mahdi-kheibari" target="_blank" rel="noopener noreferrer">GitHub</a>
        </p>
      </div>
    </footer>
  );
};
