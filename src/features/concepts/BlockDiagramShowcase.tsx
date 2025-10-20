import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/cn";

interface Block {
  id: string;
  label: string;
  description: string;
  role: string;
  color: string;
}

const BLOCKS: Block[] = [
  {
    id: "comparer",
    label: "Comparer",
    description: "Checks whether x ≥ y and routes control accordingly.",
    role: "Control",
    color: "from-sky-400 to-blue-600"
  },
  {
    id: "adder",
    label: "Adder",
    description: "Adds unary strings together by repeated concatenation.",
    role: "Compute",
    color: "from-emerald-400 to-teal-500"
  },
  {
    id: "eraser",
    label: "Eraser",
    description: "Clears the tape when the guard condition fails.",
    role: "Reset",
    color: "from-rose-400 to-pink-500"
  }
];

export const BlockDiagramShowcase = () => {
  const [active, setActive] = useState<Block>(BLOCKS[0]);

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-lg shadow-primary/10 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/60 xl:gap-8 xl:p-8 2xl:gap-10 2xl:p-10">
      <div className="flex flex-wrap items-center justify-between gap-2 xl:gap-3 2xl:gap-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 sm:text-xl xl:text-xl 2xl:text-2xl">Block diagram</h3>
        <p className="text-xs uppercase tracking-[0.35em] text-primary xl:text-sm 2xl:text-sm">Tap or hover to inspect</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] xl:gap-8 2xl:gap-10">
        <div className="relative min-h-[260px] rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-6 dark:border-primary/60 dark:bg-primary/10 xl:min-h-[320px] xl:p-8 2xl:min-h-[360px] 2xl:p-9">
          <motion.div
            layout
            className="absolute inset-0 pointer-events-none"
            style={{ borderRadius: 24 }}
          />
          <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-5 2xl:gap-6">
            {BLOCKS.map((block) => (
              <motion.button
                key={block.id}
                onMouseEnter={() => setActive(block)}
                onFocus={() => setActive(block)}
                onClick={() => setActive(block)}
                className={cn(
                  "group relative flex h-56 flex-col justify-between rounded-2xl border-2 border-transparent p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary xl:h-60 xl:p-5 2xl:h-64 2xl:p-6",
                  active.id === block.id
                    ? "border-primary bg-white/90 shadow-xl dark:bg-slate-900"
                    : "bg-white/60 hover:border-primary/60 hover:bg-white/80 dark:bg-slate-900/60"
                )}
              >
                <motion.span
                  layoutId={`${block.id}-badge`}
                  className="inline-flex items-center rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-lg xl:px-3.5 xl:py-1.5 xl:text-xs"
                >
                  {block.role}
                </motion.span>
                <motion.div layoutId={`${block.id}-panel`} className="space-y-3">
                  <h4 className="text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl xl:text-2xl 2xl:text-3xl">
                    {block.label}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 sm:text-base xl:text-base 2xl:text-lg">{block.description}</p>
                </motion.div>
                <motion.div
                  layoutId={`${block.id}-glow`}
                  className={cn(
                    "absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br opacity-0 blur-xl transition group-hover:opacity-60",
                    block.color
                  )}
                />
              </motion.button>
            ))}
          </div>
        </div>
  <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/80 p-5 text-sm leading-relaxed text-slate-600 shadow-inner dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300 xl:gap-5 xl:p-7 xl:text-base 2xl:gap-6 2xl:p-8 2xl:text-base">
          <p>
            <strong>{active.label}</strong> · {active.description}
          </p>
          <p>
            In the composed machine, the Comparer fires first. Depending on the comparison result, it
            activates either the Adder or the Eraser. Each block exposes input/output ports so data can
            flow across tape regions.
          </p>
          <p>
            Hover to see how control pathways illuminate. This visual mirrors the flow diagrams from Linz
            and builds intuition for macroinstructions in Example 9.13.
          </p>
        </div>
      </div>
    </div>
  );
};
