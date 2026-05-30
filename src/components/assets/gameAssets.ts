export const assetPath = (path: string) => `/assets/${path}`;

export const sceneAssets = {
  battle: assetPath("scenes/scene-battle-01.webp"),
  battleRuins: assetPath("scenes/scene-battle-ruins-01.webp"),
  map: assetPath("scenes/scene-map-01.webp"),
  shop: assetPath("scenes/scene-shop-01.webp"),
  rest: assetPath("scenes/scene-rest-01.webp"),
  event: assetPath("scenes/scene-event-01.webp"),
  gameOver: assetPath("scenes/scene-gameover-01.webp"),
  introSpire: assetPath("scenes/intro-spire-01.png"),
} as const;

export const characterAssets = {
  player: assetPath("characters/char-player-01.png"),
} as const;

export const playerActionAssets = {
  idle: assetPath("characters/actions/player-idle-sheet-01.png"),
  attack: assetPath("characters/actions/player-attack-sheet-01.png"),
  block: assetPath("characters/actions/player-block-sheet-01.png"),
  skill: assetPath("characters/actions/player-skill-sheet-01.png"),
  hurt: assetPath("characters/actions/player-hurt-sheet-01.png"),
  victory: assetPath("characters/actions/player-victory-sheet-01.png"),
} as const;

export const enemyAssets = {
  slime: assetPath("enemies/enemy-normal-slime-01.png"),
  cultist: assetPath("enemies/enemy-normal-cultist-01.png"),
  bat: assetPath("enemies/enemy-normal-bat-01.png"),
  sentry: assetPath("enemies/enemy-normal-sentry-01.png"),
  fungal: assetPath("enemies/enemy-normal-fungal-01.png"),
  eliteGuard: assetPath("enemies/enemy-elite-guard-01.png"),
  eliteChampion: assetPath("enemies/enemy-elite-champion-01.png"),
  bossSpireEye: assetPath("enemies/enemy-boss-spire-eye-01.png"),
} as const;

export const enemyActionAssets = {
  slime: {
    idle: assetPath("enemies/actions/enemy-slime-idle-sheet-01.png"),
    attack: assetPath("enemies/actions/enemy-slime-attack-sheet-01.png"),
    hurt: assetPath("enemies/actions/enemy-slime-hurt-sheet-01.png"),
  },
  cultist: {
    idle: assetPath("enemies/actions/enemy-cultist-idle-sheet-01.png"),
    attack: assetPath("enemies/actions/enemy-cultist-attack-sheet-01.png"),
    hurt: assetPath("enemies/actions/enemy-cultist-hurt-sheet-01.png"),
  },
  bat: {
    idle: assetPath("enemies/actions/enemy-bat-idle-sheet-01.png"),
    attack: assetPath("enemies/actions/enemy-bat-attack-sheet-01.png"),
    hurt: assetPath("enemies/actions/enemy-bat-hurt-sheet-01.png"),
  },
  sentry: {
    idle: assetPath("enemies/actions/enemy-sentry-idle-sheet-01.png"),
    attack: assetPath("enemies/actions/enemy-sentry-attack-sheet-01.png"),
    hurt: assetPath("enemies/actions/enemy-sentry-hurt-sheet-01.png"),
  },
  fungal: {
    idle: assetPath("enemies/actions/enemy-fungal-idle-sheet-01.png"),
    attack: assetPath("enemies/actions/enemy-fungal-attack-sheet-01.png"),
    hurt: assetPath("enemies/actions/enemy-fungal-hurt-sheet-01.png"),
  },
  eliteGuard: {
    idle: assetPath("enemies/actions/enemy-elite-guard-idle-sheet-01.png"),
    attack: assetPath("enemies/actions/enemy-elite-guard-attack-sheet-01.png"),
    hurt: assetPath("enemies/actions/enemy-elite-guard-hurt-sheet-01.png"),
  },
  eliteChampion: {
    idle: assetPath("enemies/actions/enemy-elite-champion-idle-sheet-01.png"),
    attack: assetPath("enemies/actions/enemy-elite-champion-attack-sheet-01.png"),
    hurt: assetPath("enemies/actions/enemy-elite-champion-hurt-sheet-01.png"),
  },
  bossSpireEye: {
    idle: assetPath("enemies/actions/enemy-boss-spire-eye-idle-sheet-01.png"),
    attack: assetPath("enemies/actions/enemy-boss-spire-eye-attack-sheet-01.png"),
    hurt: assetPath("enemies/actions/enemy-boss-spire-eye-hurt-sheet-01.png"),
  },
} as const;

