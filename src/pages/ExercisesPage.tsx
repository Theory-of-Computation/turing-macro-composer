import { ChangeEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { computeTotalScore, useExercisesStore } from "@/features/exercises/useExercisesStore";

const multipleChoiceOptions = [
  {
    id: "parallel",
    label: "It runs all macroinstructions simultaneously with independent tapes."
  },
  {
    id: "sequential",
    label: "It sequences macroinstructions, with control states coordinating tape operations."
  },
  {
    id: "probabilistic",
    label: "It picks a macroinstruction at random and repeats until halt."
  }
];

const matchingItems = [
  {
    key: "prepare",
    prompt: "Prepare",
    correct: "Mark input symbol"
  },
  {
    key: "accumulate",
    prompt: "Accumulate",
    correct: "Append y copy"
  },
  {
    key: "restore",
    prompt: "Restore",
    correct: "Clean marker"
  }
];

const simulationStatements = [
  "The machine should stop when x has no more 1s to mark.",
  "The copy phase must reset the head to the left end of y before duplicating.",
  "Markers allow the machine to remember progress between passes."
];

const shortAnswerExpected = ["macroinstruction", "macro instructions", "macro-instruction"];

const codeQuizTarget = "while (scan('1')) { copyBlock(y); restore(); }";

export const ExercisesPage = () => {
  const { scores, setScore, setResponse, responses, reset } = useExercisesStore();

  const [multipleChoice, setMultipleChoice] = useState<string>(
    (responses.multipleChoice as string | undefined) ?? ""
  );
  const [matching, setMatching] = useState<Record<string, string>>(
    (responses.matching as Record<string, string> | undefined) ?? {
      prepare: "",
      accumulate: "",
      restore: ""
    }
  );
  const [simulationSelections, setSimulationSelections] = useState<Record<number, boolean>>(
    (responses.simulation as Record<number, boolean> | undefined) ?? {}
  );
  const [shortAnswer, setShortAnswer] = useState<string>(
    (responses.shortAnswer as string | undefined) ?? ""
  );
  const [codeAnswer, setCodeAnswer] = useState<string>(
    (responses.codeQuiz as string | undefined) ?? ""
  );
  const totalScore = useMemo(() => computeTotalScore(scores), [scores]);

  const checkMultipleChoice = () => {
    const score = multipleChoice === "sequential" ? 100 : 0;
    setScore("multipleChoice", score);
    setResponse("multipleChoice", multipleChoice);
  };

  const checkMatching = () => {
    const entries = Object.entries(matching);
    const correct = entries.filter(([key, value]) =>
      matchingItems.some((item) => item.key === key && item.correct === value)
    ).length;
    const score = Math.round((correct / matchingItems.length) * 100);
    setScore("matching", score);
    setResponse("matching", matching);
  };

  const checkSimulation = () => {
    const correct = simulationStatements.reduce((sum, _, index) => {
      const isCorrect = simulationSelections[index] ?? false;
      return sum + (isCorrect ? 1 : 0);
    }, 0);
    const score = Math.round((correct / simulationStatements.length) * 100);
    setScore("simulation", score);
    setResponse("simulation", simulationSelections);
  };

  const checkShortAnswer = () => {
    const normalized = shortAnswer.trim().toLowerCase();
    const score = shortAnswerExpected.some((value) => normalized.includes(value)) ? 100 : 0;
    setScore("shortAnswer", score);
    setResponse("shortAnswer", shortAnswer);
  };

  const checkCodeQuiz = () => {
    const sanitized = codeAnswer.replace(/\s+/g, " ").trim();
    const target = codeQuizTarget.replace(/\s+/g, " ").trim();
    const score = sanitized === target ? 100 : 0;
    setScore("codeQuiz", score);
    setResponse("codeQuiz", codeAnswer);
  };

  return (
    <section className="py-16 lg:py-20 2xl:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 xl:max-w-7xl xl:gap-12 xl:px-8 2xl:max-w-[92rem] 2xl:gap-16 2xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-xl shadow-primary/10 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 xl:p-10 2xl:p-12"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between xl:gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-primary xl:text-sm 2xl:text-base">practice</p>
              <h2 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl xl:text-5xl 2xl:text-6xl">
                Exercises & self-checks
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 sm:text-base xl:max-w-3xl xl:text-lg 2xl:max-w-4xl 2xl:text-xl">
                Apply the composition ideas interactively. Your progress persists locally so you can
                revisit later.
              </p>
            </div>
            <div className="rounded-2xl border border-primary/40 bg-primary/10 p-4 text-center xl:p-6 2xl:p-7">
              <p className="text-xs uppercase tracking-[0.4em] text-primary xl:text-sm">overall score</p>
              <p className="text-4xl font-black text-primary xl:text-5xl 2xl:text-6xl">{totalScore}%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 xl:text-sm">Across 5 challenges</p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2 xl:gap-10 2xl:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/70 xl:p-8 2xl:p-9"
          >
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl xl:text-3xl 2xl:text-4xl">
              Multiple choice: why macroinstructions?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 sm:text-base xl:text-lg 2xl:text-xl">
              Pick the best description for how the macroinstruction machine orchestrates the product
              computation.
            </p>
            <form className="mt-4 space-y-3 xl:space-y-4">
              {multipleChoiceOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex cursor-pointer gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm leading-snug shadow-sm transition hover:border-primary/40 hover:bg-primary/10 dark:border-slate-800 dark:bg-slate-900/70 xl:p-5 xl:text-base 2xl:p-6 2xl:text-lg"
                >
                  <input
                    type="radio"
                    name="macroinstructions"
                    value={option.id}
                    checked={multipleChoice === option.id}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setMultipleChoice(event.target.value)}
                    className="mt-1"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </form>
            <div className="mt-4 flex flex-wrap items-center gap-3 xl:gap-4">
              <Button variant="primary" size="sm" onClick={checkMultipleChoice}>
                Check answer
              </Button>
              <p className="text-sm text-slate-500 dark:text-slate-400 xl:text-base">Score: {scores.multipleChoice ?? 0}%</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/70 xl:p-8 2xl:p-9"
          >
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl xl:text-3xl 2xl:text-4xl">Block role matching</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 sm:text-base xl:text-lg 2xl:text-xl">
              Pair each macroinstruction role with what it accomplishes on the tape.
            </p>
            <div className="mt-4 space-y-4 xl:space-y-5">
              {matchingItems.map((item) => (
                <div key={item.key} className="space-y-2 text-sm xl:text-base 2xl:text-lg">
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{item.prompt}</p>
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900 xl:p-4"
                    value={matching[item.key] ?? ""}
                    onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                      setMatching((prev: Record<string, string>) => ({
                        ...prev,
                        [item.key]: event.target.value
                      }))
                    }
                  >
                    <option value="" disabled>
                      Choose description
                    </option>
                    <option value="Mark input symbol">Mark input symbol</option>
                    <option value="Append y copy">Append y copy</option>
                    <option value="Clean marker">Clean marker</option>
                  </select>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 xl:gap-4">
              <Button variant="primary" size="sm" onClick={checkMatching}>
                Check pairs
              </Button>
              <p className="text-sm text-slate-500 dark:text-slate-400 xl:text-base">Score: {scores.matching ?? 0}%</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/70 xl:p-8 2xl:p-9"
          >
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl xl:text-3xl 2xl:text-4xl">Simulation checklist</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 sm:text-base xl:text-lg 2xl:text-xl">
              Select the statements that must be true for the composed machine to halt correctly.
            </p>
            <div className="mt-4 space-y-3 xl:space-y-4">
              {simulationStatements.map((label, index) => {
                const checked = simulationSelections[index] ?? false;
                return (
                  <label
                    key={label}
                    className="flex cursor-pointer gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm leading-snug shadow-sm transition hover:border-primary/40 hover:bg-primary/10 dark:border-slate-800 dark:bg-slate-900/70 xl:p-5 xl:text-base 2xl:p-6 2xl:text-lg"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setSimulationSelections((prev: Record<number, boolean>) => ({
                          ...prev,
                          [index]: event.target.checked
                        }))
                      }
                      className="mt-1"
                    />
                    <span>{label}</span>
                  </label>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 xl:gap-4">
              <Button variant="primary" size="sm" onClick={checkSimulation}>
                Check selections
              </Button>
              <p className="text-sm text-slate-500 dark:text-slate-400 xl:text-base">Score: {scores.simulation ?? 0}%</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/70 xl:p-8 2xl:p-9"
          >
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl xl:text-3xl 2xl:text-4xl">Short reflection</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 sm:text-base xl:text-lg 2xl:text-xl">
              Name the technique Section 9.2 introduces for combining machines. Hint: it encapsulates
              control sequences.
            </p>
            <textarea
              className="mt-4 h-32 w-full rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm leading-relaxed dark:border-slate-800 dark:bg-slate-900 sm:text-base xl:h-36 xl:text-lg 2xl:h-40 2xl:text-xl"
              value={shortAnswer}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setShortAnswer(event.target.value)}
            />
            <div className="mt-4 flex flex-wrap items-center gap-3 xl:gap-4">
              <Button variant="primary" size="sm" onClick={checkShortAnswer}>
                Check response
              </Button>
              <p className="text-sm text-slate-500 dark:text-slate-400 xl:text-base">Score: {scores.shortAnswer ?? 0}%</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/70 xl:p-8 2xl:p-9"
          >
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl xl:text-3xl 2xl:text-4xl">Macro pseudo-code</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 sm:text-base xl:text-lg 2xl:text-xl">
              Type the control loop for the macro machine that multiplies x and y using block
              operations. Match the spacing of the target snippet.
            </p>
            <textarea
              className="mt-4 h-32 w-full rounded-2xl border border-slate-200 bg-white/80 p-4 font-mono text-sm leading-relaxed dark:border-slate-800 dark:bg-slate-900 sm:text-base xl:h-36 xl:text-lg 2xl:h-40 2xl:text-xl"
              value={codeAnswer}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setCodeAnswer(event.target.value)}
            />
            <div className="mt-4 flex flex-wrap items-center gap-3 xl:gap-4">
              <Button variant="primary" size="sm" onClick={checkCodeQuiz}>
                Check pseudo-code
              </Button>
              <p className="text-sm text-slate-500 dark:text-slate-400 xl:text-base">Score: {scores.codeQuiz ?? 0}%</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900/70 md:flex-row xl:p-8 2xl:p-9"
        >
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white sm:text-xl xl:text-2xl 2xl:text-3xl">Reset and revisit</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 sm:text-base xl:text-lg 2xl:text-xl">
              Clearing your progress wipes local scores and responses so you can practice again from
              scratch.
            </p>
          </div>
          <Button variant="outline" onClick={reset}>
            Reset exercises
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
