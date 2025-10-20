import { useMemo } from "react";
import { motion } from "framer-motion";

const tapeCells = Array.from({ length: 20 }, (_, index) => index - 10);

export const TapeAnimation = () => {
  const loop = useMemo(() => ({ repeat: Infinity, duration: 12, ease: "linear" as const }), []);

  return (
  <div className="relative mx-auto mt-10 w-full max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white/70 shadow-xl shadow-primary/10 backdrop-blur dark:border-slate-700 dark:bg-slate-900/60 sm:max-w-2xl lg:max-w-3xl">
      <div className="absolute inset-x-0 top-4 flex justify-center text-xs uppercase tracking-[0.3em] text-primary">
        Turing Tape
      </div>
      <motion.div
        className="flex items-center gap-1 px-4 py-10 text-base font-semibold sm:px-6 sm:py-12 sm:text-lg"
        animate={{ x: [0, -120, 0] }}
        transition={loop}
      >
        {tapeCells.map((cell) => (
          <div
            key={cell}
            className="flex h-14 w-10 flex-col items-center justify-center rounded-lg border border-slate-200 bg-white/90 text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-100 sm:h-16 sm:w-12"
          >
            <span className="text-xs text-slate-400">{cell === 0 ? "head" : ""}</span>
            <span>{Math.abs(cell) % 3 === 0 ? "1" : cell % 5 === 0 ? "a" : "□"}</span>
          </div>
        ))}
      </motion.div>
      <motion.div
        className="absolute inset-x-0 bottom-4 flex flex-wrap items-center justify-center gap-2 px-3 text-xs text-slate-500 dark:text-slate-400 sm:gap-4"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span>State: q₄</span>
        <span>Head: moving right</span>
        <span>Symbol: 1 → a</span>
      </motion.div>
    </div>
  );
};
