import type { EnemyDef, EnemyGroup } from "../game/types";

export const enemies: Record<string, EnemyDef> = {
  cultist: { id: "cultist", name: "祭仪信徒", maxHp: 45, assetPath: "/assets/enemies/enemy-normal-cultist-01.png", moves: [{ id: "slash", intent: "attack", label: "攻击 6", baseDamage: 6, hits: 1, effects: [{ kind: "damage", amount: 6, target: "enemy" }], weight: 3 }, { id: "chant", intent: "buff", label: "强化", effects: [{ kind: "buff", status: "strength", amount: 2 }], weight: 1, cooldown: 1 }] },
  slime: { id: "slime", name: "黏液怪", maxHp: 32, assetPath: "/assets/enemies/enemy-normal-slime-01.png", moves: [{ id: "tackle", intent: "attack", label: "攻击 8", baseDamage: 8, hits: 1, effects: [{ kind: "damage", amount: 8, target: "enemy" }], weight: 3 }, { id: "lick", intent: "attack_debuff", label: "攻击+减益 5", baseDamage: 5, hits: 1, effects: [{ kind: "damage", amount: 5, target: "enemy" }, { kind: "status", status: "weak", amount: 1, target: "player" }], weight: 2 }] },
  guard: { id: "guard", name: "塔盾卫", maxHp: 38, assetPath: "/assets/enemies/enemy-normal-sentry-01.png", moves: [{ id: "shield", intent: "block", label: "防御 10", block: 10, effects: [{ kind: "block", amount: 10 }], weight: 2 }, { id: "bash", intent: "attack", label: "攻击 9", baseDamage: 9, hits: 1, effects: [{ kind: "damage", amount: 9, target: "enemy" }], weight: 3 }] },
  bat: { id: "bat", name: "尖塔蝠群", maxHp: 24, assetPath: "/assets/enemies/enemy-normal-bat-01.png", moves: [{ id: "bite", intent: "attack", label: "攻击 4x2", baseDamage: 4, hits: 2, effects: [{ kind: "damage", amount: 4, target: "enemy" }, { kind: "damage", amount: 4, target: "enemy" }], weight: 3 }, { id: "shriek", intent: "attack_debuff", label: "减益", effects: [{ kind: "status", status: "vulnerable", amount: 1, target: "player" }], weight: 1 }] },
  brute: { id: "brute", name: "裂甲兽", maxHp: 52, assetPath: "/assets/enemies/enemy-normal-fungal-01.png", moves: [{ id: "smash", intent: "attack", label: "攻击 12", baseDamage: 12, hits: 1, effects: [{ kind: "damage", amount: 12, target: "enemy" }], weight: 3, maxConsecutive: 2 }, { id: "harden", intent: "block", label: "防御 8", block: 8, effects: [{ kind: "block", amount: 8 }], weight: 1 }] },
  thief: { id: "thief", name: "灰巷盗贼", maxHp: 30, assetPath: "/assets/enemies/enemy-normal-sentry-01.png", moves: [{ id: "stab", intent: "attack", label: "攻击 7", baseDamage: 7, hits: 1, effects: [{ kind: "damage", amount: 7, target: "enemy" }], weight: 4 }, { id: "smoke", intent: "unknown", label: "未知", effects: [], weight: 1, cooldown: 1 }] },
  eliteGuard: { id: "eliteGuard", name: "精英守卫", maxHp: 82, assetPath: "/assets/enemies/enemy-elite-guard-01.png", moves: [{ id: "cleave", intent: "attack", label: "攻击 18", baseDamage: 18, hits: 1, effects: [{ kind: "damage", amount: 18, target: "enemy" }], weight: 3 }, { id: "fortify", intent: "block", label: "防御 16", block: 16, effects: [{ kind: "block", amount: 16 }], weight: 2 }] },
  eliteAcolyte: { id: "eliteAcolyte", name: "血誓祭司", maxHp: 76, assetPath: "/assets/enemies/enemy-elite-champion-01.png", moves: [{ id: "drain", intent: "attack_debuff", label: "攻击+减益 14", baseDamage: 14, hits: 1, effects: [{ kind: "damage", amount: 14, target: "enemy" }, { kind: "status", status: "vulnerable", amount: 2, target: "player" }], weight: 3 }, { id: "ascend", intent: "buff", label: "强化", effects: [{ kind: "buff", status: "strength", amount: 3 }], weight: 1 }] },
  spireEye: { id: "spireEye", name: "尖塔之眼", maxHp: 180, assetPath: "/assets/enemies/enemy-boss-spire-eye-01.png", moves: [{ id: "ray", intent: "attack", label: "攻击 12x2", baseDamage: 12, hits: 2, effects: [{ kind: "damage", amount: 12, target: "enemy" }, { kind: "damage", amount: 12, target: "enemy" }], weight: 3 }, { id: "gaze", intent: "attack_debuff", label: "攻击+减益 16", baseDamage: 16, hits: 1, effects: [{ kind: "damage", amount: 16, target: "enemy" }, { kind: "status", status: "weak", amount: 2, target: "player" }], weight: 2 }, { id: "awaken", intent: "buff", label: "强化", effects: [{ kind: "buff", status: "strength", amount: 4 }], weight: 1, cooldown: 2 }] }
};

export const enemyGroups: { normal: EnemyGroup[]; elite: EnemyGroup[]; boss: EnemyGroup[] } = {
  normal: [
    { id: "normal-cultist", type: "normal", name: "信徒", enemyIds: ["cultist"] },
    { id: "normal-slime", type: "normal", name: "黏液", enemyIds: ["slime"] },
    { id: "normal-guard", type: "normal", name: "守卫", enemyIds: ["guard"] },
    { id: "normal-bats", type: "normal", name: "蝠群", enemyIds: ["bat", "bat"] },
    { id: "normal-brute", type: "normal", name: "裂甲兽", enemyIds: ["brute"] },
    { id: "normal-thieves", type: "normal", name: "灰巷盗贼", enemyIds: ["thief", "slime"] }
  ],
  elite: [
    { id: "elite-guard", type: "elite", name: "精英守卫", enemyIds: ["eliteGuard"] },
    { id: "elite-acolyte", type: "elite", name: "血誓祭司", enemyIds: ["eliteAcolyte"] }
  ],
  boss: [{ id: "boss-spire-eye", type: "boss", name: "尖塔之眼", enemyIds: ["spireEye"] }]
};
