import { cardsById, getCardEffects } from "../data/cards";
import { enemies as enemyDefs } from "../data/enemies";
import { pickWeighted, shuffle } from "../lib/rng";
import type { CardInstance, CombatEnemy, CombatState, EffectDef, EnemyGroup, EnemyMove, StarterSkillId } from "./types";

const BASE_ENERGY = 3;
const BASE_DRAW = 5;
const MAX_HAND = 10;

export function createCombat(input: { deck: CardInstance[]; enemyGroup: EnemyGroup; seed: number; hp?: number; maxHp?: number; initialSkillId?: StarterSkillId | null }): CombatState {
  const [drawPile, rngState] = shuffle(input.deck, input.seed);
  const enemies = input.enemyGroup.enemyIds.map((enemyId, index) => {
    const def = enemyDefs[enemyId];
    return {
      id: `${enemyId}-${index}`,
      defId: enemyId,
      name: def.name,
      hp: def.maxHp,
      maxHp: def.maxHp,
      block: 0,
      statuses: {},
      intent: null,
      lastMoveId: null,
      consecutiveMoveCount: 0,
      cooldowns: {}
    } satisfies CombatEnemy;
  });
  const combat: CombatState = {
    id: `combat-${input.seed}-${Date.now()}`,
    turn: 1,
    phase: "player_input",
    player: { hp: input.hp ?? 70, maxHp: input.maxHp ?? 70, statuses: {} },
    enemies,
    energy: BASE_ENERGY,
    maxEnergy: BASE_ENERGY,
    block: 0,
    drawPile,
    hand: [],
    discardPile: [],
    exhaustPile: [],
    actionQueue: [],
    log: [],
    initialSkillId: input.initialSkillId ?? null,
    skillState: {
      burstAttackCount: 0,
      burstReady: false,
      guardCounterTriggered: false,
      flowSawSkill: false,
      flowTriggered: false
    },
    seed: input.seed,
    rngState,
    result: null
  };
  generateEnemyIntents(combat);
  drawCards(combat, BASE_DRAW);
  return combat;
}

export function drawCards(combat: CombatState, amount: number): void {
  for (let drawn = 0; drawn < amount && combat.hand.length < MAX_HAND; drawn += 1) {
    if (combat.drawPile.length === 0) {
      if (combat.discardPile.length === 0) return;
      const [newDrawPile, next] = shuffle(combat.discardPile, combat.rngState);
      combat.rngState = next;
      combat.drawPile = newDrawPile;
      combat.discardPile = [];
      combat.log.push("弃牌堆洗回抽牌堆。");
    }
    const nextCard = combat.drawPile.shift();
    if (nextCard) combat.hand.push(nextCard);
  }
}

export function playCard(combat: CombatState, cardUuid: string, targetEnemyId?: string): CombatState {
  if (combat.phase !== "player_input") return combat;
  const handIndex = combat.hand.findIndex((card) => card.uuid === cardUuid);
  if (handIndex < 0) return combat;
  const instance = combat.hand[handIndex];
  const def = cardsById[instance.cardId];
  if (combat.energy < def.cost) return combat;
  if ((def.target === "enemy" || def.target === "all_enemies") && !targetEnemyId && def.target !== "all_enemies") return combat;

  combat.energy -= def.cost;
  combat.hand.splice(handIndex, 1);
  const blockBefore = combat.block;
  const shouldExhaust = getCardEffects(instance).some((effect) => effect.kind === "exhaust_self");
  for (const effect of getCardEffects(instance)) applyEffect(combat, effect, targetEnemyId);
  applyStarterSkill(combat, def.type, targetEnemyId, blockBefore);
  if (shouldExhaust) combat.exhaustPile.push(instance);
  else combat.discardPile.push(instance);
  combat.log.push(`打出 ${def.name}。`);
  checkCombatEnd(combat);
  return combat;
}

function applyStarterSkill(combat: CombatState, playedType: string, targetEnemyId: string | undefined, blockBefore: number): void {
  if (!combat.initialSkillId) return;
  if (combat.initialSkillId === "burst-attack" && playedType === "attack" && combat.turn === 1) {
    if (combat.skillState.burstReady) {
      const target = findTarget(combat, targetEnemyId);
      if (target) {
        dealDirectDamage(target, 8);
        combat.skillState.burstReady = false;
        combat.log.push("猩红突袭触发：追加 8 点伤害。");
      }
    } else {
      combat.skillState.burstAttackCount += 1;
      if (combat.skillState.burstAttackCount >= 3) {
        combat.skillState.burstReady = true;
        combat.log.push("猩红突袭蓄势完成：下一张攻击牌追加伤害。");
      }
    }
  }

  if (combat.initialSkillId === "guard-counter" && !combat.skillState.guardCounterTriggered && blockBefore < 12 && combat.block >= 12) {
    const target = findTarget(combat, targetEnemyId);
    if (target) {
      dealDirectDamage(target, 8);
      combat.skillState.guardCounterTriggered = true;
      combat.log.push("铁壁回击触发：反击造成 8 点伤害。");
    }
  }

  if (combat.initialSkillId === "flow-engine") {
    if (playedType === "skill") combat.skillState.flowSawSkill = true;
    if (playedType === "attack" && combat.skillState.flowSawSkill && !combat.skillState.flowTriggered) {
      combat.energy += 1;
      drawCards(combat, 1);
      combat.skillState.flowTriggered = true;
      combat.log.push("余烬循环触发：获得 1 能量并抽 1 张牌。");
    }
  }
}

function findTarget(combat: CombatState, targetEnemyId?: string): CombatEnemy | undefined {
  return combat.enemies.find((enemy) => enemy.id === targetEnemyId && enemy.hp > 0) ?? combat.enemies.find((enemy) => enemy.hp > 0);
}

