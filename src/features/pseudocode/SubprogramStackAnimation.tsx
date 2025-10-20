import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FRAMES = [
  { label: "MAIN", description: "macro multiply" },
  { label: "ADD", description: "repeated addition" },
  { label: "COPY", description: "duplicate unary" }
];

export const SubprogramStackAnimation = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FRAMES.length);
    }, 1800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative h-full rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-primary/10 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <p className="text-xs uppercase tracking-[0.3em] text-primary">Call stack</p>
      <div className="mt-6 flex flex-col gap-4">
        <AnimatePresence>
          {FRAMES.map((frame, index) => (
            <motion.div
              key={frame.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className={`rounded-2xl border px-5 py-4 text-sm ${
                index === activeIndex
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900"
              }`}
            >
              <p className="font-semibold">{frame.label}</p>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{frame.description}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
