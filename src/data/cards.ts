import type { CardAnimationMeta, CardDef, CardInstance, Rarity } from "../game/types";

let cardInstanceSeq = 0;

const assetByCardId: Record<string, string> = {
  "pommel-strike": "card-pommel-hit-01.webp",
  "shrug-it-off": "card-shrug-armor-01.webp",
  "iron-wave": "card-iron-defense-01.webp",
  "heavy-blade": "card-quick-stab-01.webp",
  "quick-slash": "card-quick-stab-01.webp",
  "twin-strike": "card-flurry-01.webp",
  guard: "card-perfect-guard-01.webp",
  "seeing-red": "card-bloodletting-01.webp",
  "weakening-shout": "card-weak-mist-01.webp",
  warcry: "card-war-cry-01.webp",
  "spot-weakness": "card-vulnerable-mark-01.webp",
  combust: "card-burning-card-01.webp",
  "echo-stance": "card-dark-embrace-01.webp"
};

const animationByCardId: Record<string, CardAnimationMeta> = {
  strike: { playerAction: "attack", fxKey: "blade-straight", targetMotion: "single", impactClass: "impact-slash", shortLabel: "直斩" },
  defend: { playerAction: "block", fxKey: "guard-basic", targetMotion: "self", impactClass: "impact-guard", shortLabel: "架盾" },
  bash: { playerAction: "attack", fxKey: "blade-crush-vulnerable", targetMotion: "single", impactClass: "impact-heavy-debuff", shortLabel: "破甲" },
  "pommel-strike": { playerAction: "attack", fxKey: "pommel-spark-draw", targetMotion: "single", impactClass: "impact-pommel", shortLabel: "柄击" },
  "shrug-it-off": { playerAction: "block", fxKey: "guard-draw-ripple", targetMotion: "self", impactClass: "impact-guard-draw", shortLabel: "稳守" },
  cleave: { playerAction: "attack", fxKey: "blade-wide-arc", targetMotion: "all", impactClass: "impact-cleave", shortLabel: "横扫" },
  anger: { playerAction: "attack", fxKey: "rage-quick-cut", targetMotion: "single", impactClass: "impact-rage", shortLabel: "怒斩" },
  "iron-wave": { playerAction: "attack", fxKey: "iron-wave-guard-cut", targetMotion: "single", impactClass: "impact-hybrid-guard", shortLabel: "攻守" },
  "heavy-blade": { playerAction: "attack", fxKey: "heavy-overhead", targetMotion: "single", impactClass: "impact-heavy", shortLabel: "重劈" },
  "quick-slash": { playerAction: "attack", fxKey: "quick-slash-draw", targetMotion: "single", impactClass: "impact-fast", shortLabel: "快斩" },
  "twin-strike": { playerAction: "attack", fxKey: "twin-hit-cross", targetMotion: "multi", impactClass: "impact-double", shortLabel: "双击" },
  guard: { playerAction: "block", fxKey: "guard-stance", targetMotion: "self", impactClass: "impact-guard-stance", shortLabel: "守势" },
  "battle-trance": { playerAction: "skill", fxKey: "card-ring-draw", targetMotion: "self", impactClass: "impact-draw", shortLabel: "专注" },
  "seeing-red": { playerAction: "skill", fxKey: "ember-energy-burst", targetMotion: "self", impactClass: "impact-energy", shortLabel: "燃能" },
  "weakening-shout": { playerAction: "skill", fxKey: "shout-weak-wave", targetMotion: "all", impactClass: "impact-weak", shortLabel: "削弱" },
  warcry: { playerAction: "block", fxKey: "warcry-draw-guard", targetMotion: "self", impactClass: "impact-guard-draw", shortLabel: "战吼" },
  "flame-barrier": { playerAction: "block", fxKey: "flame-wall-guard", targetMotion: "self", impactClass: "impact-flame-guard", shortLabel: "火墙" },
  "spot-weakness": { playerAction: "skill", fxKey: "strength-mark", targetMotion: "buff", impactClass: "impact-strength", shortLabel: "蓄力" },
  uppercut: { playerAction: "attack", fxKey: "uppercut-debuff-smash", targetMotion: "single", impactClass: "impact-uppercut", shortLabel: "重拳" },
  "second-wind": { playerAction: "block", fxKey: "ash-armor-exhaust", targetMotion: "self", impactClass: "impact-exhaust-guard", shortLabel: "重整" },
  combust: { playerAction: "skill", fxKey: "power-combust-aura", targetMotion: "buff", impactClass: "impact-power", shortLabel: "燃烧" },
  footwork: { playerAction: "skill", fxKey: "power-footwork-step", targetMotion: "buff", impactClass: "impact-dexterity", shortLabel: "步法" },
  impervious: { playerAction: "block", fxKey: "impervious-bastion", targetMotion: "self", impactClass: "impact-bastion", shortLabel: "壁垒" },
  bludgeon: { playerAction: "attack", fxKey: "bludgeon-slam", targetMotion: "single", impactClass: "impact-bludgeon", shortLabel: "痛击" },
  "demon-form": { playerAction: "skill", fxKey: "power-demon-form", targetMotion: "buff", impactClass: "impact-demon", shortLabel: "恶魔" },
  "echo-stance": { playerAction: "skill", fxKey: "power-echo-stance", targetMotion: "buff", impactClass: "impact-echo", shortLabel: "回响" }
};

