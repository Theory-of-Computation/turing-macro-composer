import { useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Handle,
  Position,
  type Connection,
  type EdgeChange,
  type Node,
  type NodeChange,
  type NodeProps
} from "reactflow";
import "reactflow/dist/style.css";
import { useComposerStore, type ComposerNodeData } from "@/features/block-editor/useComposerStore";
import { motion } from "framer-motion";

interface ComposerCanvasProps {
  onSelectNode?: (id?: string) => void;
  onSelectEdge?: (id?: string) => void;
}

export const ComposerCanvas = ({ onSelectNode, onSelectEdge }: ComposerCanvasProps) => {
  const nodes = useComposerStore((state) => state.nodes);
  const edges = useComposerStore((state) => state.edges);
  const setNodes = useComposerStore((state) => state.setNodes);
  const setEdges = useComposerStore((state) => state.setEdges);
  const removeNode = useComposerStore((state) => state.removeNode);

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
    default: ({ id, data, selected }: NodeProps<ComposerNodeData>) => {
      const inputHandles = Array.from({ length: data.ports.inputs });
      const outputHandles = Array.from({ length: data.ports.outputs });

      const getOffset = (index: number, total: number) => `${((index + 1) / (total + 1)) * 100}%`;

      return (
        <motion.div
          layout
          className={`group relative min-w-[180px] rounded-2xl border px-4 py-3 text-left text-sm shadow-lg shadow-primary/10 transition dark:border-slate-700 dark:bg-slate-900 sm:min-w-[200px] sm:text-base xl:min-w-[220px] xl:px-5 xl:py-4 xl:text-base 2xl:min-w-[240px] 2xl:px-6 2xl:py-5 2xl:text-lg ${
            selected
              ? "border-primary/70 bg-primary/5 ring-2 ring-primary/40 dark:border-primary/50"
              : "border-slate-200 bg-white/90"
          }`}
        >
          {inputHandles.map((_, index) => (
            <Handle
              key={`in-${index}`}
              type="target"
              position={Position.Left}
              id={`in-${index}`}
              className="h-2 w-2 rounded-full border border-slate-300 bg-white shadow-sm transition group-hover:scale-[1.15] group-hover:border-primary group-hover:bg-primary"
              style={{ top: getOffset(index, inputHandles.length) }}
            />
          ))}
          {outputHandles.map((_, index) => (
            <Handle
              key={`out-${index}`}
              type="source"
              position={Position.Right}
              id={`out-${index}`}
              className="h-2 w-2 rounded-full border border-slate-300 bg-white shadow-sm transition group-hover:scale-[1.15] group-hover:border-primary group-hover:bg-primary"
              style={{ top: getOffset(index, outputHandles.length) }}
            />
          ))}
          <p className="font-semibold text-slate-800 dark:text-slate-100">{data.label}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm xl:text-sm 2xl:text-base">{data.description}</p>
          {data.pseudocode && (
            <p className="mt-3 rounded-lg bg-slate-100 px-3 py-2 text-[11px] leading-tight text-slate-600 dark:bg-slate-800 dark:text-slate-300 sm:text-xs xl:px-4 xl:py-3 xl:text-sm 2xl:text-sm">
              {data.pseudocode}
            </p>
          )}
          {/* <button
            type="button"
            onPointerDown={(event) => {
              event.stopPropagation();
              event.preventDefault();
            }}
            onClick={(event) => {
              event.stopPropagation();
              removeNode(id);
              onSelectNode?.(undefined);
            }}
            className="absolute -right-2 -top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 shadow-md transition hover:bg-primary hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-primary"
            aria-label="Delete block"
          >
            ×
          </button> */}
        </motion.div>
      );
    }
  };

  return (
    <div className="h-full min-h-[320px] rounded-3xl border border-slate-200 bg-white/60 shadow-inner dark:border-slate-800 dark:bg-slate-900/60 xl:min-h-[380px] 2xl:min-h-[420px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node: Node<ComposerNodeData>) => {
          onSelectEdge?.(undefined);
          onSelectNode?.(node.id);
        }}
        onEdgeClick={(_, edge) => {
          onSelectNode?.(undefined);
          onSelectEdge?.(edge.id);
        }}
        onPaneClick={() => {
          onSelectNode?.(undefined);
          onSelectEdge?.(undefined);
        }}
        onSelectionChange={(params) => {
          const activeId = params?.nodes?.[0]?.id;
          const activeEdge = params?.edges?.[0]?.id;
          onSelectNode?.(activeId);
          onSelectEdge?.(activeEdge);
        }}
        fitView
        nodeTypes={nodeTypes}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={24} size={1} color="#cbd5f5" />
        <Controls />
        {/* <MiniMap pannable zoomable /> */}
      </ReactFlow>
    </div>
  );
};