export const enemyActionAssetByBaseImage = {
  [enemyAssets.slime]: enemyActionAssets.slime,
  [enemyAssets.cultist]: enemyActionAssets.cultist,
  [enemyAssets.bat]: enemyActionAssets.bat,
  [enemyAssets.sentry]: enemyActionAssets.sentry,
  [enemyAssets.fungal]: enemyActionAssets.fungal,
  [enemyAssets.eliteGuard]: enemyActionAssets.eliteGuard,
  [enemyAssets.eliteChampion]: enemyActionAssets.eliteChampion,
  [enemyAssets.bossSpireEye]: enemyActionAssets.bossSpireEye,
} as const;

export const itemAssets = {
  gold: assetPath("items/item-gold-01.png"),
  chest: assetPath("items/item-chest-01.png"),
} as const;

export const nodeAssets = {
  combat: assetPath("nodes/node-combat-01.png"),
  elite: assetPath("nodes/node-elite-01.png"),
  event: assetPath("nodes/node-event-01.png"),
  shop: assetPath("nodes/node-shop-01.png"),
  rest: assetPath("nodes/node-rest-01.png"),
  boss: assetPath("nodes/node-boss-01.png"),
  chest: itemAssets.chest,
} as const;

export const relicAssets = {
  bloodVial: assetPath("relics/relic-blood-vial-01.png"),
  brassGear: assetPath("relics/relic-brass-gear-01.png"),
  jadeSerpent: assetPath("relics/relic-jade-serpent-01.png"),
  blackCandle: assetPath("relics/relic-black-candle-01.png"),
  oldCompass: assetPath("relics/relic-old-compass-01.png"),
  boneDice: assetPath("relics/relic-bone-dice-01.png"),
  ironFeather: assetPath("relics/relic-iron-feather-01.png"),
  warHorn: assetPath("relics/relic-war-horn-01.png"),
  frozenTear: assetPath("relics/relic-frozen-tear-01.png"),
  thornCrown: assetPath("relics/relic-thorn-crown-01.png"),
  emberRing: assetPath("relics/relic-ember-ring-01.png"),
  hourglass: assetPath("relics/relic-hourglass-01.png"),
  ghostLantern: assetPath("relics/relic-ghost-lantern-01.png"),
  bronzeMask: assetPath("relics/relic-bronze-mask-01.png"),
  tinyShield: assetPath("relics/relic-tiny-shield-01.png"),
  runicKey: assetPath("relics/relic-runic-key-01.png"),
  obsidianIdol: assetPath("relics/relic-obsidian-idol-01.png"),
} as const;

