import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type TapeCellRole = "x" | "y" | "marker" | "separator" | "result" | "blank" | "consumed";

interface TapeCell {
  symbol: string;
  role: TapeCellRole;
  head?: boolean;
}

interface MultiplicationStep {
  title: string;
  description: string;
  state: string;
  tape: TapeCell[];
  note?: string;
}

const ROLE_LABEL: Record<TapeCellRole, string> = {
  x: "Input x cell",
  y: "Input y cell",
  marker: "Marked x cell",
  separator: "Tape separator",
  result: "Result accumulator",
  blank: "Blank cell",
  consumed: "Marked y cell"
};

const ROLE_STYLES: Record<TapeCellRole, string> = {
  x: "border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-500/70 dark:bg-sky-500/10 dark:text-sky-200",
  y: "border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-500/70 dark:bg-violet-500/10 dark:text-violet-200",
  marker: "border-amber-400 bg-amber-50 text-amber-600 dark:border-amber-400/70 dark:bg-amber-400/10 dark:text-amber-200",
  separator: "border-slate-300 bg-slate-100 text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300",
  result: "border-emerald-500 bg-emerald-50 text-emerald-600 dark:border-emerald-400/70 dark:bg-emerald-400/10 dark:text-emerald-200",
  blank: "border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500",
  consumed: "border-violet-300 bg-violet-100 text-violet-600 dark:border-violet-400/60 dark:bg-violet-400/10 dark:text-violet-200"
};

const steps: MultiplicationStep[] = [
  {
    title: "Mark the next symbol in x",
    description: "The head highlights the leftmost 1 of x so we remember which copy we are working on before moving toward y.",
    state: "q_mark",
    note: "Amber shows the marked symbol in x. Purple cells belong to y, and green cells will hold the running product.",
    tape: [
      { symbol: "X", role: "marker", head: true },
      { symbol: "1", role: "x" },
      { symbol: "1", role: "x" },
      { symbol: "□", role: "separator" },
      { symbol: "1", role: "y" },
      { symbol: "1", role: "y" },
      { symbol: "1", role: "y" },
      { symbol: "□", role: "separator" },
      { symbol: "□", role: "result" },
      { symbol: "□", role: "result" },
      { symbol: "□", role: "result" },
      { symbol: "□", role: "result" },
      { symbol: "□", role: "result" }
    ]
  },
  {
    title: "Copy y into the accumulator",
    description: "We shuttle across y. Every time we encounter a 1 in y, we append a new 1 at the end of the tape to grow the product region.",
    state: "q_copy",
    note: "Consumed y symbols temporarily change to Y so we know they have been paired with the current mark in x.",
    tape: [
      { symbol: "X", role: "marker" },
      { symbol: "1", role: "x" },
      { symbol: "1", role: "x" },
      { symbol: "□", role: "separator" },
      { symbol: "Y", role: "consumed" },
      { symbol: "Y", role: "consumed" },
      { symbol: "1", role: "y", head: true },
      { symbol: "□", role: "separator" },
      { symbol: "1", role: "result" },
      { symbol: "1", role: "result" },
      { symbol: "1", role: "result" },
      { symbol: "□", role: "result" },
      { symbol: "□", role: "result" }
    ]
  },
  {
    title: "Restore and return to x",
    description: "After copying, the machine rewinds left, unmarks the X back to 1, and gets ready to look for the next unprocessed symbol in x.",
    state: "q_restore",
    note: "The head is back over the x block so the loop can continue with the next 1.",
    tape: [
      { symbol: "1", role: "x", head: true },
      { symbol: "1", role: "x" },
      { symbol: "1", role: "x" },
      { symbol: "□", role: "separator" },
      { symbol: "1", role: "y" },
      { symbol: "1", role: "y" },
      { symbol: "1", role: "y" },
      { symbol: "□", role: "separator" },
      { symbol: "1", role: "result" },
      { symbol: "1", role: "result" },
      { symbol: "1", role: "result" },
      { symbol: "□", role: "result" },
      { symbol: "□", role: "result" }
    ]
  },
  {
    title: "Final check and halt",
    description: "Once every 1 in x has been processed, the machine leaves blanks behind and halts with the full product in the accumulator region.",
    state: "q_check",
    note: "All of x and y have been cleared, and the result region now contains nine 1s representing 3 × 3.",
    tape: [
      { symbol: "□", role: "blank" },
      { symbol: "□", role: "blank" },
      { symbol: "□", role: "blank" },
      { symbol: "□", role: "separator" },
      { symbol: "□", role: "blank" },
      { symbol: "□", role: "blank" },
      { symbol: "□", role: "blank" },
      { symbol: "□", role: "separator" },
      { symbol: "1", role: "result", head: true },
      { symbol: "1", role: "result" },
      { symbol: "1", role: "result" },
      { symbol: "1", role: "result" },
      { symbol: "1", role: "result" },
      { symbol: "1", role: "result" },
      { symbol: "1", role: "result" },
      { symbol: "1", role: "result" },
      { symbol: "1", role: "result" },
      { symbol: "□", role: "blank" }
    ]
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
                      {step.tape.map((cell, idx) => (
                        <span
                          key={`${idx}-${cell.symbol}-${cell.role}`}
                          title={ROLE_LABEL[cell.role]}
                          className={cn(
                            "relative flex h-10 w-10 items-center justify-center rounded-xl border text-base font-semibold uppercase tracking-[0.15em] transition xl:h-12 xl:w-12 xl:text-lg 2xl:h-14 2xl:w-14 2xl:text-xl",
                            "dark:shadow-[0_0_0_1px_rgba(15,23,42,0.35)]",
                            ROLE_STYLES[cell.role],
                            cell.head &&
                              "ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-slate-900"
                          )}
                        >
                          {cell.symbol}
                          {cell.head && (
                            <span className="absolute -top-3 text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-primary dark:text-primary-200">
                              head
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                  {step.note && (
                    <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-xs leading-relaxed text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 xl:p-5 xl:text-sm 2xl:p-6 2xl:text-base">
                      {step.note}
                    </div>
                  )}
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
