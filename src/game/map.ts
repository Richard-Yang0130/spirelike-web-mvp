import type { MapGraph, MapNode, NodeType } from "./types";
import { randomInt } from "../lib/rng";

const mixedTypes: NodeType[] = [
  "combat",
  "combat",
  "combat",
  "combat",
  "event",
  "event",
  "elite",
  "shop",
  "rest",
  "chest"
];

function createFloorTypes(floor: number, count: number, state: number): [NodeType[], number] {
  if (floor === 1) return [Array.from({ length: count }, () => "combat"), state];
  if (floor === 11) return [Array.from({ length: count }, () => "rest"), state];
  if (floor === 12) return [["boss"], state];
  let next = state;
  const result: NodeType[] = [];
  for (let index = 0; index < count; index += 1) {
    const [typeIndex, afterType] = randomInt(next, 0, mixedTypes.length - 1);
    next = afterType;
    result.push(mixedTypes[typeIndex]);
  }
  if (floor === 6 && !result.includes("rest")) result[0] = "rest";
  return [result, next];
}

export function generateMap(seed: number): MapGraph {
  let state = seed;
  const floors: MapGraph["floors"] = [];
  const nodesById: Record<string, MapNode> = {};

  for (let floor = 1; floor <= 12; floor += 1) {
    const [count, afterCount] = floor === 12 ? [1, state] : randomInt(state, 3, 5);
    state = afterCount;
    const [types, afterTypes] = createFloorTypes(floor, count, state);
    state = afterTypes;
    const nodes = types.map((type, index) => {
      const node: MapNode = {
        id: `f${floor}-n${index}`,
        floor,
        index,
        type,
        nextNodeIds: []
      };
      nodesById[node.id] = node;
      return node;
    });
    floors.push({ floor, nodes });
  }

  for (let floorIndex = 0; floorIndex < floors.length - 1; floorIndex += 1) {
    const current = floors[floorIndex].nodes;
    const nextFloor = floors[floorIndex + 1].nodes;
    current.forEach((node, nodeIndex) => {
      const connections = new Set<string>();
      connections.add(nextFloor[Math.min(nodeIndex, nextFloor.length - 1)].id);
      const [extraCount, afterExtra] = randomInt(state, 0, 2);
      state = afterExtra;
      for (let extra = 0; extra < extraCount; extra += 1) {
        const [nextIndex, afterNext] = randomInt(state, 0, nextFloor.length - 1);
        state = afterNext;
        connections.add(nextFloor[nextIndex].id);
      }
      node.nextNodeIds = [...connections];
    });
  }

  return { seed, floors, nodesById };
}

export function getReachableNodes(map: MapGraph, currentNodeId: string | null): MapNode[] {
  if (!currentNodeId) return map.floors[0].nodes;
  const current = map.nodesById[currentNodeId];
  if (!current) return [];
  return current.nextNodeIds.map((id) => map.nodesById[id]).filter(Boolean);
}
