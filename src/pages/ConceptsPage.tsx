import { BlockDiagramShowcase } from "@/features/concepts/BlockDiagramShowcase";
import { PseudocodeToggle } from "@/features/concepts/PseudocodeToggle";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const ConceptsPage = () => {
  return (
    <section className="py-16 lg:py-20 2xl:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 xl:max-w-7xl xl:px-8 2xl:max-w-[90rem] 2xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-6 rounded-3xl border border-primary/30 bg-primary/10 p-8 shadow-xl shadow-primary/10 backdrop-blur-lg dark:border-primary/40 dark:bg-primary/20 xl:p-10 2xl:p-12"
        >
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-primary xl:text-sm 2xl:text-sm">High-level thinking</p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl xl:text-4xl 2xl:text-5xl">
              From δ to diagrams and macros
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-700 dark:text-slate-200 sm:text-base xl:max-w-3xl xl:text-base 2xl:max-w-4xl 2xl:text-lg">
            This page bridges low-level transition functions with the rich macroinstruction notation
            highlighted by Linz. Explore block diagrams that animate control flow, then toggle between
            macroinstructions and the δ representation to understand their alignment.
          </p>
          <div className="flex flex-wrap gap-3 xl:gap-4">
            <Button variant="primary" asChild>
              <Link to="/visual-demo">Open the visual demo</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/macroinstructions">Jump to macroinstructions</Link>
            </Button>
          </div>
        </motion.div>

        <BlockDiagramShowcase />
        <PseudocodeToggle />
      </div>
    </section>
  );
};
