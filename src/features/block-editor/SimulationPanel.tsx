import { useMemo, useState, useEffect, useRef, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useComposerStore } from "@/features/block-editor/useComposerStore";
import {
  simulateComposerGraph,
  type SimulationResult
} from "@/features/block-editor/simulator";

const toUnary = (value: number, cap = 24) => {
  if (value <= 0) return "□";
  if (value > cap) return `${"1".repeat(cap)}… (${value})`;
  return "1".repeat(value);
};

export const SimulationPanel = () => {
  const nodes = useComposerStore((state) => state.nodes);
  const edges = useComposerStore((state) => state.edges);

  const inputNodes = useMemo(() => nodes.filter((node) => node.type === "input"), [nodes]);

  const defaultInputMap = useMemo(() => {
    const map: Record<string, number> = {};
    inputNodes.forEach((node, index) => {
      map[node.id] = index === 0 ? 3 : 1;
    });
    return map;
  }, [inputNodes]);

  const [inputValues, setInputValues] = useState<Record<string, number>>(defaultInputMap);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  const prevInputSignature = useRef<string | undefined>();

  // Preserve existing input values; only add/remove based on current inputNodes
  useEffect(() => {
    const signature = inputNodes
      .map((node) => node.id)
      .sort()
      .join("|");

    if (prevInputSignature.current === signature) {
      return;
    }

    prevInputSignature.current = signature;

    setInputValues((prev) => {
      const next: Record<string, number> = {};
      inputNodes.forEach((node, index) => {
        const defaultVal = index === 0 ? 3 : 1;
        next[node.id] = typeof prev[node.id] === "number" ? prev[node.id] : defaultVal;
      });
      return next;
    });
    setResult(null);
    setErrors([]);
    setActiveStep(0);
  }, [inputNodes]);

  const handleInputChange = (nodeId: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    const num = Math.min(64, Math.max(0, Number(raw)));
    const value = Number.isFinite(num) ? num : 0;
    setInputValues((prev) => ({ ...prev, [nodeId]: value }));
  };

  const handleRun = () => {
    const simulation = simulateComposerGraph({ nodes, edges, inputValues });
    setResult(simulation);
    setErrors(simulation.errors);
    setActiveStep(0);
  };

  const currentStep = result?.steps[activeStep];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/60 xl:p-8 2xl:p-10">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between 2xl:gap-6">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.3em] text-primary sm:text-sm">Simulation</p>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 sm:text-xl xl:text-2xl">
            Execute your composition
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 sm:text-base">
            Provide unary inputs, then run to see each block’s computed output.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {inputNodes.length === 0 && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-amber-700 dark:bg-amber-400/20 dark:text-amber-100">
              Add an input block to simulate
            </span>
          )}
          <Button variant="primary" size="sm" onClick={handleRun} disabled={nodes.length === 0}>
            Run simulation
          </Button>
        </div>
      </header>

      {inputNodes.length > 0 && (
        <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3 xl:gap-4">
          {inputNodes.map((node) => (
            <label
              key={node.id}
              className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-xs uppercase tracking-[0.3em] text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900/70"
            >
              {node.data.label || node.id}
              <input
                type="number"
                min={0}
                max={64}
                value={inputValues[node.id] ?? 0}
                onChange={handleInputChange(node.id)}
                className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-base font-semibold tracking-normal text-slate-700 focus:border-primary focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>
          ))}
        </section>
      )}

      {errors.length > 0 && (
        <div className="mt-6 space-y-2 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-700 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-100">
          {errors.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>
      )}

      {result && result.steps.length > 0 ? (
        <div className="mt-8 space-y-6">
          <div className="flex flex-wrap gap-2">
            {result.steps.map((step, index) => (
              <button
                key={step.nodeId}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] transition ${
                  index === activeStep
                    ? "bg-primary text-white shadow"
                    : "bg-white text-slate-500 shadow-sm hover:bg-primary/10 hover:text-primary dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {step.label}
              </button>
            ))}
          </div>

          {currentStep && (
            <motion.div
              key={currentStep.nodeId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-4 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-inner dark:border-slate-800 dark:bg-slate-900/70 sm:grid-cols-2 sm:gap-6"
            >
              <div className="space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-primary">Block</p>
                  <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    {currentStep.label}
                  </h4>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{currentStep.kind}</p>
                </div>
                {currentStep.note && (
                  <p className="rounded-2xl bg-slate-100/80 px-4 py-3 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-200">
                    {currentStep.note}
                  </p>
                )}
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-xs uppercase tracking-[0.3em] text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  Inputs: {currentStep.inputs.length ? currentStep.inputs.join(", ") : "—"}
                </div>
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Outputs</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {currentStep.outputs.map((value, index) => (
                      <span
                        key={`${currentStep.nodeId}-out-${index}`}
                        className={`rounded-xl px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${
                          currentStep.activeOutputs && !currentStep.activeOutputs.includes(index)
                            ? "bg-slate-200 text-slate-400 dark:bg-slate-800/60 dark:text-slate-500"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-xs uppercase tracking-[0.3em] text-primary dark:border-primary/60 dark:bg-primary/10">
                  Unary: {currentStep.outputs.length ? toUnary(currentStep.outputs[0]) : "—"}
                </div>
              </div>
            </motion.div>
          )}

          {result.outputValues.length > 0 && (
            <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-inner dark:border-slate-800 dark:bg-slate-900/70 sm:grid-cols-2 xl:grid-cols-3">
              {result.outputValues.map((item) => (
                <div key={item.nodeId} className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Output</p>
                  <h5 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                    {item.label}
                  </h5>
                  <div className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
                    <p className="font-semibold text-primary">{item.value}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Unary</p>
                    <p className="mt-1 break-all font-mono text-xs text-slate-500 dark:text-slate-400">{toUnary(item.value)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-100/70 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
          Configure inputs and press <span className="font-semibold text-primary">Run simulation</span> to preview the composed machine.
        </div>
      )}
    </div>
  );
};
