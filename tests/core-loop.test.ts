import { describe, expect, it } from "vitest";
import { createCombat, drawCards, endPlayerTurn, playCard } from "../src/game/combat";
import { generateMap, getReachableNodes } from "../src/game/map";
import { createNewRun, chooseMapNode, chooseRewardCard } from "../src/game/run";
import { cards, cardsById, createCardInstance, getCardAnimation } from "../src/data/cards";
import { enemyGroups } from "../src/data/enemies";

describe("combat deck flow", () => {
  it("shuffles discard into draw pile when drawing past the current draw pile", () => {
    const combat = createCombat({
      deck: [
        createCardInstance("strike"),
        createCardInstance("defend"),
        createCardInstance("bash")
      ],
      enemyGroup: enemyGroups.normal[0],
      seed: 7
    });
    combat.drawPile = [createCardInstance("strike")];
    combat.discardPile = [createCardInstance("defend"), createCardInstance("bash")];
    combat.hand = [];

    drawCards(combat, 3);

    expect(combat.hand).toHaveLength(3);
    expect(combat.drawPile).toHaveLength(0);
    expect(combat.discardPile).toHaveLength(0);
  });
});

describe("combat card play", () => {
  it("spends energy, applies card effects, and moves played cards to discard", () => {
    const combat = createCombat({
      deck: [createCardInstance("strike"), createCardInstance("defend")],
      enemyGroup: enemyGroups.normal[0],
      seed: 11
    });
    combat.phase = "player_input";
    combat.energy = 3;
    combat.hand = [createCardInstance("strike"), createCardInstance("defend")];
    const targetId = combat.enemies[0].id;
    const hpBefore = combat.enemies[0].hp;

    playCard(combat, combat.hand[0].uuid, targetId);
    playCard(combat, combat.hand[0].uuid);

    expect(combat.energy).toBe(1);
    expect(combat.enemies[0].hp).toBe(hpBefore - 6);
    expect(combat.block).toBe(cardsById.defend.block);
    expect(combat.hand).toHaveLength(0);
    expect(combat.discardPile).toHaveLength(2);
  });
});

describe("starter skills", () => {
  it("burst-attack arms after three first-turn attacks and adds damage to the next attack", () => {
    const combat = createCombat({
      deck: Array.from({ length: 5 }, () => createCardInstance("strike")),
      enemyGroup: enemyGroups.normal[0],
      seed: 19,
      initialSkillId: "burst-attack"
    });
    combat.phase = "player_input";
    combat.energy = 4;
    combat.hand = Array.from({ length: 4 }, () => createCardInstance("strike"));
    const targetId = combat.enemies[0].id;
    const hpBefore = combat.enemies[0].hp;

    playCard(combat, combat.hand[0].uuid, targetId);
    playCard(combat, combat.hand[0].uuid, targetId);
    playCard(combat, combat.hand[0].uuid, targetId);
    playCard(combat, combat.hand[0].uuid, targetId);

    expect(combat.enemies[0].hp).toBe(hpBefore - 32);
    expect(combat.log.some((line) => line.includes("猩红突袭"))).toBe(true);
  });

  it("flow-engine grants energy and draws when a skill is followed by an attack once per turn", () => {
    const combat = createCombat({
      deck: [createCardInstance("strike"), createCardInstance("strike"), createCardInstance("strike")],
      enemyGroup: enemyGroups.normal[0],
      seed: 23,
      initialSkillId: "flow-engine"
    });
    combat.phase = "player_input";
    combat.energy = 2;
    combat.hand = [createCardInstance("defend"), createCardInstance("strike")];
    combat.drawPile = [createCardInstance("strike")];

    playCard(combat, combat.hand[0].uuid);
    playCard(combat, combat.hand[0].uuid, combat.enemies[0].id);

    expect(combat.energy).toBe(1);
    expect(combat.hand).toHaveLength(1);
    expect(combat.log.some((line) => line.includes("余烬循环"))).toBe(true);
  });
});

describe("card animation metadata", () => {
  it("defines animation metadata for every card", () => {
    const fxKeys = new Set<string>();

    for (const card of cards) {
      expect(card.animation.playerAction).toMatch(/idle|attack|block|skill|hurt|victory/);
      expect(card.animation.fxKey).toBeTruthy();
      expect(card.animation.targetMotion).toMatch(/single|multi|all|self|enemy|buff|debuff/);
      expect(card.animation.impactClass).toBeTruthy();
      expect(card.animation.shortLabel).toBeTruthy();
      fxKeys.add(card.animation.fxKey);
    }

    expect(fxKeys.size).toBe(cards.length);
  });

  it("exposes attack and skill animation actions for UI consumers", () => {
    expect(getCardAnimation(createCardInstance("strike")).playerAction).toBe("attack");
    expect(getCardAnimation(createCardInstance("defend")).playerAction).toBe("block");
    expect(getCardAnimation(createCardInstance("battle-trance")).playerAction).toBe("skill");
  });
});

describe("enemy intent", () => {
  it("generates visible enemy intents and resolves them on end turn", () => {
    const combat = createCombat({
      deck: [createCardInstance("defend"), createCardInstance("defend")],
      enemyGroup: enemyGroups.normal[0],
      seed: 3
    });
    const intent = combat.enemies[0].intent;

    expect(intent).toBeDefined();
    expect(intent?.label).toMatch(/攻击|防御|强化|减益|未知/);

    const hpBefore = combat.player.hp;
    endPlayerTurn(combat);

    expect(combat.player.hp).toBeLessThanOrEqual(hpBefore);
    expect(combat.enemies[0].intent).toBeDefined();
  });
});

describe("map reachability", () => {
  it("creates a 12-floor map with only next connected nodes reachable", () => {
    const map = generateMap(42);
    const firstReachable = getReachableNodes(map, null);
    const afterFirst = getReachableNodes(map, firstReachable[0].id);

    expect(map.floors).toHaveLength(12);
    expect(map.floors[0].nodes.every((node) => node.type === "combat")).toBe(true);
    expect(map.floors[10].nodes.every((node) => node.type === "rest")).toBe(true);
    expect(map.floors[11].nodes.every((node) => node.type === "boss")).toBe(true);
    expect(afterFirst.every((node) => firstReachable[0].nextNodeIds.includes(node.id))).toBe(true);
    expect(afterFirst.every((node) => node.floor === 2)).toBe(true);
  });
});

describe("reward progression", () => {
  it("adds the selected reward card and returns to map with next reachable nodes", () => {
    let run = createNewRun(123);
    const firstNodeId = run.availableNodeIds[0];
    run = chooseMapNode(run, firstNodeId);
    run.status = "reward";
    run.pendingReward = {
      sourceNodeId: firstNodeId,
      gold: 12,
      cardChoices: [createCardInstance("pommel-strike"), createCardInstance("shrug-it-off")],
      relicId: null,
      claimedGold: false,
      claimedRelic: true,
      pickedCard: false
    };
    const beforeDeckSize = run.masterDeck.length;

    run = chooseRewardCard(run, run.pendingReward.cardChoices[0].uuid);

    expect(run.masterDeck).toHaveLength(beforeDeckSize + 1);
    expect(run.gold).toBe(111);
    expect(run.status).toBe("map");
    expect(run.availableNodeIds.length).toBeGreaterThan(0);
    expect(run.availableNodeIds.every((id) => run.map.nodesById[id].floor === 2)).toBe(true);
  });
});
