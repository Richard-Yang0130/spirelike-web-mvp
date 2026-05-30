import type { RelicDef } from "../game/types";

const relicAssetById: Record<string, string> = {
  "old-coin": "relic-old-compass-01.png",
  "bronze-scale": "relic-tiny-shield-01.png",
  "sun-ember": "relic-ember-ring-01.png",
  "ink-quill": "relic-iron-feather-01.png",
  "sharp-whetstone": "relic-war-horn-01.png",
  "bone-charm": "relic-bone-dice-01.png",
  "green-idol": "relic-obsidian-idol-01.png",
  "tower-key": "relic-runic-key-01.png",
  "iron-root": "relic-brass-gear-01.png",
  "merchant-tag": "relic-hourglass-01.png",
  "paper-fang": "relic-thorn-crown-01.png"
};

export const relics: RelicDef[] = [
  ["blood-vial", "血瓶", "combat_victory", "战斗胜利后恢复 2 点生命。"],
  ["old-coin", "旧金币", "combat_victory", "战斗金币奖励 +25%。"],
  ["bronze-scale", "青铜鳞片", "combat_start", "每场战斗开始获得 6 格挡。"],
  ["sun-ember", "余烬石", "turn_start", "每场战斗第 1 回合获得 1 能量。"],
  ["ink-quill", "墨羽", "turn_start", "每场战斗第 1 回合多抽 1 张牌。"],
  ["sharp-whetstone", "磨刀石", "after_card_play", "每场战斗第一次攻击额外 +4 伤害。"],
  ["bone-charm", "骨护符", "after_damage_taken", "受到伤害后获得 3 格挡。"],
  ["green-idol", "幽绿雕像", "on_pickup", "拾取时获得 25 金币。"],
  ["tower-key", "塔钥", "combat_start", "Boss 战开始获得 2 力量。"],
  ["iron-root", "铁根", "turn_start", "每回合开始获得 1 格挡。"],
  ["merchant-tag", "商人牌", "on_pickup", "商店删牌价格降低到 50。"],
  ["paper-fang", "纸獠牙", "after_card_play", "对易伤敌人造成额外伤害。"]
].map(([id, name, hook, description]) => ({
  id,
  name,
  hook,
  description,
  rarity: id === "tower-key" || id === "paper-fang" ? "rare" : "common",
  assetPath: `/assets/relics/${relicAssetById[id] ?? `relic-${id}-01.png`}`
})) as RelicDef[];

export const relicsById = Object.fromEntries(relics.map((item) => [item.id, item])) as Record<string, RelicDef>;
