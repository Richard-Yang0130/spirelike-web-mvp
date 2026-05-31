export type CardType = "attack" | "skill" | "power" | "status" | "curse";
export type CardRarity = "common" | "uncommon" | "rare" | "starter";
export type ButtonVariant = "primary" | "combat" | "safe" | "secondary" | "ghost" | "danger";
export type PlayerAction = "idle" | "attack" | "block" | "skill" | "hurt" | "victory";
export type EnemyAction = "idle" | "attack" | "hurt";
export type CardFxMotion = "single" | "multi" | "all" | "self" | "enemy" | "buff" | "debuff";
export type CardFxTone =
  | "slash"
  | "heavy"
  | "guard"
  | "warcry"
  | "draw"
  | "energy"
  | "weak"
  | "vulnerable"
  | "flame"
  | "power"
  | "exhaust"
  | "multi"
  | "skill";

export type UiCardAnimation = {
  cardId?: string;
  cardUuid?: string;
  eventId?: number;
  playerAction?: PlayerAction;
  fxKey?: string;
  targetMotion?: CardFxMotion;
  impactClass?: string;
  shortLabel?: string;
  triggeredSkillFx?: "burst-attack" | "guard-counter" | "flow-engine";
  texture?: string;
  label?: string;
};

export type UiCardFx = UiCardAnimation & {
  id?: string;
  targetEnemyId?: string;
  tone?: CardFxTone;
};

export type UiCard = {
  id: string;
  name: string;
  cost: number | "X";
  type: CardType;
  target?: "enemy" | "self" | "all_enemies" | "none";
  rarity: CardRarity;
  description: string;
  art: string;
  upgraded?: boolean;
  playable?: boolean;
  selected?: boolean;
  animating?: "dealing" | "played" | "rewardFlip";
  fxKey?: string;
  actionLabel?: string;
  actionTexture?: string;
  price?: number;
};

export type UiRelic = {
  id: string;
  name: string;
  description?: string;
  image: string;
};

export type UiEnemy = {
  id: string;
  name: string;
  image: string;
  hp: number;
  maxHp: number;
  block?: number;
  intent?: {
    type: "attack" | "multiAttack" | "block" | "buff" | "debuff" | "unknown";
    label: string;
  };
  kind?: "normal" | "elite" | "boss";
  damaged?: boolean;
  action?: EnemyAction;
};

export type UiPlayer = {
  name: string;
  image: string;
  hp: number;
  maxHp: number;
  block?: number;
  energy: number;
  maxEnergy: number;
};

export type MapNodeType = "combat" | "elite" | "event" | "shop" | "rest" | "chest" | "boss";
export type MapNodeState = "available" | "completed" | "current" | "locked";

export type UiMapNode = {
  id: string;
  type: MapNodeType;
  state: MapNodeState;
  x: number;
  y: number;
};

export type UiInitialSkill = {
  id: string;
  name: string;
  description: string;
  trigger: string;
  visualAction: string;
  image: string;
  action: PlayerAction;
};
