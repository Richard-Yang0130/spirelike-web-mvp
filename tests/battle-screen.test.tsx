import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { BattleScreen } from "../src/components/screens/BattleScreen";
import type { UiCard, UiEnemy, UiPlayer } from "../src/components/ui/types";

declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}

const player: UiPlayer = {
  name: "默认角色",
  image: "/player.png",
  hp: 70,
  maxHp: 70,
  block: 0,
  energy: 3,
  maxEnergy: 3
};

const enemy: UiEnemy = {
  id: "cultist-0",
  name: "邪教徒",
  image: "/enemy.png",
  hp: 40,
  maxHp: 40,
  intent: { type: "attack", label: "攻击 6" },
  kind: "normal"
};

const strike = {
  id: "strike-1",
  name: "打击",
  cost: 1,
  type: "attack",
  rarity: "starter",
  description: "造成 6 点伤害。",
  art: "/strike.png",
  playable: true,
  target: "enemy"
} as UiCard & { target: "enemy" };

const defend = {
  id: "defend-1",
  name: "防御",
  cost: 1,
  type: "skill",
  rarity: "starter",
  description: "获得 5 点格挡。",
  art: "/defend.png",
  playable: true,
  target: "self"
} as UiCard & { target: "self" };

describe("BattleScreen target selection", () => {
  beforeAll(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("waits for an enemy click before playing an enemy-targeted card", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    const plays: Array<{ cardId: string; targetEnemyId?: string }> = [];

    act(() => {
      root.render(
        <BattleScreen
          player={player}
          enemies={[enemy]}
          hand={[strike]}
          drawCount={0}
          discardCount={0}
          exhaustCount={0}
          onPlayCard={(card, targetEnemyId) => plays.push({ cardId: card.id, targetEnemyId })}
        />
      );
    });

    const cardButton = document.querySelector<HTMLButtonElement>(".game-card")!;
    act(() => cardButton.click());

    expect(plays).toEqual([]);
    expect(document.body.textContent).toContain("选择一个敌人");

    const enemyStand = document.querySelector<HTMLElement>(".enemy-stand")!;
    act(() => enemyStand.click());

    expect(plays).toEqual([{ cardId: "strike-1", targetEnemyId: "cultist-0" }]);

    act(() => root.unmount());
  });

  it("plays self-targeted cards immediately", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    const plays: Array<{ cardId: string; targetEnemyId?: string }> = [];

    act(() => {
      root.render(
        <BattleScreen
          player={player}
          enemies={[enemy]}
          hand={[defend]}
          drawCount={0}
          discardCount={0}
          exhaustCount={0}
          onPlayCard={(card, targetEnemyId) => plays.push({ cardId: card.id, targetEnemyId })}
        />
      );
    });

    const cardButton = document.querySelector<HTMLButtonElement>(".game-card")!;
    act(() => cardButton.click());

    expect(plays).toEqual([{ cardId: "defend-1", targetEnemyId: undefined }]);
    expect(document.body.textContent).not.toContain("选择一个敌人");

    act(() => root.unmount());
  });
});
