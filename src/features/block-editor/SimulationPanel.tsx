import { useMemo, useState, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const TAPE_TEMPLATE = (
  valueX: number,
  valueY: number,
  phase: string
): { tape: string[]; head: number; state: string } => {
  const x = "1".repeat(valueX);
  const y = "1".repeat(valueY);
  switch (phase) {
    case "compare":
      return { tape: ["□", ...x.split(""), "#", ...y.split(""), "□"], head: 1, state: "q_compare" };
    case "add":
      return {
        tape: ["□", ...x.split(""), "#", ...y.split(""), "□", "□"],
        head: x.length + 1,
        state: "q_add"
      };
    case "erase":
      return {
        tape: ["□", ...x.split(""), "#", ...y.split(""), "□"],
        head: x.length + y.length + 2,
        state: "q_erase"
      };
    default:
      return { tape: ["□", "□", "□"], head: 1, state: "q_start" };
  }
};

const phases = ["compare", "add", "erase"] as const;

export const SimulationPanel = () => {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [inputX, setInputX] = useState(3);
  const [inputY, setInputY] = useState(2);

  const data = useMemo(() => TAPE_TEMPLATE(inputX, inputY, phases[phaseIndex]), [inputX, inputY, phaseIndex]);

  const advance = () => setPhaseIndex((prev: number) => (prev + 1) % phases.length);
  const rewind = () => setPhaseIndex((prev: number) => (prev - 1 + phases.length) % phases.length);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/60 xl:p-8 2xl:p-10">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between 2xl:gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 sm:text-xl xl:text-2xl 2xl:text-2xl">Simulation preview</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 sm:text-base xl:text-base 2xl:text-lg">Follow the composed machine phases.</p>
        </div>
        <div className="flex flex-wrap gap-2 xl:gap-3 2xl:gap-4">
          <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-500 xl:text-sm 2xl:text-sm">
            x
            <input
              type="number"
              min={1}
              max={6}
              value={inputX}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setInputX(Number(event.target.value))
              }
              className="h-8 w-16 rounded-lg border border-slate-300 bg-white px-2 text-sm font-semibold text-slate-700 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 xl:h-9 xl:w-20 xl:text-base 2xl:h-10 2xl:w-24 2xl:text-lg"
            />
          </label>
          <label className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-500 xl:text-sm 2xl:text-sm">
            y
            <input
              type="number"
              min={0}
              max={6}
              value={inputY}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setInputY(Number(event.target.value))
              }
              className="h-8 w-16 rounded-lg border border-slate-300 bg-white px-2 text-sm font-semibold text-slate-700 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 xl:h-9 xl:w-20 xl:text-base 2xl:h-10 2xl:w-24 2xl:text-lg"
            />
          </label>
        </div>
      </header>

      <div className="mt-6 flex flex-col gap-4 xl:gap-6 2xl:gap-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={data.state}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 xl:p-7 xl:text-base 2xl:p-8 2xl:text-base"
          >
            <p>
              <span className="font-semibold text-primary">Phase:</span> {phases[phaseIndex]}
            </p>
            <p>
              <span className="font-semibold text-primary">State:</span> {data.state}
            </p>
            <p>
              <span className="font-semibold text-primary">Head:</span> cell {data.head + 1}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-wrap items-center justify-between gap-3 xl:gap-4">
          <div className="flex gap-2 xl:gap-3">
            <Button variant="outline" size="sm" onClick={rewind}>
              Step back
            </Button>
            <Button variant="primary" size="sm" onClick={advance}>
              Step forward
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-slate-400 xl:gap-3 xl:text-sm 2xl:gap-4 2xl:text-sm">
            {phases.map((phase, index) => (
              <span
                key={phase}
                className={`rounded-full border px-3 py-1 ${
                  index === phaseIndex
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-slate-300 text-slate-400"
                }`}
              >
                {phase}
              </span>
            ))}
          </div>
        </div>

        <div className="flex h-32 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-inner dark:border-slate-800 dark:bg-slate-900/70 xl:h-40 xl:p-6 2xl:h-48 2xl:p-8">
          <div className="flex w-full max-w-full justify-center overflow-x-auto">
            <div className="flex min-w-max items-end gap-1 sm:gap-2">
              {data.tape.map((symbol, idx) => (
                <motion.div
                  key={`${symbol}-${idx}`}
                  animate={{ y: idx === data.head ? [-4, 0, -4] : 0 }}
                  transition={{ repeat: idx === data.head ? Infinity : 0, duration: 1.5 }}
                  className={`flex h-20 w-10 flex-col items-center justify-center rounded-xl border sm:h-24 sm:w-12 xl:h-28 xl:w-14 2xl:h-30 2xl:w-14 ${
                    idx === data.head
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-slate-200 bg-white text-slate-700"
                  } dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200`}
                >
                  <span className="text-base font-semibold sm:text-lg xl:text-xl 2xl:text-xl">{symbol}</span>
                  {idx === data.head && (
                    <span className="text-[10px] uppercase text-primary sm:text-[11px] xl:text-xs 2xl:text-xs">head</span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
