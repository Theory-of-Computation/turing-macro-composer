import { useRef, useState } from "react";
import type { ChangeEventHandler } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BlockLibrary } from "@/features/block-editor/BlockLibrary";
import { ComposerCanvas } from "@/features/block-editor/ComposerCanvas";
import { ComposerInspector } from "@/features/block-editor/ComposerInspector";
import { SimulationPanel } from "@/features/block-editor/SimulationPanel";
import { CustomBlockModal } from "@/features/block-editor/CustomBlockModal";
import { useComposerStore, type ComposerNodeData } from "@/features/block-editor/useComposerStore";

const STORAGE_KEY = "tmc-composer-save";

export const VisualDemoPage = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>();
  const [selectedEdgeId, setSelectedEdgeId] = useState<string>();
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const nodes = useComposerStore((state) => state.nodes);
  const edges = useComposerStore((state) => state.edges);
  const setNodes = useComposerStore((state) => state.setNodes);
  const setEdges = useComposerStore((state) => state.setEdges);
  const addNode = useComposerStore((state) => state.addNode);
  const reset = useComposerStore((state) => state.reset);

  const handleSave = () => {
    const payload = JSON.stringify({ nodes, edges });
    window.localStorage.setItem(STORAGE_KEY, payload);
  };

  const handleExport = () => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      nodes,
      edges
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "turing-composer.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      try {
        const text = loadEvent.target?.result;
        if (typeof text !== "string") {
          throw new Error("Invalid file contents");
        }
        const parsed = JSON.parse(text) as {
          nodes: typeof nodes;
          edges: typeof edges;
        };
        setNodes(parsed.nodes);
        setEdges(parsed.edges);
      } catch (error) {
        console.warn("Failed to import composition", error);
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    reader.readAsText(file);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleLoad = () => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as { nodes: typeof nodes; edges: typeof edges };
      setNodes(parsed.nodes);
      setEdges(parsed.edges);
    } catch (error) {
      console.warn("Failed to load saved composition", error);
    }
  };

  const handleCreateCustom = (data: ComposerNodeData) => {
    addNode(data);
  };

  return (
    <section className="py-12 lg:py-16 2xl:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 xl:max-w-7xl xl:gap-10 xl:px-8 2xl:max-w-[94rem] 2xl:gap-12 2xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white/80 px-6 py-4 shadow-lg dark:border-slate-800 dark:bg-slate-900/70 xl:gap-4 xl:px-8 xl:py-6 2xl:gap-6 2xl:px-10 2xl:py-7"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary xl:text-sm 2xl:text-base">Interactive lab</p>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 sm:text-2xl xl:text-3xl 2xl:text-4xl">Turing Composer</h2>
          </div>
          <div className="flex flex-wrap gap-2 xl:gap-3 2xl:gap-4">
            <Button variant="ghost" onClick={reset}>
              Reset
            </Button>
            <Button variant="ghost" onClick={handleLoad}>
              Load
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
            <Button variant="outline" onClick={handleExport}>
              Export JSON
            </Button>
            <Button variant="outline" onClick={handleImportClick}>
              Import JSON
            </Button>
            <Button variant="outline" onClick={() => setShowModal(true)}>
              Custom block
            </Button>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr_280px] xl:gap-8 2xl:grid-cols-[320px_1fr_360px] 2xl:gap-10">
          <BlockLibrary onCreateCustom={() => setShowModal(true)} />
          <ComposerCanvas onSelectNode={setSelectedNodeId} onSelectEdge={setSelectedEdgeId} />
          <ComposerInspector
            selectedNodeId={selectedNodeId}
            selectedEdgeId={selectedEdgeId}
            onClearSelection={() => {
              setSelectedNodeId(undefined);
              setSelectedEdgeId(undefined);
            }}
          />
        </div>

        <SimulationPanel />
      </div>

      <CustomBlockModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateCustom}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleImportFile}
      />
    </section>
  );
};
