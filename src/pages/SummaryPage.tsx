import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { computeTotalScore, useExercisesStore } from "@/features/exercises/useExercisesStore";

const milestones = [
  {
    title: "Macroinstruction mindset",
    description: "Treat groups of low-level transitions as reusable blocks to simplify design."
  },
  {
    title: "Copy & mark patterns",
    description: "Manage intermediate markers and duplication as reusable subroutines."
  },
  {
    title: "Composed machine",
    description: "Sequencing macroinstructions yields powerful composite behaviours like multiplication."
  }
];

const nextSteps = [
  {
    title: "Design your own block machine",
    description: "Try composing a machine for exponentiation or subtraction using the library."
  },
  {
    title: "Experiment with optimisations",
    description: "Can you minimise the number of tape scans by reordering macroinstructions?"
  },
  {
    title: "Connect to modern compilers",
    description: "Compare macroinstructions to inlining and function calls in high-level languages."
  }
];

export const SummaryPage = () => {
  const { scores } = useExercisesStore();
  const total = computeTotalScore(scores);

  return (
    <section className="py-16 lg:py-20 2xl:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 xl:max-w-7xl xl:gap-12 xl:px-8 2xl:max-w-[88rem] 2xl:gap-14 2xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-200 bg-white/80 p-10 text-center shadow-xl shadow-primary/10 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 xl:p-12 2xl:p-14"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-primary xl:text-sm 2xl:text-base">Recap</p>
          <h2 className="mt-4 text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl xl:text-6xl 2xl:text-7xl">
            Composition mastery unlocked
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg xl:mx-auto xl:max-w-4xl xl:text-xl 2xl:max-w-5xl 2xl:text-2xl">
            You explored why macroinstructions matter, how to visualise composed Turing machines, and
            how to implement multiplication through coordinated blocks. Your exercise score gives a quick
            signal of retained insight.
          </p>
          <div className="mt-6 inline-flex flex-wrap items-end gap-2 rounded-3xl border border-primary/40 bg-primary/10 px-6 py-4 xl:gap-3 xl:px-8 xl:py-5 2xl:gap-4 2xl:px-10 2xl:py-6">
            <span className="text-xs uppercase tracking-[0.4em] text-primary xl:text-sm">Overall mastery</span>
            <span className="text-5xl font-black text-primary xl:text-6xl 2xl:text-7xl">{total}%</span>
          </div>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3 xl:gap-10 2xl:gap-12">
          {milestones.map((milestone) => (
            <motion.div
              key={milestone.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl border border-slate-200 bg-white/80 p-6 text-left shadow-lg dark:border-slate-800 dark:bg-slate-900/70 xl:p-8 2xl:p-9"
            >
              <p className="text-xs uppercase tracking-[0.4em] text-primary xl:text-sm">Milestone</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl xl:text-3xl 2xl:text-4xl">
                {milestone.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base xl:text-lg 2xl:text-xl">
                {milestone.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900/70 xl:p-10 2xl:p-12"
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] xl:gap-8 2xl:gap-12">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-primary xl:text-sm 2xl:text-base">Where next</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl xl:text-4xl 2xl:text-5xl">
                Extend the composition playbook
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base xl:text-lg 2xl:text-xl">
                Keep experimenting: adapt the block library, refine your macroinstructions, and share
                simulations with classmates. Treat the tape as a canvas for algorithm design.
              </p>
              <div className="mt-5 flex flex-wrap gap-3 xl:gap-4">
                <Button asChild variant="primary">
                  <Link to="/">Return home</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/visual-demo">Revisit visual demo</Link>
                </Button>
              </div>
            </div>
            <div className="space-y-4 xl:space-y-5">
              {nextSteps.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm leading-relaxed shadow-inner dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300 xl:p-5 xl:text-base 2xl:p-6 2xl:text-lg"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-primary xl:text-sm">Next step</p>
                  <h4 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white sm:text-xl xl:text-2xl 2xl:text-3xl">
                    {item.title}
                  </h4>
                  <p className="mt-2">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