export const cardArtAssets = {
  strike: assetPath("cards/card-strike-01.webp"),
  defend: assetPath("cards/card-defend-01.webp"),
  bash: assetPath("cards/card-bash-01.webp"),
  quickStab: assetPath("cards/card-quick-stab-01.webp"),
  cleave: assetPath("cards/card-cleave-01.webp"),
  flurry: assetPath("cards/card-flurry-01.webp"),
  ironDefense: assetPath("cards/card-iron-defense-01.webp"),
  battleTrance: assetPath("cards/card-battle-trance-01.webp"),
  adrenaline: assetPath("cards/card-adrenaline-01.webp"),
  vulnerableMark: assetPath("cards/card-vulnerable-mark-01.webp"),
  weakMist: assetPath("cards/card-weak-mist-01.webp"),
  warCry: assetPath("cards/card-war-cry-01.webp"),
  footwork: assetPath("cards/card-footwork-01.webp"),
  burningCard: assetPath("cards/card-burning-card-01.webp"),
  shockwave: assetPath("cards/card-shockwave-01.webp"),
  pommelHit: assetPath("cards/card-pommel-hit-01.webp"),
  shrugArmor: assetPath("cards/card-shrug-armor-01.webp"),
  perfectGuard: assetPath("cards/card-perfect-guard-01.webp"),
  anger: assetPath("cards/card-anger-01.webp"),
  thunderClap: assetPath("cards/card-thunder-clap-01.webp"),
  flameBarrier: assetPath("cards/card-flame-barrier-01.webp"),
  ghostArmor: assetPath("cards/card-ghost-armor-01.webp"),
  darkEmbrace: assetPath("cards/card-dark-embrace-01.webp"),
  demonForm: assetPath("cards/card-demon-form-01.webp"),
  piercingWail: assetPath("cards/card-piercing-wail-01.webp"),
  bloodletting: assetPath("cards/card-bloodletting-01.webp"),
  uppercut: assetPath("cards/card-uppercut-01.webp"),
  secondWind: assetPath("cards/card-second-wind-01.webp"),
  metallicize: assetPath("cards/card-metallicize-01.webp"),
  corruption: assetPath("cards/card-corruption-01.webp"),
} as const;

export const initialSkillAssets = {
  burstAttack: assetPath("skills/skill-burst-attack-01.png"),
  guardCounter: assetPath("skills/skill-guard-counter-01.png"),
  flowEngine: assetPath("skills/skill-flow-engine-01.png"),
} as const;

export const cardFxTextureAssets = {
  blade: cardArtAssets.strike,
  heavy: cardArtAssets.bash,
  guard: cardArtAssets.defend,
  warcry: cardArtAssets.warCry,
  draw: cardArtAssets.battleTrance,
  energy: cardArtAssets.adrenaline,
  weak: cardArtAssets.weakMist,
  vulnerable: cardArtAssets.vulnerableMark,
  flame: cardArtAssets.flameBarrier,
  power: cardArtAssets.demonForm,
  exhaust: cardArtAssets.burningCard,
  multi: cardArtAssets.flurry,
  skillBurst: initialSkillAssets.burstAttack,
  skillGuard: initialSkillAssets.guardCounter,
  skillFlow: initialSkillAssets.flowEngine,
} as const;

export const starterSkillPresets = [
  {
    id: "burst-attack",
    name: "猩红突袭",
    description: "第一回合打出 3 张攻击牌后，下一张攻击牌额外造成爆发伤害。",
    trigger: "每场战斗第一回合，累计打出 3 张攻击牌时触发。",
    visualAction: "角色前压挥剑，血红弧光从剑锋爆开。",
    image: initialSkillAssets.burstAttack,
    action: "attack",
  },
  {
    id: "guard-counter",
    name: "铁壁回击",
    description: "当回合格挡值首次达到 12 点时，对攻击意图最高的敌人反击。",
    trigger: "玩家回合内，格挡首次达到或超过 12 点时触发。",
    visualAction: "角色举盾蓄力，冷青护盾碎光反弹成剑痕。",
    image: initialSkillAssets.guardCounter,
    action: "block",
  },
  {
    id: "flow-engine",
    name: "余烬循环",
    description: "一回合内打出技能牌后再打出攻击牌，获得 1 点能量并抽 1 张牌。",
    trigger: "每回合首次形成“技能牌 -> 攻击牌”顺序时触发。",
    visualAction: "角色展开卡牌环，旧铜能量核点亮并牵引下一张牌。",
    image: initialSkillAssets.flowEngine,
    action: "skill",
  },
] as const;

export type SceneAssetKey = keyof typeof sceneAssets;
export type EnemyAssetKey = keyof typeof enemyAssets;
export type EnemyActionAssetKey = keyof typeof enemyActionAssets;
export type CardArtAssetKey = keyof typeof cardArtAssets;
export type PlayerActionAssetKey = keyof typeof playerActionAssets;
