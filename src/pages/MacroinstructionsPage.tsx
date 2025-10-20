import { useState } from "react";
import { motion } from "framer-motion";
import { PseudocodeToggle } from "@/features/concepts/PseudocodeToggle";
import { SubprogramStackAnimation } from "@/features/pseudocode/SubprogramStackAnimation";
import { Button } from "@/components/ui/button";

const options = [
  {
    id: "searchright",
    label: "searchright(a, q_i, q_j)",
    explanation: "Moves right until it finds symbol a, then branches to q_j"
  },
  {
    id: "erase",
    label: "erase()",
    explanation: "Clears the tape region from the head onward"
  },
  {
    id: "add",
    label: "add(y)",
    explanation: "Appends unary y to the accumulator"
  }
];

export const MacroinstructionsPage = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selected === "searchright";

  return (
    <section className="py-16 lg:py-20 2xl:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 xl:max-w-7xl xl:px-8 2xl:max-w-[90rem] 2xl:gap-14 2xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] 2xl:gap-12"
        >
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl xl:text-5xl 2xl:text-6xl">
              Macroinstructions and reusable subroutines
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base xl:max-w-3xl xl:text-lg 2xl:max-w-4xl 2xl:text-xl">
              Example 9.13 introduces macros like <em>searchright</em> that encapsulate many δ transitions.
              Hover over the macroinstructions to see how they translate into the transition function. On
              the right, watch the call stack animate as subprograms push and pop.
            </p>
            <PseudocodeToggle />
          </div>
          <SubprogramStackAnimation />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl shadow-primary/10 dark:border-slate-800 dark:bg-slate-900/70 xl:p-8 2xl:p-10"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-primary xl:text-sm 2xl:text-base">Quick check</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100 sm:text-2xl xl:text-3xl 2xl:text-4xl">
            Which macroinstruction routes control when symbol <span className="font-bold">a</span> is found?
          </h3>
          <div className="mt-6 space-y-3 xl:space-y-4">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setSelected(option.id);
                  setSubmitted(false);
                }}
                className={`flex w-full flex-col gap-1 rounded-2xl border px-4 py-3 text-left text-sm transition xl:px-5 xl:py-4 xl:text-base 2xl:px-6 2xl:py-5 2xl:text-lg ${
                  selected === option.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-slate-200 bg-white text-slate-600 hover:border-primary hover:bg-primary/5 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                }`}
              >
                <span className="font-semibold">{option.label}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 xl:text-sm 2xl:text-base">{option.explanation}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3 xl:gap-4">
            <Button variant="primary" size="sm" onClick={() => setSubmitted(true)} disabled={!selected}>
              Check answer
            </Button>
            {submitted && selected && (
              <span className={isCorrect ? "text-emerald-500" : "text-rose-500"}>
                {isCorrect ? "Correct! searchright moves to q_j when it finds a." : "Not quite—searchright handles that guard."}
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
