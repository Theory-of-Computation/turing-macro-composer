import { useMemo } from "react";
import { motion } from "framer-motion";

const tapeCells = [
  // { id: -8, symbol: "□", region: "A" },
  // { id: -7, symbol: "□", region: "A" },
  // { id: -6, symbol: "□", region: "A" },
  // { id: -5, symbol: "□", region: "A" },
  { id: -4, symbol: "□", region: "A" },
  { id: -3, symbol: "a", region: "A" },
  { id: -2, symbol: "#", region: "separator" },
  { id: -1, symbol: "a", region: "T" },
  { id: 0, symbol: "b", region: "T" },
  // { id: 1, symbol: "c", region: "T" },
  { id: 2, symbol: "#", region: "separator" },
  { id: 3, symbol: "b", region: "B" },
  { id: 4, symbol: "a", region: "B" },
  { id: 5, symbol: "□", region: "B" },
  // { id: 6, symbol: "□", region: "B" },
  // { id: 7, symbol: "□", region: "B" },
  // { id: 8, symbol: "□", region: "B" },
];

const headIndex = tapeCells.findIndex((cell) => cell.region === "T" && cell.symbol === "b");

const regionGuides = [
  { label: "Workspace for A", start: 0, end: 1 },
  { label: "T", start: 3, end: 4 },
  { label: "Workspace for B", start: 6, end: 7 },
];

export const TapeAnimation = () => {
  const loop = useMemo(
    () => ({ repeat: Infinity, duration: 7, ease: "easeInOut" as const, repeatType: "mirror" as const }),
    [],
  );

  return (
    <div className="relative mx-auto mt-10 w-full max-w-2xl rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white/90 via-white/95 to-white/65 p-6 pt-10 shadow-xl shadow-primary/5 backdrop-blur dark:border-slate-700/80 dark:from-slate-900/85 dark:via-slate-900/70 dark:to-slate-900/60 sm:mt-12 sm:rounded-3xl sm:p-8 sm:pt-12">
      <div className="absolute inset-x-0 -top-5 flex justify-center text-[0.6rem] font-medium uppercase tracking-[0.4em] text-slate-500 dark:text-slate-600 sm:-top-6 sm:text-[0.65rem]">
        Turing Tape
      </div>
      <div className="relative mx-auto w-full overflow-x-auto lg:overflow-hidden pb-4 sm:pb-6">
        <motion.div
          className="relative mx-auto grid min-w-max grid-flow-col auto-cols-[3rem] items-center gap-2 overflow-visible py-6 sm:auto-cols-[3.75rem]"
          animate={{ x: ["0%", "-6%", "0%"] }}
          transition={loop}
        >
          {tapeCells.map((cell, index) => {
          const isHead = index === headIndex;
          const isSeparator = cell.region === "separator";

          return (
            <div
              key={cell.id}
              className={`relative flex h-20 flex-col items-center justify-center rounded-2xl border px-2 text-base font-semibold transition-colors sm:h-24 sm:text-lg ${
                isSeparator
                  ? "border-sky-300/60 bg-sky-100/70 text-sky-700 shadow-sm shadow-sky-200/50 dark:border-sky-400/40 dark:bg-sky-900/50 dark:text-sky-200"
                  : "border-slate-300/70 bg-white/95 text-slate-700 shadow-sm shadow-slate-300/30 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-100"
              }`}
            >
              {isHead && (
                <div className="pointer-events-none absolute -top-12 flex flex-col items-center text-primary sm:-top-16">
                  <span className="text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-300 sm:text-xs">
                    Internal state
                  </span>
                  <span className="text-base font-semibold text-primary sm:text-lg">q₀</span>
                  <svg
                    aria-hidden="true"
                    className="mt-1 h-7 w-4 text-primary sm:h-8"
                    fill="none"
                    viewBox="0 0 12 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6 0v18M6 18l-4-4M6 18l4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
              )}
              <div
                className="absolute inset-0 rounded-2xl border border-transparent"
                style={{
                  boxShadow: isHead
                    ? "0 0 0 3px rgba(59,130,246,0.25), inset 0 0 0 2px rgba(59,130,246,0.65)"
                    : isSeparator
                      ? "inset 0 0 0 1px rgba(56,189,248,0.35)"
                      : "inset 0 0 0 1px rgba(148,163,184,0.4)",
                }}
              />
              <span className={isSeparator ? "text-2xl font-black" : "text-2xl font-semibold"}>{cell.symbol}</span>
            </div>
          );
        })}
        </motion.div>
      </div>
      <div className="relative mx-auto -mt-1 hidden w-full max-w-2xl justify-center sm:flex">
        <div className="pointer-events-none absolute inset-x-0 top-0 grid grid-flow-col auto-cols-[3.75rem] gap-2 px-[1.125rem]">
          {regionGuides.map((region) => (
            <div
              key={region.label}
              className="relative flex items-center justify-center"
              style={{ gridColumn: `${region.start + 1} / ${region.end + 2}` }}
            >
              <div className="absolute top-0 h-px w-full bg-slate-300/70 dark:bg-slate-600/70" />
              <span className="mt-2 rounded-full bg-white/80 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-slate-500 shadow-sm shadow-slate-200/40 backdrop-blur dark:bg-slate-900/60 dark:text-slate-300 dark:shadow-slate-900/60">
                {region.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex items-center justify-center gap-3 text-[0.6rem] uppercase tracking-[0.35em] text-slate-500 sm:hidden">
        <span className="rounded-full bg-white/80 px-3 py-1 shadow-sm shadow-slate-200/40 backdrop-blur dark:bg-slate-900/60 dark:text-slate-300">
          Workspace A
        </span>
        <span className="rounded-full bg-white/80 px-3 py-1 shadow-sm shadow-slate-200/40 backdrop-blur dark:bg-slate-900/60 dark:text-slate-300">
          T
        </span>
        <span className="rounded-full bg-white/80 px-3 py-1 shadow-sm shadow-slate-200/40 backdrop-blur dark:bg-slate-900/60 dark:text-slate-300">
          Workspace B
        </span>
      </div>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 sm:mt-14">
        <span>
          Head position: <span className="font-semibold text-primary">T region (symbol {tapeCells[headIndex].symbol})</span>
        </span>
        <span>
          Separators: <span className="font-semibold text-primary"># marks region boundaries</span>
        </span>
      </div>
    </div>
  );
};