function dealDirectDamage(enemy: CombatEnemy, amount: number): void {
  const blocked = Math.min(enemy.block, amount);
  enemy.block -= blocked;
  enemy.hp = Math.max(0, enemy.hp - (amount - blocked));
}

function applyEffect(combat: CombatState, effect: EffectDef, targetEnemyId?: string): void {
  if (effect.kind === "damage") {
    const targets = effect.target === "all_enemies" ? combat.enemies.filter((enemy) => enemy.hp > 0) : combat.enemies.filter((enemy) => enemy.id === targetEnemyId);
    for (const enemy of targets) {
      const strength = combat.player.statuses.strength ?? 0;
      const vulnerableMultiplier = (enemy.statuses.vulnerable ?? 0) > 0 ? 1.5 : 1;
      const damage = Math.floor((effect.amount + strength) * vulnerableMultiplier);
      const blocked = Math.min(enemy.block, damage);
      enemy.block -= blocked;
      enemy.hp = Math.max(0, enemy.hp - (damage - blocked));
    }
  }
  if (effect.kind === "block") combat.block += effect.amount + (combat.player.statuses.dexterity ?? 0);
  if (effect.kind === "draw") drawCards(combat, effect.amount);
  if (effect.kind === "energy") combat.energy += effect.amount;
  if (effect.kind === "buff") combat.player.statuses[effect.status] = (combat.player.statuses[effect.status] ?? 0) + effect.amount;
  if (effect.kind === "status") {
    if (effect.target === "player") combat.player.statuses[effect.status] = (combat.player.statuses[effect.status] ?? 0) + effect.amount;
    else {
      const targets = targetEnemyId ? combat.enemies.filter((enemy) => enemy.id === targetEnemyId) : combat.enemies;
      targets.forEach((enemy) => {
        enemy.statuses[effect.status] = (enemy.statuses[effect.status] ?? 0) + effect.amount;
      });
    }
  }
}

export function endPlayerTurn(combat: CombatState): CombatState {
  combat.phase = "enemy_turn";
  combat.discardPile.push(...combat.hand);
  combat.hand = [];
  for (const enemy of combat.enemies.filter((item) => item.hp > 0)) resolveEnemyMove(combat, enemy);
  checkCombatEnd(combat);
  if (!combat.result) startPlayerTurn(combat);
  return combat;
}

function resolveEnemyMove(combat: CombatState, enemy: CombatEnemy): void {
  const move = enemy.intent;
  if (!move) return;
  for (const effect of move.effects) {
    if (effect.kind === "damage") {
      const strength = enemy.statuses.strength ?? 0;
      const weakMultiplier = (enemy.statuses.weak ?? 0) > 0 ? 0.75 : 1;
      const incoming = Math.max(0, Math.floor((effect.amount + strength) * weakMultiplier));
      const blocked = Math.min(combat.block, incoming);
      combat.block -= blocked;
      combat.player.hp = Math.max(0, combat.player.hp - (incoming - blocked));
    }
    if (effect.kind === "block") enemy.block += effect.amount;
    if (effect.kind === "buff") enemy.statuses[effect.status] = (enemy.statuses[effect.status] ?? 0) + effect.amount;
    if (effect.kind === "status" && effect.target === "player") combat.player.statuses[effect.status] = (combat.player.statuses[effect.status] ?? 0) + effect.amount;
  }
  const repeatedMove = enemy.lastMoveId === move.id;
  enemy.lastMoveId = move.id;
  enemy.consecutiveMoveCount = repeatedMove ? enemy.consecutiveMoveCount + 1 : 1;
  if (move.cooldown) enemy.cooldowns[move.id] = move.cooldown;
}

export function startPlayerTurn(combat: CombatState): void {
  combat.turn += 1;
  combat.phase = "player_input";
  combat.block = 0;
  combat.energy = combat.maxEnergy;
  tickStatuses(combat.player.statuses);
  combat.enemies.forEach((enemy) => {
    enemy.block = 0;
    tickStatuses(enemy.statuses);
    Object.keys(enemy.cooldowns).forEach((key) => {
      enemy.cooldowns[key] -= 1;
      if (enemy.cooldowns[key] <= 0) delete enemy.cooldowns[key];
    });
  });
  combat.skillState.guardCounterTriggered = false;
  combat.skillState.flowSawSkill = false;
  combat.skillState.flowTriggered = false;
  combat.skillState.burstReady = false;
  generateEnemyIntents(combat);
  drawCards(combat, BASE_DRAW);
}

function tickStatuses(statuses: Record<string, number>): void {
  ["vulnerable", "weak"].forEach((key) => {
    if (statuses[key]) statuses[key] -= 1;
    if (statuses[key] <= 0) delete statuses[key];
  });
}

export function generateEnemyIntents(combat: CombatState): void {
  combat.enemies.forEach((enemy) => {
    if (enemy.hp <= 0) return;
    const def = enemyDefs[enemy.defId];
    const candidates = def.moves.filter((move) => {
      if (enemy.cooldowns[move.id]) return false;
      if (move.maxConsecutive && enemy.lastMoveId === move.id && enemy.consecutiveMoveCount >= move.maxConsecutive) return false;
      return true;
    });
    const [intent, next] = pickWeighted<EnemyMove>(candidates.length ? candidates : def.moves, combat.rngState);
    combat.rngState = next;
    enemy.intent = intent;
  });
}

function checkCombatEnd(combat: CombatState): void {
  if (combat.player.hp <= 0) {
    combat.result = "defeat";
    combat.phase = "finished";
  } else if (combat.enemies.every((enemy) => enemy.hp <= 0)) {
    combat.result = "victory";
    combat.phase = "finished";
  }
}
