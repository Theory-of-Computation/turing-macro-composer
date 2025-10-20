import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "Mark the next 1 in x",
    description: "Replace the leading 1 in x with a marker a to remember progress.",
    tape: "aaa#bbb#",
    state: "q_mark"
  },
  {
    title: "Copy y",
    description: "Copy the string y to the end of the tape to accumulate product.",
    tape: "aaay#bbb#bbb",
    state: "q_copy"
  },
  {
    title: "Restore marker",
    description: "Turn marker a back to 1 and move left to look for more 1s in x.",
    tape: "111#bbb#bbb",
    state: "q_restore"
  },
  {
    title: "Check for next 1",
    description: "If another 1 exists, loop; otherwise halt with result on tape.",
    tape: "111#bbb#bbbbbb",
    state: "q_check"
  }
];

export const MultiplicationExamplePage = () => {
  const [index, setIndex] = useState(0);

  const step = steps[index];

  const advance = () => setIndex((prev: number) => (prev + 1) % steps.length);
  const rewind = () => setIndex((prev: number) => (prev - 1 + steps.length) % steps.length);

  return (
    <section className="py-16 lg:py-20 2xl:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 xl:max-w-7xl xl:px-8 2xl:max-w-[90rem] 2xl:gap-14 2xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-xl shadow-primary/10 dark:border-slate-800 dark:bg-slate-900/70 xl:p-10 2xl:p-12"
        >
          <div className="grid gap-6 lg:grid-cols-[0.7fr_1fr] xl:gap-10 2xl:gap-14">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-primary xl:text-sm 2xl:text-base">Example 9.14</p>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl xl:text-5xl 2xl:text-6xl">
                Multiplication by repeated addition
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base xl:max-w-3xl xl:text-lg 2xl:max-w-4xl 2xl:text-xl">
                Watch the macro-level steps of the multiplication machine. Each iteration marks the next
                symbol of x, copies y, restores markers, and loops until x is exhausted.
              </p>
              <div className="flex flex-wrap gap-2 xl:gap-3">
                <Button variant="outline" size="sm" onClick={rewind}>
                  Step back
                </Button>
                <Button variant="primary" size="sm" onClick={advance}>
                  Step forward
                </Button>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6 text-sm text-slate-600 shadow-inner dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300 xl:p-8 xl:text-base 2xl:p-10 2xl:text-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 xl:space-y-5 2xl:space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 sm:text-2xl xl:text-3xl 2xl:text-4xl">{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                  <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/10 p-4 xl:p-5 2xl:p-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-primary xl:text-sm 2xl:text-base">Tape snapshot</p>
                    <div className="mt-3 flex flex-wrap gap-1 xl:gap-2">
                      {step.tape.split("").map((symbol, idx) => (
                        <span
                          key={`${symbol}-${idx}`}
                          className={`flex h-10 w-10 items-center justify-center rounded-lg border text-base font-semibold xl:h-12 xl:w-12 xl:text-lg 2xl:h-14 2xl:w-14 2xl:text-xl ${
                            symbol === "#"
                              ? "border-amber-400 bg-amber-50 text-amber-600"
                              : symbol === "a"
                                ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                                : "border-slate-300 bg-white text-slate-700"
                          } dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200`}
                        >
                          {symbol === "#" ? "#" : symbol}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 text-xs uppercase tracking-[0.3em] text-primary dark:border-slate-800 dark:bg-slate-900/70 xl:p-5 xl:text-sm 2xl:p-6 2xl:text-base">
                    Current state: {step.state}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
