import { createCardInstance, createStarterDeck, rewardCardIds } from "../data/cards";
import { enemyGroups } from "../data/enemies";
import { relics } from "../data/relics";
import { randomInt } from "../lib/rng";
import { createCombat } from "./combat";
import { generateMap, getReachableNodes } from "./map";
import type { CardInstance, EnemyGroup, NodeType, RunState, RunStatus, StarterSkillId } from "./types";

const RUN_SAVE_KEY = "spirelike.run.v1";
const SETTINGS_SAVE_KEY = "spirelike.settings.v1";

export function createNewRun(seed = Date.now(), initialSkillId: StarterSkillId | null = null): RunState {
  const map = generateMap(seed);
  return {
    seed,
    floor: 0,
    hp: 70,
    maxHp: 70,
    gold: 99,
    map,
    currentNodeId: null,
    availableNodeIds: getReachableNodes(map, null).map((node) => node.id),
    masterDeck: createStarterDeck(),
    relics: [],
    initialSkillId,
    flags: {},
    status: "map",
    pendingReward: null,
    combat: null,
    startedAt: Date.now(),
    visitedNodeIds: []
  };
}

export function transition(run: RunState, next: RunStatus): RunState {
  const allowed: Record<RunStatus, RunStatus[]> = {
    boot: ["title", "map"],
    title: ["map"],
    map: ["combat", "shop", "rest", "event", "chest", "victory"],
    combat: ["reward", "defeat", "victory"],
    reward: ["map", "victory"],
    shop: ["map"],
    rest: ["map"],
    event: ["map", "combat", "reward"],
    chest: ["map"],
    victory: ["title", "map"],
    defeat: ["title", "map"]
  };
  if (!allowed[run.status]?.includes(next)) {
    console.warn(`Illegal transition: ${run.status} -> ${next}`);
    return run;
  }
  return { ...run, status: next };
}

export function chooseMapNode(run: RunState, nodeId: string): RunState {
  if (run.status !== "map" || !run.availableNodeIds.includes(nodeId)) {
    console.warn(`Illegal map node selection: ${nodeId}`);
    return run;
  }
  const node = run.map.nodesById[nodeId];
  const base = {
    ...run,
    currentNodeId: nodeId,
    floor: node.floor,
    visitedNodeIds: [...run.visitedNodeIds, nodeId],
    availableNodeIds: []
  };
  if (node.type === "combat" || node.type === "elite" || node.type === "boss") {
    const group = pickEnemyGroup(run.seed + node.floor + node.index, node.type);
    return {
      ...base,
      status: "combat",
      combat: createCombat({ deck: run.masterDeck, enemyGroup: group, seed: run.seed + node.floor * 17 + node.index, hp: run.hp, maxHp: run.maxHp, initialSkillId: run.initialSkillId })
    };
  }
  if (node.type === "shop") return { ...base, status: "shop" };
  if (node.type === "rest") return { ...base, status: "rest" };
  if (node.type === "event") return { ...base, status: "event" };
  if (node.type === "chest") return { ...base, status: "chest" };
  return base;
}

function pickEnemyGroup(seed: number, nodeType: NodeType): EnemyGroup {
  const groups = nodeType === "boss" ? enemyGroups.boss : nodeType === "elite" ? enemyGroups.elite : enemyGroups.normal;
  const [index] = randomInt(seed, 0, groups.length - 1);
  return groups[index];
}

export function completeCombat(run: RunState): RunState {
  if (run.status !== "combat" || !run.combat?.result) return run;
  if (run.combat.result === "defeat") return { ...run, status: "defeat", hp: 0 };
  const currentNode = run.currentNodeId ? run.map.nodesById[run.currentNodeId] : null;
  if (currentNode?.type === "boss") {
    return { ...run, status: "victory", hp: run.combat.player.hp, combat: null };
  }
  return {
    ...run,
    hp: run.combat.player.hp,
    combat: null,
    status: "reward",
    pendingReward: createReward(run, currentNode?.type === "elite")
  };
}

