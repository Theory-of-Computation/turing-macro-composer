import type { Edge, Node } from "reactflow";
import type { ComposerNodeData } from "./useComposerStore";

export interface SimulationStep {
  nodeId: string;
  label: string;
  kind: ComposerNodeData["kind"] | string;
  inputs: number[];
  outputs: number[];
  activeOutputs?: number[];
  note?: string;
}

export interface SimulationResult {
  steps: SimulationStep[];
  outputValues: Array<{ nodeId: string; label: string; value: number }>;
  errors: string[];
}

interface SimulationOptions {
  nodes: Node<ComposerNodeData>[];
  edges: Edge[];
  inputValues: Record<string, number>;
}

type NodeOutputs = number[];

const parseHandleIndex = (handle?: string | null): number | undefined => {
  if (!handle) return undefined;
  const match = handle.match(/-(\d+)$/);
  return match ? Number(match[1]) : undefined;
};

const ensureArray = (length: number) => Array.from({ length }, () => undefined as number | undefined);

const clampToUnary = (value: number) => Math.max(0, Math.floor(value));

const extractNumberFromText = (text: string): number | undefined => {
  const match = text.match(/(-?\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : undefined;
};

const evaluateCustomCondition = (
  text: string,
  primary: number,
  secondary: number,
  explicit?: number
): boolean | undefined => {
  if (!text.includes("if")) return undefined;

  const comparatorValue = explicit ?? secondary;

  if (/(is\s+zero|==\s*0|equals\s+0|blank)/.test(text)) {
    return primary === 0;
  }
  if (/(nonzero|>\s*0|positive)/.test(text)) {
    return primary > 0;
  }
  if (/(<=|≤)/.test(text)) {
    return primary <= comparatorValue;
  }
  if (/(>=|≥)/.test(text)) {
    return primary >= comparatorValue;
  }
  if (/(<)/.test(text)) {
    return primary < comparatorValue;
  }
  if (/(>)/.test(text)) {
    return primary > comparatorValue;
  }
  if (/(==|equals)/.test(text)) {
    return primary === comparatorValue;
  }
  if (/(!=|not\s+equal)/.test(text)) {
    return primary !== comparatorValue;
  }

  return undefined;
};

const evaluateCustomBlock = (
  node: Node<ComposerNodeData>,
  inputs: number[],
  inputValues: Record<string, number>
): { outputs: NodeOutputs; activeOutputs?: number[]; note?: string } => {
  const outputsCount = Math.max(1, node.data.ports.outputs);
  const primaryValue = inputs[0] ?? 0;
  const secondaryValue = inputs[1] ?? 0;
  const lower = (node.data.pseudocode ?? "").toLowerCase();
  const firstLine = node.data.pseudocode?.split("\n")[0]?.trim();
  const createOutputs = (value: number, minOutputs = outputsCount) =>
    Array.from({ length: Math.max(minOutputs, 1) }, () => clampToUnary(value));

  const numberInText = extractNumberFromText(lower);

  if (/(erase|clear|reset|blank)/.test(lower)) {
    return { outputs: createOutputs(0), note: "Cleared tape" };
  }

  if (/(increment|successor|add\s+1\b)/.test(lower)) {
    const next = clampToUnary(primaryValue + 1);
    return { outputs: createOutputs(next), note: `${primaryValue} + 1 = ${next}` };
  }

  if (/(decrement|subtract\s+1\b|predecessor)/.test(lower)) {
    const next = clampToUnary(primaryValue - 1);
    return { outputs: createOutputs(next), note: `${primaryValue} - 1 = ${next}` };
  }

  if (/(add|plus)/.test(lower) && typeof numberInText === "number") {
    const next = clampToUnary(primaryValue + numberInText);
    return { outputs: createOutputs(next), note: `${primaryValue} + ${numberInText} = ${next}` };
  }

  if (/(subtract|minus|remove)/.test(lower) && typeof numberInText === "number") {
    const next = clampToUnary(primaryValue - numberInText);
    return { outputs: createOutputs(next), note: `${primaryValue} - ${numberInText} = ${next}` };
  }

  if (/(double|duplicate\s+and\s+merge)/.test(lower)) {
    const next = clampToUnary(primaryValue * 2);
    return { outputs: createOutputs(next), note: `${primaryValue} × 2 = ${next}` };
  }

  if (/(multiply|times)/.test(lower)) {
    if (typeof numberInText === "number") {
      const next = clampToUnary(primaryValue * numberInText);
      return { outputs: createOutputs(next), note: `${primaryValue} × ${numberInText} = ${next}` };
    }

    const referencesSecond = /(second|other|another|next|input\s*(two|2)|y\b)/.test(lower);
    const factors = (() => {
      if (referencesSecond) {
        const secondary = inputs.length > 1 ? secondaryValue : 1;
        return [primaryValue, secondary];
      }
      if (inputs.length > 1) {
        return inputs;
      }
      return [primaryValue];
    })();

    const product = clampToUnary(factors.reduce((total, current) => total * current, 1));
    return {
      outputs: createOutputs(product),
      note: `${factors.join(" × ")} = ${product}`
    };
  }

  if (/(halve|divide\s+by\s+2)/.test(lower)) {
    const next = clampToUnary(Math.floor(primaryValue / 2));
    return { outputs: createOutputs(next), note: `${primaryValue} ÷ 2 = ${next}` };
  }

  if (/(copy|duplicate|fan[- ]?out)/.test(lower)) {
    const copies = Math.max(outputsCount, /(two|both)/.test(lower) ? 2 : outputsCount);
    return {
      outputs: createOutputs(primaryValue, copies),
      note: `Copied value ${primaryValue}`
    };
  }

  const conditional = evaluateCustomCondition(lower, primaryValue, secondaryValue, numberInText);
  if (typeof conditional === "boolean") {
    const branchOutputs = createOutputs(primaryValue, Math.max(outputsCount, 2));
    return {
      outputs: branchOutputs,
      activeOutputs: [conditional ? 0 : 1],
      note: `Condition ${conditional ? "true" : "false"}`
    };
  }

  const passthroughValue = primaryValue ?? inputValues[node.id] ?? 0;
  return {
    outputs: createOutputs(passthroughValue),
    note: firstLine || "Custom block"
  };
};

const evaluateNode = (
  node: Node<ComposerNodeData>,
  inputs: number[],
  inputValues: Record<string, number>
): { outputs: NodeOutputs; activeOutputs?: number[]; note?: string } => {
  if (node.type === "input" || node.data.ports.inputs === 0) {
    const value = inputValues[node.id] ?? inputValues[node.data.label] ?? inputs[0] ?? 0;
    return { outputs: [value], note: `Input value ${value}` };
  }

  const kind = node.data.kind;

  const [a = 0, b = 0] = inputs;

  switch (kind) {
    case "adder": {
      const sum = inputs.reduce((total, current) => total + (current ?? 0), 0);
      return { outputs: [sum], note: `${inputs.join(" + ")} = ${sum}` };
    }
    case "eraser": {
      return { outputs: [0], note: "Cleared tape" };
    }
    case "copier": {
      const value = inputs[0] ?? 0;
      return {
        outputs: Array.from({ length: Math.max(1, node.data.ports.outputs) }, () => value),
        note: `Copied value ${value}`
      };
    }
    case "comparer": {
      const condition = a >= b;
      return {
        outputs: [a, b],
        activeOutputs: [condition ? 0 : 1],
        note: `${a} ≥ ${b} ⇒ ${condition ? "true" : "false"}`
      };
    }
    case "conditional": {
      const condition = (inputs[1] ?? inputs[0] ?? 0) > 0;
      const value = inputs[0] ?? 0;
      return {
        outputs: [value, value],
        activeOutputs: [condition ? 0 : 1],
        note: `Condition ${condition ? "true" : "false"}`
      };
    }
    case "multiplier": {
      const product = inputs.reduce((total, current) => total * (current ?? 1), 1);
      return { outputs: [product], note: `${inputs.join(" × ")} = ${product}` };
    }
    case "custom":
      return evaluateCustomBlock(node, inputs, inputValues);
    default: {
      const value = inputs[0] ?? 0;
      return {
        outputs: [value],
        note: node.data.pseudocode ? node.data.pseudocode.split("\n")[0] : "Pass-through"
      };
    }
  }
};

export const simulateComposerGraph = ({ nodes, edges, inputValues }: SimulationOptions): SimulationResult => {
  const nodeMap = new Map(nodes.map((node) => [node.id, node] as const));
  const outgoingMap = new Map<string, Edge[]>();
  const incomingMap = new Map<string, Edge[]>();

  edges.forEach((edge) => {
    outgoingMap.set(edge.source, [...(outgoingMap.get(edge.source) ?? []), edge]);
    incomingMap.set(edge.target, [...(incomingMap.get(edge.target) ?? []), edge]);
  });

  const steps: SimulationStep[] = [];
  const errors: string[] = [];
  const pendingInputs = new Map<string, (number | undefined)[]>();
  const nodeOutputs = new Map<string, NodeOutputs>();
  const processed = new Set<string>();
  const inFlight = new Set<string>();

  nodes.forEach((node) => {
    const length = Math.max(0, node.data.ports.inputs);
    pendingInputs.set(node.id, ensureArray(length));
  });

  const queue: string[] = [];

  nodes.forEach((node) => {
    if (node.type === "input" || node.data.ports.inputs === 0) {
      queue.push(node.id);
      inFlight.add(node.id);
    }
  });

  const enqueueIfReady = (nodeId: string) => {
    if (processed.has(nodeId) || inFlight.has(nodeId)) return;
    const node = nodeMap.get(nodeId);
    if (!node) return;
    const inputs = pendingInputs.get(nodeId) ?? [];
    if (inputs.length === 0 || inputs.every((value) => value !== undefined)) {
      queue.push(nodeId);
      inFlight.add(nodeId);
    }
  };

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    inFlight.delete(nodeId);
    const node = nodeMap.get(nodeId);
    if (!node) continue;

    const inputs = pendingInputs.get(nodeId) ?? [];
    const filledInputs = inputs.filter((value): value is number => value !== undefined);

    const { outputs, activeOutputs, note } = evaluateNode(node, filledInputs, inputValues);
    nodeOutputs.set(nodeId, outputs);
    processed.add(nodeId);

    steps.push({
      nodeId,
      label: node.data.label,
      kind: node.data.kind,
      inputs: filledInputs,
      outputs,
      activeOutputs,
      note
    });

    const outgoing = outgoingMap.get(nodeId) ?? [];
    for (const edge of outgoing) {
      const target = nodeMap.get(edge.target);
      if (!target) continue;

      const targetInputs = pendingInputs.get(edge.target) ?? ensureArray(target.data.ports.inputs);

      let handleIndex = parseHandleIndex(edge.sourceHandle);
      if (handleIndex === undefined && (nodeOutputs.get(nodeId)?.length ?? 0) > 1) {
        const label = edge.label?.toString().toLowerCase();
        if (label?.includes("<")) {
          handleIndex = 1;
        } else if (label?.includes("≥") || label?.includes(">=")) {
          handleIndex = 0;
        }
      }

      const active = activeOutputs ? activeOutputs.includes(handleIndex ?? 0) : true;
      if (!active) continue;

      const outputValues = nodeOutputs.get(nodeId) ?? [];
      const value = outputValues[handleIndex ?? 0] ?? outputValues[0];
      if (value === undefined) continue;

      const targetIndex = parseHandleIndex(edge.targetHandle);

      if (targetIndex !== undefined) {
        targetInputs[targetIndex] = value;
      } else {
        const slot = targetInputs.findIndex((item) => item === undefined);
        if (slot !== -1) {
          targetInputs[slot] = value;
        } else if (targetInputs.length === 0) {
          targetInputs.push(value);
        }
      }

      pendingInputs.set(edge.target, targetInputs);
      enqueueIfReady(edge.target);
    }
  }

  nodes
    .filter((node) => !processed.has(node.id))
    .forEach((node) => {
      errors.push(`Node "${node.data.label}" is waiting for inputs. Check connections.`);
    });

  const outputValues = nodes
    .filter((node) => (outgoingMap.get(node.id) ?? []).length === 0)
    .map((node) => ({
      nodeId: node.id,
      label: node.data.label,
      value: (nodeOutputs.get(node.id) ?? [])[0] ?? 0
    }));

  return { steps, outputValues, errors };
};