const card = (
  id: string,
  name: string,
  cost: number,
  type: CardDef["type"],
  rarity: Rarity,
  target: CardDef["target"],
  description: string,
  upgradedDescription: string,
  effects: CardDef["effects"],
  upgradedEffects: CardDef["upgradedEffects"]
): CardDef => ({
  id,
  name,
  cost,
  type,
  rarity,
  target,
  description,
  upgradedDescription,
  damage: effects.find((effect) => effect.kind === "damage")?.amount,
  block: effects.find((effect) => effect.kind === "block")?.amount,
  effects,
  upgradedEffects,
  assetPath: `/assets/cards/${assetByCardId[id] ?? `card-${id}-01.webp`}`,
  animation: animationByCardId[id]
});

export const cards: CardDef[] = [
  card("strike", "打击", 1, "attack", "common", "enemy", "造成 6 点伤害。", "造成 9 点伤害。", [{ kind: "damage", amount: 6, target: "enemy" }], [{ kind: "damage", amount: 9, target: "enemy" }]),
  card("defend", "防御", 1, "skill", "common", "self", "获得 5 点格挡。", "获得 8 点格挡。", [{ kind: "block", amount: 5 }], [{ kind: "block", amount: 8 }]),
  card("bash", "猛击", 2, "attack", "common", "enemy", "造成 8 点伤害，给予 2 层易伤。", "造成 10 点伤害，给予 3 层易伤。", [{ kind: "damage", amount: 8, target: "enemy" }, { kind: "status", status: "vulnerable", amount: 2, target: "enemy" }], [{ kind: "damage", amount: 10, target: "enemy" }, { kind: "status", status: "vulnerable", amount: 3, target: "enemy" }]),
  card("pommel-strike", "剑柄打击", 1, "attack", "common", "enemy", "造成 8 点伤害，抽 1 张牌。", "造成 10 点伤害，抽 1 张牌。", [{ kind: "damage", amount: 8, target: "enemy" }, { kind: "draw", amount: 1 }], [{ kind: "damage", amount: 10, target: "enemy" }, { kind: "draw", amount: 1 }]),
  card("shrug-it-off", "耸肩无视", 1, "skill", "common", "self", "获得 8 点格挡，抽 1 张牌。", "获得 11 点格挡，抽 1 张牌。", [{ kind: "block", amount: 8 }, { kind: "draw", amount: 1 }], [{ kind: "block", amount: 11 }, { kind: "draw", amount: 1 }]),
  card("cleave", "顺劈", 1, "attack", "common", "all_enemies", "对所有敌人造成 8 点伤害。", "对所有敌人造成 11 点伤害。", [{ kind: "damage", amount: 8, target: "all_enemies" }], [{ kind: "damage", amount: 11, target: "all_enemies" }]),
  card("anger", "愤怒", 0, "attack", "common", "enemy", "造成 6 点伤害。", "造成 8 点伤害。", [{ kind: "damage", amount: 6, target: "enemy" }], [{ kind: "damage", amount: 8, target: "enemy" }]),
  card("iron-wave", "铁斩波", 1, "attack", "common", "enemy", "造成 5 点伤害，获得 5 点格挡。", "造成 7 点伤害，获得 7 点格挡。", [{ kind: "damage", amount: 5, target: "enemy" }, { kind: "block", amount: 5 }], [{ kind: "damage", amount: 7, target: "enemy" }, { kind: "block", amount: 7 }]),
  card("heavy-blade", "重刃", 2, "attack", "common", "enemy", "造成 14 点伤害。", "造成 18 点伤害。", [{ kind: "damage", amount: 14, target: "enemy" }], [{ kind: "damage", amount: 18, target: "enemy" }]),
  card("quick-slash", "迅捷斩", 1, "attack", "common", "enemy", "造成 7 点伤害，抽 1 张牌。", "造成 10 点伤害，抽 1 张牌。", [{ kind: "damage", amount: 7, target: "enemy" }, { kind: "draw", amount: 1 }], [{ kind: "damage", amount: 10, target: "enemy" }, { kind: "draw", amount: 1 }]),
  card("twin-strike", "双重打击", 1, "attack", "common", "enemy", "造成 5 点伤害两次。", "造成 7 点伤害两次。", [{ kind: "damage", amount: 5, target: "enemy" }, { kind: "damage", amount: 5, target: "enemy" }], [{ kind: "damage", amount: 7, target: "enemy" }, { kind: "damage", amount: 7, target: "enemy" }]),
  card("guard", "架势", 1, "skill", "common", "self", "获得 7 点格挡。", "获得 10 点格挡。", [{ kind: "block", amount: 7 }], [{ kind: "block", amount: 10 }]),
  card("battle-trance", "战斗专注", 0, "skill", "common", "self", "抽 2 张牌。", "抽 3 张牌。", [{ kind: "draw", amount: 2 }], [{ kind: "draw", amount: 3 }]),
  card("seeing-red", "燃烧之血", 0, "skill", "common", "self", "获得 2 点能量，消耗。", "获得 3 点能量，消耗。", [{ kind: "energy", amount: 2 }, { kind: "exhaust_self" }], [{ kind: "energy", amount: 3 }, { kind: "exhaust_self" }]),
  card("weakening-shout", "削弱怒吼", 1, "skill", "common", "all_enemies", "给予所有敌人 2 层虚弱。", "给予所有敌人 3 层虚弱。", [{ kind: "status", status: "weak", amount: 2, target: "enemy" }], [{ kind: "status", status: "weak", amount: 3, target: "enemy" }]),
  card("warcry", "战吼", 0, "skill", "common", "self", "抽 1 张牌，获得 3 格挡。", "抽 2 张牌，获得 4 格挡。", [{ kind: "draw", amount: 1 }, { kind: "block", amount: 3 }], [{ kind: "draw", amount: 2 }, { kind: "block", amount: 4 }]),
  card("flame-barrier", "火焰屏障", 2, "skill", "uncommon", "self", "获得 14 点格挡。", "获得 18 点格挡。", [{ kind: "block", amount: 14 }], [{ kind: "block", amount: 18 }]),
  card("spot-weakness", "观察弱点", 1, "skill", "uncommon", "self", "获得 3 点力量。", "获得 4 点力量。", [{ kind: "buff", status: "strength", amount: 3 }], [{ kind: "buff", status: "strength", amount: 4 }]),
  card("uppercut", "上勾拳", 2, "attack", "uncommon", "enemy", "造成 13 点伤害，给予 1 易伤和虚弱。", "造成 17 点伤害，给予 2 易伤和虚弱。", [{ kind: "damage", amount: 13, target: "enemy" }, { kind: "status", status: "vulnerable", amount: 1, target: "enemy" }, { kind: "status", status: "weak", amount: 1, target: "enemy" }], [{ kind: "damage", amount: 17, target: "enemy" }, { kind: "status", status: "vulnerable", amount: 2, target: "enemy" }, { kind: "status", status: "weak", amount: 2, target: "enemy" }]),
  card("second-wind", "重整旗鼓", 1, "skill", "uncommon", "self", "获得 12 点格挡，消耗。", "获得 16 点格挡，消耗。", [{ kind: "block", amount: 12 }, { kind: "exhaust_self" }], [{ kind: "block", amount: 16 }, { kind: "exhaust_self" }]),
  card("combust", "燃烧", 1, "power", "uncommon", "self", "获得 2 点力量。", "获得 3 点力量。", [{ kind: "buff", status: "strength", amount: 2 }], [{ kind: "buff", status: "strength", amount: 3 }]),
  card("footwork", "步法", 1, "power", "uncommon", "self", "获得 2 点敏捷。", "获得 3 点敏捷。", [{ kind: "buff", status: "dexterity", amount: 2 }], [{ kind: "buff", status: "dexterity", amount: 3 }]),
  card("impervious", "壁垒", 2, "skill", "rare", "self", "获得 30 点格挡，消耗。", "获得 40 点格挡，消耗。", [{ kind: "block", amount: 30 }, { kind: "exhaust_self" }], [{ kind: "block", amount: 40 }, { kind: "exhaust_self" }]),
  card("bludgeon", "痛击", 3, "attack", "rare", "enemy", "造成 32 点伤害。", "造成 42 点伤害。", [{ kind: "damage", amount: 32, target: "enemy" }], [{ kind: "damage", amount: 42, target: "enemy" }]),
  card("demon-form", "恶魔形态", 3, "power", "rare", "self", "获得 4 点力量。", "获得 6 点力量。", [{ kind: "buff", status: "strength", amount: 4 }], [{ kind: "buff", status: "strength", amount: 6 }]),
  card("echo-stance", "回响姿态", 2, "power", "rare", "self", "获得 2 力量和 2 敏捷。", "获得 3 力量和 3 敏捷。", [{ kind: "buff", status: "strength", amount: 2 }, { kind: "buff", status: "dexterity", amount: 2 }], [{ kind: "buff", status: "strength", amount: 3 }, { kind: "buff", status: "dexterity", amount: 3 }])
];

export const cardsById = Object.fromEntries(cards.map((item) => [item.id, item])) as Record<string, CardDef>;
export const rewardCardIds = cards.filter((item) => !["strike", "defend", "bash"].includes(item.id)).map((item) => item.id);

export function createCardInstance(cardId: string, upgraded = false): CardInstance {
  if (!cardsById[cardId]) throw new Error(`Unknown card id: ${cardId}`);
  cardInstanceSeq += 1;
  return { uuid: `${cardId}-${Date.now().toString(36)}-${cardInstanceSeq}`, cardId, upgraded };
}

export function createStarterDeck(): CardInstance[] {
  return [
    ...Array.from({ length: 5 }, () => createCardInstance("strike")),
    ...Array.from({ length: 4 }, () => createCardInstance("defend")),
    createCardInstance("bash")
  ];
}

export function getCardEffects(instance: CardInstance): CardDef["effects"] {
  const def = cardsById[instance.cardId];
  return instance.upgraded ? def.upgradedEffects : def.effects;
}

export function getCardAnimation(instance: CardInstance): CardAnimationMeta {
  return cardsById[instance.cardId].animation;
}