function createReward(run: RunState, elite = false) {
  const baseSeed = run.seed + run.floor * 101;
  const [goldRoll, afterGold] = randomInt(baseSeed, elite ? 25 : 10, elite ? 35 : 18);
  return {
    sourceNodeId: run.currentNodeId ?? "",
    gold: goldRoll,
    cardChoices: createRewardCards(afterGold),
    relicId: elite ? pickAvailableRelic(run, afterGold + 33) : null,
    claimedGold: false,
    claimedRelic: !elite,
    pickedCard: false
  };
}

function createRewardCards(seed: number): CardInstance[] {
  let state = seed;
  const selected = new Set<string>();
  while (selected.size < 3) {
    const [index, next] = randomInt(state, 0, rewardCardIds.length - 1);
    state = next;
    selected.add(rewardCardIds[index]);
  }
  return [...selected].map((id) => createCardInstance(id));
}

function pickAvailableRelic(run: RunState, seed: number): string | null {
  const pool = relics.filter((relic) => !run.relics.includes(relic.id));
  if (!pool.length) return null;
  const [index] = randomInt(seed, 0, pool.length - 1);
  return pool[index].id;
}

export function chooseRewardCard(run: RunState, cardUuid: string | null): RunState {
  if (run.status !== "reward" || !run.pendingReward) return run;
  const picked = cardUuid ? run.pendingReward.cardChoices.find((card) => card.uuid === cardUuid) : null;
  const nextDeck = picked ? [...run.masterDeck, picked] : run.masterDeck;
  const nextRelics = run.pendingReward.relicId && !run.relics.includes(run.pendingReward.relicId) ? [...run.relics, run.pendingReward.relicId] : run.relics;
  const availableNodeIds = getReachableNodes(run.map, run.currentNodeId).map((node) => node.id);
  return {
    ...run,
    gold: run.gold + (run.pendingReward.claimedGold ? 0 : run.pendingReward.gold),
    masterDeck: nextDeck,
    relics: nextRelics,
    pendingReward: null,
    status: "map",
    availableNodeIds
  };
}

export function leaveCurrentNode(run: RunState): RunState {
  if (!["shop", "rest", "event", "chest"].includes(run.status)) return run;
  let next = run;
  if (run.status === "rest") next = rest(run);
  if (run.status === "chest") next = openChest(run);
  return returnToMap(next);
}

export function returnToMap(run: RunState): RunState {
  return {
    ...run,
    status: "map",
    availableNodeIds: getReachableNodes(run.map, run.currentNodeId).map((node) => node.id)
  };
}

export function rest(run: RunState): RunState {
  const heal = Math.ceil(run.maxHp * 0.3);
  return { ...run, hp: Math.min(run.maxHp, run.hp + heal) };
}

export function upgradeCard(run: RunState, cardUuid: string): RunState {
  return {
    ...run,
    masterDeck: run.masterDeck.map((card) => (card.uuid === cardUuid ? { ...card, upgraded: true } : card))
  };
}

export function openChest(run: RunState): RunState {
  const relicId = getChestRelicId(run);
  return relicId ? { ...run, relics: [...run.relics, relicId] } : run;
}

export function getChestRelicId(run: RunState): string | null {
  return pickAvailableRelic(run, run.seed + run.floor * 71);
}

export function saveRun(run: RunState): void {
  localStorage.setItem(RUN_SAVE_KEY, JSON.stringify(run));
}

export function loadRun(): RunState | null {
  const raw = localStorage.getItem(RUN_SAVE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as RunState;
  } catch {
    return null;
  }
}

export function saveSettings(settings: { animationSpeed: "normal" | "fast"; debug: boolean }): void {
  localStorage.setItem(SETTINGS_SAVE_KEY, JSON.stringify(settings));
}
