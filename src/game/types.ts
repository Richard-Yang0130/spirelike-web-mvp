export type RunStatus =
  | "boot"
  | "title"
  | "map"
  | "combat"
  | "reward"
  | "shop"
  | "rest"
  | "event"
  | "chest"
  | "victory"
  | "defeat";

export type NodeType = "combat" | "elite" | "event" | "shop" | "rest" | "chest" | "boss";
export type CardType = "attack" | "skill" | "power" | "status" | "curse";
export type Rarity = "common" | "uncommon" | "rare";
export type TargetType = "enemy" | "self" | "all_enemies" | "none";
export type IntentType = "attack" | "block" | "attack_debuff" | "buff" | "unknown";
export type StarterSkillId = "burst-attack" | "guard-counter" | "flow-engine";
export type CardAnimationMeta = {
  playerAction: "idle" | "attack" | "block" | "skill" | "hurt" | "victory";
  fxKey: string;
  targetMotion: "single" | "multi" | "all" | "self" | "enemy" | "buff" | "debuff";
  impactClass: string;
  shortLabel: string;
};

export type EffectDef =
  | { kind: "damage"; amount: number; target: "enemy" | "all_enemies" }
  | { kind: "block"; amount: number }
  | { kind: "draw"; amount: number }
  | { kind: "energy"; amount: number }
  | { kind: "status"; status: "vulnerable" | "weak"; amount: number; target: "enemy" | "player" }
  | { kind: "buff"; status: "strength" | "dexterity"; amount: number }
  | { kind: "exhaust_self" };

export type CardDef = {
  id: string;
  name: string;
  cost: number;
  type: CardType;
  rarity: Rarity;
  target: TargetType;
  description: string;
  upgradedDescription: string;
  damage?: number;
  block?: number;
  effects: EffectDef[];
  upgradedEffects: EffectDef[];
  assetPath: string;
  animation: CardAnimationMeta;
};

export type CardInstance = {
  uuid: string;
  cardId: string;
  upgraded: boolean;
};

export type EnemyMove = {
  id: string;
  intent: IntentType;
  label: string;
  baseDamage?: number;
  hits?: number;
  block?: number;
  effects: EffectDef[];
  weight: number;
  cooldown?: number;
  maxConsecutive?: number;
};

export type EnemyDef = {
  id: string;
  name: string;
  maxHp: number;
  moves: EnemyMove[];
  assetPath: string;
};

export type EnemyGroup = {
  id: string;
  type: "normal" | "elite" | "boss";
  name: string;
  enemyIds: string[];
};

export type CombatEnemy = {
  id: string;
  defId: string;
  name: string;
  hp: number;
  maxHp: number;
  block: number;
  statuses: Record<string, number>;
  intent: EnemyMove | null;
  lastMoveId: string | null;
  consecutiveMoveCount: number;
  cooldowns: Record<string, number>;
};

export type CombatState = {
  id: string;
  turn: number;
  phase:
    | "init"
    | "player_turn_start"
    | "player_input"
    | "resolving_actions"
    | "player_turn_end"
    | "enemy_turn"
    | "checking_end"
    | "finished";
  player: { hp: number; maxHp: number; statuses: Record<string, number> };
  enemies: CombatEnemy[];
  energy: number;
  maxEnergy: number;
  block: number;
  drawPile: CardInstance[];
  hand: CardInstance[];
  discardPile: CardInstance[];
  exhaustPile: CardInstance[];
  actionQueue: string[];
  log: string[];
  initialSkillId: StarterSkillId | null;
  skillState: {
    burstAttackCount: number;
    burstReady: boolean;
    guardCounterTriggered: boolean;
    flowSawSkill: boolean;
    flowTriggered: boolean;
  };
  seed: number;
  rngState: number;
  result: "victory" | "defeat" | null;
};

export type MapNode = {
  id: string;
  floor: number;
  index: number;
  type: NodeType;
  nextNodeIds: string[];
};

export type MapGraph = {
  seed: number;
  floors: Array<{ floor: number; nodes: MapNode[] }>;
  nodesById: Record<string, MapNode>;
};

export type RelicDef = {
  id: string;
  name: string;
  rarity: Rarity;
  description: string;
  hook: "combat_start" | "turn_start" | "after_card_play" | "after_damage_taken" | "combat_victory" | "on_pickup";
  assetPath: string;
};

export type RewardState = {
  sourceNodeId: string;
  gold: number;
  cardChoices: CardInstance[];
  relicId: string | null;
  claimedGold: boolean;
  claimedRelic: boolean;
  pickedCard: boolean;
};

export type RunState = {
  seed: number;
  floor: number;
  hp: number;
  maxHp: number;
  gold: number;
  map: MapGraph;
  currentNodeId: string | null;
  availableNodeIds: string[];
  masterDeck: CardInstance[];
  relics: string[];
  initialSkillId: StarterSkillId | null;
  flags: Record<string, unknown>;
  status: RunStatus;
  pendingReward: RewardState | null;
  combat: CombatState | null;
  startedAt: number;
  visitedNodeIds: string[];
};
