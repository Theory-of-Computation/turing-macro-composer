import { useMemo } from "react";
import { useComposerStore, type ComposerNodeData } from "@/features/block-editor/useComposerStore";
import { motion } from "framer-motion";

export const ComposerInspector = ({ selectedId }: { selectedId?: string }) => {
  const nodes = useComposerStore((state) => state.nodes);
  const node = useMemo(() => nodes.find((item) => item.id === selectedId), [nodes, selectedId]);

  if (!node) {
    return (
      <div className="flex h-full min-h-[220px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50/60 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 xl:min-h-[260px] xl:px-8 xl:py-7 xl:text-base 2xl:min-h-[300px] 2xl:px-10 2xl:py-8 2xl:text-lg">
        Select a block to inspect its details
      </div>
    );
  }

  const data = node.data as ComposerNodeData;

  return (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full min-h-[220px] flex-col gap-4 rounded-3xl border border-slate-200 bg-white/70 p-6 text-sm text-slate-600 shadow-inner dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 xl:min-h-[260px] xl:gap-5 xl:p-7 xl:text-base 2xl:min-h-[300px] 2xl:gap-6 2xl:p-8 2xl:text-lg"
    >
      <div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 sm:text-xl xl:text-2xl 2xl:text-3xl">{data.label}</h3>
        <p className="text-xs uppercase tracking-[0.35em] text-primary xl:text-sm 2xl:text-base">{data.kind}</p>
      </div>
      <p>{data.description}</p>
      {data.pseudocode && (
        <pre className="rounded-2xl bg-slate-100/80 p-4 text-xs leading-6 text-slate-700 dark:bg-slate-800/60 dark:text-slate-200 sm:text-sm xl:p-5 xl:text-base xl:leading-7 2xl:p-6 2xl:text-lg 2xl:leading-8">
          {data.pseudocode}
        </pre>
      )}
      <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4 text-xs uppercase tracking-[0.3em] text-primary dark:border-primary/60 dark:bg-primary/10 xl:p-5 xl:text-sm 2xl:p-6 2xl:text-base">
        {data.ports.inputs} inputs • {data.ports.outputs} outputs
      </div>
    </motion.div>
  );
};
