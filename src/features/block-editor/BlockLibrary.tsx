import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useComposerStore, type BlockKind, type ComposerNodeData, type ComposerTemplate } from "@/features/block-editor/useComposerStore";

const LIBRARY: (ComposerNodeData & { id: string })[] = [
  {
    id: "adder",
    label: "Adder",
    description: "Adds unary inputs",
    ports: { inputs: 2, outputs: 1 },
    kind: "adder",
    pseudocode: "repeat: append y to x"
  },
  {
    id: "comparer",
    label: "Comparer",
    description: "Checks ≥",
    ports: { inputs: 2, outputs: 2 },
    kind: "comparer",
    pseudocode: "if x≥y then pass else route"
  },
  {
    id: "eraser",
    label: "Eraser",
    description: "Clears tape",
    ports: { inputs: 1, outputs: 1 },
    kind: "eraser",
    pseudocode: "erase everything"
  },
  {
    id: "copier",
    label: "Copier",
    description: "Duplicates input",
    ports: { inputs: 1, outputs: 2 },
    kind: "copier",
    pseudocode: "copy until blank"
  },
  {
    id: "conditional",
    label: "Conditional",
    description: "Routes by flag",
    ports: { inputs: 1, outputs: 2 },
    kind: "conditional",
    pseudocode: "if flag then path A else path B"
  }
];

export const BlockLibrary = ({
  onCreateCustom
}: {
  onCreateCustom: () => void;
}) => {
  const addNode = useComposerStore((state) => state.addNode);
  const loadTemplate = useComposerStore((state) => state.loadTemplate);
  const templates = useComposerStore((state) => state.templates);
  const [selectedKind, setSelectedKind] = useState<BlockKind | "all">("all");

  const blocks = selectedKind === "all" ? LIBRARY : LIBRARY.filter((item) => item.kind === selectedKind);

  return (
    <div className="flex h-full flex-col gap-4 rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-inner dark:border-slate-800 dark:bg-slate-900/60 xl:gap-5 xl:p-6 2xl:gap-6 2xl:p-7">
      <header className="flex flex-wrap items-center justify-between gap-3 xl:gap-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500 xl:text-base 2xl:text-base">Blocks</h3>
        <div className="flex flex-wrap items-center gap-1 text-xs xl:gap-2 xl:text-sm 2xl:gap-3 2xl:text-sm">
          <button
            type="button"
            onClick={() => setSelectedKind("all")}
            className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-primary hover:bg-primary/20 xl:px-4 xl:py-1.5 xl:text-xs 2xl:px-5 2xl:py-2 2xl:text-xs"
          >
            All
          </button>
          {(["adder", "comparer", "eraser", "copier", "conditional"] as BlockKind[]).map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => setSelectedKind(kind)}
              className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-slate-500 hover:bg-slate-200/60 xl:px-4 xl:py-1.5 xl:text-xs 2xl:px-5 2xl:py-2 2xl:text-xs"
            >
              {kind}
            </button>
          ))}
        </div>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto pr-1 xl:space-y-4 2xl:space-y-5">
        {blocks.map((block) => (
          <motion.button
            key={block.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => addNode(block)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm shadow-sm transition hover:border-primary hover:bg-primary/10 dark:border-slate-700 dark:bg-slate-900 xl:px-5 xl:py-4 xl:text-base 2xl:px-6 2xl:py-5 2xl:text-base"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-slate-800 dark:text-slate-100">{block.label}</p>
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] uppercase tracking-[0.3em] text-primary xl:px-3 xl:py-1 xl:text-xs 2xl:px-4 2xl:text-xs">
                {block.ports.inputs}/{block.ports.outputs} I/O
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 xl:text-sm 2xl:text-sm">{block.description}</p>
          </motion.button>
        ))}
      </div>
      <div className="flex flex-col gap-2 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4 text-xs text-slate-600 dark:border-primary/60 dark:bg-primary/10 dark:text-slate-300 xl:gap-3 xl:p-5 xl:text-sm 2xl:gap-4 2xl:p-6 2xl:text-sm">
        <p className="font-semibold text-primary">Templates</p>
        <div className="flex flex-wrap gap-2 xl:gap-3 2xl:gap-4">
          {templates.map((template: ComposerTemplate) => (
            <Button key={template.id} size="sm" variant="ghost" onClick={() => loadTemplate(template.id)}>
              {template.name}
            </Button>
          ))}
        </div>
        <Button variant="primary" size="sm" onClick={onCreateCustom}>
          Create custom block
        </Button>
      </div>
    </div>
  );
};
