import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const pseudocode = `if a then q_j else q_k
searchright(a, q_i, q_j)
replace(1, a)
repeat until blank: move right`;

const transitions = `δ(q_i, a) = (q_j, a, R)
δ(q_i, 1) = (q_i, 1, R)
δ(q_i, □) = (q_k, □, L)`;

export const PseudocodeToggle = () => {
  const [mode, setMode] = useState<"pseudocode" | "transitions">("pseudocode");

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-lg shadow-primary/10 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/70 xl:gap-6 xl:p-8 2xl:gap-8 2xl:p-9">
      <div className="flex flex-wrap items-center justify-between gap-3 xl:gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 sm:text-xl xl:text-xl 2xl:text-2xl">Macroinstructions</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 sm:text-base xl:text-base 2xl:text-lg">
            Toggle between high-level macroinstructions and underlying transitions.
          </p>
        </div>
        <div className="flex gap-2 xl:gap-3 2xl:gap-4">
          <Button
            variant={mode === "pseudocode" ? "primary" : "outline"}
            size="sm"
            onClick={() => setMode("pseudocode")}
          >
            Pseudocode
          </Button>
          <Button
            variant={mode === "transitions" ? "primary" : "outline"}
            size="sm"
            onClick={() => setMode("transitions")}
          >
            Turing transitions
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] xl:gap-6 2xl:gap-8">
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.pre
              key={mode}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="h-full rounded-2xl border border-slate-200 bg-slate-50/70 p-6 text-sm leading-7 text-slate-700 shadow-inner dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 sm:text-base xl:p-7 xl:text-base xl:leading-8 2xl:p-8 2xl:text-lg 2xl:leading-8"
            >
              {mode === "pseudocode" ? pseudocode : transitions}
            </motion.pre>
          </AnimatePresence>
        </div>
        <div className="space-y-4 xl:space-y-5 2xl:space-y-6">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-200 bg-white/80 p-5 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300 sm:text-base xl:p-6 xl:text-base 2xl:p-7 2xl:text-lg"
          >
            {mode === "pseudocode" ? (
              <>
                <p>
                  Macroinstructions let us think in chunks like <span className="font-semibold">search</span>,
                  <span className="font-semibold"> replace</span>, and <span className="font-semibold">route</span>
                  , abstracting away δ-level detail.
                </p>
                <p className="mt-3">
                  Hover over the lines to see matching tape behavior in the animation.
                </p>
              </>
            ) : (
              <>
                <p>
                  Translating to the transition function δ clarifies exactly which state and tape updates
                  occur. Notice how the guard symbol <span className="font-semibold">a</span> kicks control to
                  <span className="font-semibold"> q_j</span>, while blanks fall through to <span className="font-semibold">q_k</span>.
                </p>
                <p className="mt-3">This mapping mirrors the style of Example 9.13 in Linz.</p>
              </>
            )}
          </motion.div>
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-slate-500 xl:gap-3 xl:text-sm 2xl:gap-4 2xl:text-sm">
            {[
              "Conditional branching",
              "Tape scanning",
              "Subroutine calls"
            ].map((badge) => (
              <span
                key={badge}
                className={cn(
                  "rounded-full border border-dashed border-primary/40 px-3 py-2 text-[10px] font-semibold text-primary xl:px-4 xl:py-2.5 xl:text-xs 2xl:px-5 2xl:py-3 2xl:text-sm"
                )}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
