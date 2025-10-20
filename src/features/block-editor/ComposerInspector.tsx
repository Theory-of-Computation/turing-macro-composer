import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  useComposerStore,
  type ComposerNodeData
} from "@/features/block-editor/useComposerStore";
import { motion } from "framer-motion";

interface ComposerInspectorProps {
  selectedNodeId?: string;
  selectedEdgeId?: string;
  onClearSelection?: () => void;
}

export const ComposerInspector = ({ selectedNodeId, selectedEdgeId, onClearSelection }: ComposerInspectorProps) => {
  const nodes = useComposerStore((state) => state.nodes);
  const edges = useComposerStore((state) => state.edges);
  const removeNode = useComposerStore((state) => state.removeNode);
  const removeEdge = useComposerStore((state) => state.removeEdge);

  const node = useMemo(() => nodes.find((item) => item.id === selectedNodeId), [nodes, selectedNodeId]);
  const edge = useMemo(() => edges.find((item) => item.id === selectedEdgeId), [edges, selectedEdgeId]);

  if (node) {
    const data = node.data as ComposerNodeData;

    return (
      <motion.div
        key={`node-${node.id}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex h-full min-h-[220px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/75 text-slate-600 shadow-inner dark:border-slate-800 dark:bg-slate-900/65 dark:text-slate-300 sm:min-h-[240px] xl:min-h-[260px] 2xl:min-h-[300px]"
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-200/60 bg-white/80 px-5 py-4 text-xs uppercase tracking-[0.3em] text-slate-400 dark:border-slate-700/70 dark:bg-slate-900/70 sm:px-6 sm:py-5">
          <span>{data.kind}</span>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 rounded-full bg-red-50 px-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-red-600 shadow-sm hover:bg-red-100 dark:bg-red-400/15 dark:text-red-200 dark:hover:bg-red-400/25"
            onClick={() => {
              removeNode(node.id);
              onClearSelection?.();
            }}
          >
            Delete
          </Button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4 text-sm leading-relaxed sm:px-6 sm:py-5 sm:text-[0.95rem]">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 sm:text-lg xl:text-xl 2xl:text-2xl">{data.label}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 sm:text-[0.92rem]">{data.description}</p>
          {data.pseudocode && (
            <pre className="max-h-40 overflow-y-auto rounded-2xl bg-slate-100/85 px-4 py-3 text-[0.75rem] leading-6 text-slate-700 dark:bg-slate-800/70 dark:text-slate-200 sm:text-sm">
              {data.pseudocode}
            </pre>
          )}
          <div className="rounded-2xl border border-dashed border-primary/35 bg-primary/5 px-4 py-3 text-[0.7rem] uppercase tracking-[0.28em] text-primary dark:border-primary/60 dark:bg-primary/10 sm:text-[0.75rem]">
            {data.ports.inputs} inputs • {data.ports.outputs} outputs
          </div>
        </div>
      </motion.div>
    );
  }

  if (edge) {
    return (
      <motion.div
        key={`edge-${edge.id}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex h-full min-h-[220px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/75 text-slate-600 shadow-inner dark:border-slate-800 dark:bg-slate-900/65 dark:text-slate-300 sm:min-h-[240px] xl:min-h-[260px] 2xl:min-h-[300px]"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-200/60 bg-white/80 px-5 py-4 text-xs uppercase tracking-[0.3em] text-slate-400 dark:border-slate-700/70 dark:bg-slate-900/70 sm:px-6 sm:py-5">
          <span>Connection</span>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 rounded-full bg-red-50 px-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-red-600 shadow-sm hover:bg-red-100 dark:bg-red-400/15 dark:text-red-200 dark:hover:bg-red-400/25"
            onClick={() => {
              removeEdge(edge.id);
              onClearSelection?.();
            }}
          >
            Delete
          </Button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4 text-sm leading-relaxed sm:px-6 sm:py-5">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 sm:text-lg">Route selected</h3>
          <div className="rounded-2xl border border-dashed border-slate-300/70 bg-white/85 px-4 py-3 text-xs text-slate-600 dark:border-slate-700/70 dark:bg-slate-900/60 dark:text-slate-300 sm:text-sm">
          <p className="font-semibold text-slate-800 dark:text-slate-100">From:</p>
          <p className="mb-2 text-slate-500 dark:text-slate-300">{edge.source}</p>
          <p className="font-semibold text-slate-800 dark:text-slate-100">To:</p>
          <p className="text-slate-500 dark:text-slate-300">{edge.target}</p>
          {edge.label && <p className="mt-3 text-[0.7rem] uppercase tracking-[0.35em] text-primary">Label: {edge.label}</p>}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50/60 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 xl:min-h-[260px] xl:px-8 xl:py-7 xl:text-base 2xl:min-h-[300px] 2xl:px-10 2xl:py-8 2xl:text-lg">
      <p className="max-w-[16rem] text-balance leading-relaxed">
        Select a block or connection to see its details and mobile-friendly actions.
      </p>
    </div>
  );
};
