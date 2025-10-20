import { nanoid } from "nanoid";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Node, Edge } from "reactflow";

export type BlockKind =
  | "adder"
  | "comparer"
  | "eraser"
  | "copier"
  | "multiplier"
  | "conditional"
  | "custom";

export interface ComposerNodeData {
  label: string;
  description: string;
  ports: { inputs: number; outputs: number };
  kind: BlockKind;
  pseudocode?: string;
}

export interface ComposerTemplate {
  id: string;
  name: string;
  description: string;
  nodes: Node<ComposerNodeData>[];
  edges: Edge[];
}

interface ComposerState {
  nodes: Node<ComposerNodeData>[];
  edges: Edge[];
  addNode: (data: ComposerNodeData, position?: { x: number; y: number }) => void;
  updateNode: (id: string, data: Partial<ComposerNodeData>) => void;
  removeNode: (id: string) => void;
  removeEdge: (id: string) => void;
  setEdges: (edges: Edge[]) => void;
  setNodes: (nodes: Node<ComposerNodeData>[]) => void;
  setTemplates: (templates: ComposerTemplate[]) => void;
  templates: ComposerTemplate[];
  loadTemplate: (templateId: string) => void;
  reset: () => void;
}

const defaultNodes: Node<ComposerNodeData>[] = [
  {
    id: "input-x",
    type: "input",
    position: { x: -200, y: 0 },
    data: {
      label: "Input x",
      description: "Unary input x",
      ports: { inputs: 0, outputs: 1 },
      kind: "custom"
    }
  },
  {
    id: "input-y",
    type: "input",
    position: { x: -200, y: 160 },
    data: {
      label: "Input y",
      description: "Unary input y",
      ports: { inputs: 0, outputs: 1 },
      kind: "custom"
    }
  }
];

const defaultEdges: Edge[] = [];

const initialTemplates: ComposerTemplate[] = [
  {
    id: "example-912",
    name: "Example 9.12",
    description: "Computes f(x, y) = x + y when x ≥ y else 0.",
    nodes: [
      ...defaultNodes,
      {
        id: "comparer",
        type: "default",
        position: { x: 80, y: 40 },
        data: {
          label: "Comparer",
          description: "Checks whether x ≥ y",
          ports: { inputs: 2, outputs: 2 },
          kind: "comparer",
          pseudocode: "compare(x, y) => flag ≥"
        }
      },
      {
        id: "adder",
        type: "default",
        position: { x: 360, y: -40 },
        data: {
          label: "Adder",
          description: "Adds y to x",
          ports: { inputs: 2, outputs: 1 },
          kind: "adder",
          pseudocode: "result := x + y"
        }
      },
      {
        id: "eraser",
        type: "default",
        position: { x: 360, y: 160 },
        data: {
          label: "Eraser",
          description: "Deletes tape when x < y",
          ports: { inputs: 1, outputs: 1 },
          kind: "eraser",
          pseudocode: "erase tape"
        }
      }
    ],
    edges: [
      { id: "x-to-comparer", source: "input-x", target: "comparer", sourceHandle: "a" },
      { id: "y-to-comparer", source: "input-y", target: "comparer", sourceHandle: "b" },
      { id: "comparer-to-adder", source: "comparer", target: "adder", label: "≥" },
      { id: "comparer-to-eraser", source: "comparer", target: "eraser", label: "<" }
    ]
  },
  {
    id: "n-n-plus-one",
    name: "f(n) = n(n+1)",
    description: "Uses copier and adder blocks to build n(n+1).",
    nodes: [
      ...defaultNodes.filter((node) => node.id !== "input-y"),
      {
        id: "copier",
        type: "default",
        position: { x: 80, y: -40 },
        data: {
          label: "Copier",
          description: "Duplicates unary input",
          ports: { inputs: 1, outputs: 2 },
          kind: "copier",
          pseudocode: "copy until blank"
        }
      },
      {
        id: "adder-1",
        type: "default",
        position: { x: 360, y: -120 },
        data: {
          label: "Adder",
          description: "Adds input to accumulator",
          ports: { inputs: 2, outputs: 1 },
          kind: "adder",
          pseudocode: "acc := acc + n"
        }
      }
    ],
    edges: [
      { id: "input-to-copier", source: "input-x", target: "copier" },
      { id: "copier-to-adder1", source: "copier", target: "adder-1" }
    ]
  }
];

const BASELINE_STATE = {
  nodes: defaultNodes,
  edges: defaultEdges,
  templates: initialTemplates
};

type SetState = (
  fn:
    | ComposerState
    | Partial<ComposerState>
    | ((state: ComposerState) => ComposerState | Partial<ComposerState>)
) => void;

type GetState = () => ComposerState;

export const useComposerStore = create<ComposerState>()(
  persist<ComposerState>(
    (set: SetState, get: GetState) => ({
      ...BASELINE_STATE,
      addNode: (data: ComposerNodeData, position: { x: number; y: number } = { x: 120, y: 40 }) => {
        const id = nanoid(6);
        const node: Node<ComposerNodeData> = {
          id,
          type: "default",
          position,
          data
        };
        set((state) => ({ nodes: [...state.nodes, node] }));
      },
      removeNode: (id: string) => {
        set((state) => ({
          nodes: state.nodes.filter((node) => node.id !== id),
          edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id)
        }));
      },
      removeEdge: (id: string) => {
        set((state) => ({ edges: state.edges.filter((edge) => edge.id !== id) }));
      },
      updateNode: (id: string, updates: Partial<ComposerNodeData>) => {
        set((state) => ({
          nodes: state.nodes.map((node: Node<ComposerNodeData>) =>
            node.id === id
              ? {
                  ...node,
                  data: { ...node.data, ...updates }
                }
              : node
          )
        }));
      },
      setEdges: (edges: Edge[]) => set({ edges }),
      setNodes: (nodes: Node<ComposerNodeData>[]) => set({ nodes }),
      reset: () => set(BASELINE_STATE),
      templates: initialTemplates,
      setTemplates: (templates: ComposerTemplate[]) => set({ templates }),
      loadTemplate: (templateId: string) => {
        const template = get().templates.find((item) => item.id === templateId);
        if (!template) return;
        set({
          nodes: template.nodes.map((node) => ({ ...node, id: nanoid(6) })),
          edges: template.edges.map((edge) => ({ ...edge, id: nanoid(6) }))
        });
      }
    }),
    {
      name: "tmc-composer"
    }
  )
);
