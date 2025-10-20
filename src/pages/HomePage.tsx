import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TapeAnimation } from "@/features/visuals/TapeAnimation";

const storyline = [
  {
    title: "Start with a simple Turing Machine",
    description:
      "Visualize the tape head scanning symbols and updating the tape alphabet with each transition."
  },
  {
    title: "Compose reusable modules",
    description:
      "Combine comparers, adders, erasers and more just like functions in modular programming."
  },
  {
    title: "Deliver complex computations",
    description:
      "Build machines like Example 9.12 that adapt behavior based on intermediate results."
  }
];

export const HomePage = () => {
  return (
    <section className="overflow-x-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100/60 pb-16 pt-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 xl:pb-24 xl:pt-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 xl:max-w-7xl xl:px-8 2xl:max-w-[90rem] 2xl:px-12">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl xl:text-5xl 2xl:text-6xl"
            >
              Building Complex Machines
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-lg text-slate-600 dark:text-slate-300 md:text-xl xl:text-xl"
            >
              Master how individual Turing machines can cooperate through composition, macroinstructions,
              and subprograms. Inspired by Peter Linz, Section 9.2, this guided journey blends rich
              visuals with hands-on exploration.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex w-full flex-wrap justify-center gap-3 md:justify-start"
            >
              <Button asChild size="lg">
                <Link to="/concepts">Start Learning</Link>
              </Button>
              <Button variant="ghost" asChild size="lg">
                <Link to="/visual-demo">Try the Composer</Link>
              </Button>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto w-full max-w-xl overflow-hidden md:mx-0"
          >
            <TapeAnimation />
          </motion.div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 xl:gap-8">
          {storyline.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-primary/5 backdrop-blur-md transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/70 xl:p-7"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary md:text-sm">
                {`Step ${index + 1}`}
              </span>
              <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-slate-100 md:text-2xl">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-300 md:text-base xl:text-base">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-slate-200 bg-white/70 p-8 shadow-xl shadow-primary/10 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/60"
          >
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 md:text-3xl xl:text-3xl">
              Why combine Turing machines?
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300 md:text-lg xl:text-lg">
              Just as modern software is built from modular functions, Turing machines can be organized
              into reusable blocks. Composition enables complex behaviors like conditional routing,
              iterative loops, and subroutine calls—all within the classical TM model.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300 md:text-base xl:text-base">
              <li>· Visualize Example 9.12 with animated block diagrams that glow as control flows.</li>
              <li>· See macroinstructions bridge the gap from δ functions to readable pseudocode.</li>
              <li>· Walk through Example 9.14’s multiplication machine with step controls.</li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-4 rounded-3xl border border-primary/30 bg-primary/10 p-6 text-sm text-primary-foreground dark:border-primary/50 dark:bg-primary/20 md:text-base xl:p-7 xl:text-base"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-primary">
              Learning outcomes
            </p>
            <div className="space-y-2 text-slate-700 dark:text-slate-100">
              <p>· Diagnose how data moves between composed Turing machine blocks.</p>
              <p>· Translate between macroinstructions and low-level tape operations.</p>
              <p>· Practice by designing and validating machines in the interactive lab.</p>
            </div>
            <Button asChild variant="outline" size="lg" className="mt-auto">
              <Link to="/exercises">Jump to Exercises</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
