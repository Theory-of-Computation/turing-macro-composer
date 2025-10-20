import { useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type Node,
  type NodeChange
} from "reactflow";
import "reactflow/dist/style.css";
import { useComposerStore, type ComposerNodeData } from "@/features/block-editor/useComposerStore";
import { motion } from "framer-motion";

interface ComposerCanvasProps {
  onSelectNode?: (id: string) => void;
}

export const ComposerCanvas = ({ onSelectNode }: ComposerCanvasProps) => {
  const nodes = useComposerStore((state) => state.nodes);
  const edges = useComposerStore((state) => state.edges);
  const setNodes = useComposerStore((state) => state.setNodes);
  const setEdges = useComposerStore((state) => state.setEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes(applyNodeChanges<ComposerNodeData>(changes, nodes));
    },
    [nodes, setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges(applyEdgeChanges(changes, edges));
    },
    [edges, setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdges = addEdge({ ...connection, animated: true }, edges);
      setEdges(newEdges);
    },
    [edges, setEdges]
  );

  const nodeTypes = {
    default: ({ data }: { data: ComposerNodeData }) => (
      <motion.div
        layout
        className="min-w-[180px] rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-left text-sm shadow-lg shadow-primary/10 dark:border-slate-700 dark:bg-slate-900 sm:min-w-[200px] sm:text-base xl:min-w-[220px] xl:px-5 xl:py-4 xl:text-base 2xl:min-w-[240px] 2xl:px-6 2xl:py-5 2xl:text-lg"
      >
        <p className="font-semibold text-slate-800 dark:text-slate-100">{data.label}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm xl:text-sm 2xl:text-base">{data.description}</p>
        {data.pseudocode && (
          <p className="mt-3 rounded-lg bg-slate-100 px-3 py-2 text-[11px] leading-tight text-slate-600 dark:bg-slate-800 dark:text-slate-300 sm:text-xs xl:px-4 xl:py-3 xl:text-sm 2xl:text-sm">
            {data.pseudocode}
          </p>
        )}
      </motion.div>
    )
  };

  return (
    <div className="h-full min-h-[320px] rounded-3xl border border-slate-200 bg-white/60 shadow-inner dark:border-slate-800 dark:bg-slate-900/60 xl:min-h-[380px] 2xl:min-h-[420px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node: Node<ComposerNodeData>) => onSelectNode?.(node.id)}
        fitView
        nodeTypes={nodeTypes}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={24} size={1} color="#cbd5f5" />
        <Controls />
        <MiniMap pannable zoomable />
      </ReactFlow>
    </div>
  );
};
