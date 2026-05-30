import { useEffect, useMemo, useState } from "react";
import {
  BattleScreen,
  EventScreen,
  GameOverScreen,
  InitialSkillScreen,
  IntroScreen,
  MapScreen,
  RestScreen,
  RewardScreen,
  ShopScreen,
  TopBar
} from "./";
import { characterAssets } from "./assets/gameAssets";
import type { EnemyAction, PlayerAction, UiCard, UiEnemy, UiInitialSkill, UiMapNode, UiPlayer, UiRelic } from "./ui/types";
import { cardsById, getCardAnimation } from "../data/cards";
import { enemies as enemyDefs } from "../data/enemies";
import { events } from "../data/events";
import { relicsById } from "../data/relics";
import { endPlayerTurn, playCard } from "../game/combat";
import {
  chooseMapNode,
  chooseRewardCard,
  completeCombat,
  createNewRun,
  getChestRelicId,
  loadRun,
  openChest,
  rest,
  returnToMap,
  saveRun,
  upgradeCard
} from "../game/run";
import { buyCard, buyRelic, createShopInventory, getCardPrice, removeCard } from "../game/shop";
import type { CardAnimationMeta, CardInstance, CombatState, IntentType, MapNode, RunState, StarterSkillId } from "../game/types";

const DEFAULT_SEED = 20260530;
const STARTER_SKILL_KEY = "spirelike.initialSkill.v1";

type CurrentCardAnimation = CardAnimationMeta & {
  cardId: string;
  cardUuid: string;
  eventId: number;
  triggeredSkillFx?: "burst-attack" | "guard-counter" | "flow-engine";
};

export function GameShell() {
  const loadedRun = useMemo(() => loadRun(), []);
  const [run, setRun] = useState<RunState>(() => loadedRun ?? createNewRun(DEFAULT_SEED));
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const [isChoosingInitialSkill, setIsChoosingInitialSkill] = useState(false);
  const [selectedStarterSkillId, setSelectedStarterSkillId] = useState<StarterSkillId | null>(() => loadStarterSkillId(loadedRun?.initialSkillId ?? null));
  const [selectedRewardCardId, setSelectedRewardCardId] = useState<string | null>(null);
  const [restMode, setRestMode] = useState<"choose" | "upgrade">("choose");
  const [soldShopIds, setSoldShopIds] = useState<string[]>([]);
  const [playerAction, setPlayerAction] = useState<PlayerAction>("idle");
  const [enemyActionById, setEnemyActionById] = useState<Record<string, EnemyAction>>({});
  const [currentCardAnimation, setCurrentCardAnimation] = useState<CurrentCardAnimation | null>(null);
  const [playedCardId, setPlayedCardId] = useState<string | null>(null);
  const [damagedEnemyIds, setDamagedEnemyIds] = useState<string[]>([]);
  const [floatingNumbers, setFloatingNumbers] = useState<Array<{ id: string; enemyId?: string; value: string; tone?: "damage" | "block" | "heal" }>>([]);

  const shopInventory = useMemo(() => (run.status === "shop" ? createShopInventory(run) : null), [run.status, run.currentNodeId, run.seed, run.floor]);

  useEffect(() => {
    saveRun(run);
  }, [run]);

  const commit = (next: RunState) => setRun(next);
  const relics = run.relics.map(toUiRelic).filter(Boolean);
  const screenTransitionKey = `${run.status}-${run.currentNodeId ?? "start"}-${run.floor}`;

  if (!hasSeenIntro) {
    return (
      <div className="game-shell">
        <IntroScreen
          onStart={() => {
            setHasSeenIntro(true);
            setIsChoosingInitialSkill(true);
          }}
        />
      </div>
    );
  }

  if (isChoosingInitialSkill) {
    return (
      <div className="game-shell">
        <InitialSkillScreen
          selectedSkillId={selectedStarterSkillId}
          onSelectSkill={(skill) => {
            const skillId = toStarterSkillId(skill);
            setSelectedStarterSkillId(skillId);
            saveStarterSkillId(skillId);
          }}
          onConfirm={() => {
            if (!selectedStarterSkillId) return;
            commit(createNewRun(DEFAULT_SEED, selectedStarterSkillId));
            setIsChoosingInitialSkill(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="game-shell">
      <TopBar player={toUiPlayer(run)} floor={Math.max(1, run.floor || 1)} gold={run.gold} relics={relics} onSettings={() => console.info("settings")} />

      {run.status === "map" ? (
        <MapScreen floor={Math.max(1, run.floor || 1)} nodes={toUiMapNodes(run)} edges={toUiMapEdges(run)} onSelectNode={(node) => commit(chooseMapNode(run, node.id))} />
      ) : null}

      {run.status === "combat" && run.combat ? (
        <BattleScreen
          player={toCombatUiPlayer(run.combat)}
          enemies={run.combat.enemies.map(toUiEnemy)}
          hand={run.combat.hand.map((card) => toUiCard(card, run.combat!))}
          drawCount={run.combat.drawPile.length}
          discardCount={run.combat.discardPile.length}
          exhaustCount={run.combat.exhaustPile.length}
          logs={run.combat.log}
          playerStatuses={toStatusLines(run.combat.player.statuses)}
          intentSummary={toIntentSummary(run.combat)}
          playerAction={playerAction}
          enemyActionById={enemyActionById}
          {...({ currentCardAnimation } as { currentCardAnimation?: CurrentCardAnimation | null })}
          playedCardId={playedCardId}
          damagedEnemyIds={damagedEnemyIds}
          floatingNumbers={floatingNumbers}
          screenTransitionKey={screenTransitionKey}
          onPlayCard={(card) => {
            if (!run.combat) return;
            const cardInstance = run.combat.hand.find((item) => item.uuid === card.id);
            if (!cardInstance) return;
            const cardDef = cardsById[cardInstance.cardId];
            const cardAnimation = getCardAnimation(cardInstance);
            const targetId = run.combat.enemies.find((enemy) => enemy.hp > 0)?.id;
            const hpBefore = new Map(run.combat.enemies.map((enemy) => [enemy.id, enemy.hp]));
            const blockBefore = run.combat.block;
            const logCountBefore = run.combat.log.length;
            playCard(run.combat, card.id, targetId);
            const damaged = run.combat.enemies.filter((enemy) => (hpBefore.get(enemy.id) ?? enemy.hp) > enemy.hp);
            const newLogs = run.combat.log.slice(logCountBefore);
            const triggeredSkillFx = triggeredSkillFromLogs(newLogs);
            setPlayerAction(actionForCardPlay(cardAnimation, blockBefore, run.combat.block, newLogs));
            setCurrentCardAnimation({
              ...cardAnimation,
              cardId: cardDef.id,
              cardUuid: card.id,
              eventId: Date.now(),
              triggeredSkillFx
            });
            setPlayedCardId(card.id);
            const hurtEnemyIds = damaged.map((enemy) => enemy.id);
            setDamagedEnemyIds(hurtEnemyIds);
            setEnemyActionById(toEnemyActionMap(hurtEnemyIds, "hurt"));
            setFloatingNumbers(
              damaged.map((enemy) => ({
                id: `${card.id}-${enemy.id}-${Date.now()}`,
                enemyId: enemy.id,
                value: `-${(hpBefore.get(enemy.id) ?? enemy.hp) - enemy.hp}`,
                tone: "damage"
              }))
            );
            window.setTimeout(() => {
              setPlayerAction("idle");
              setEnemyActionById({});
              setCurrentCardAnimation(null);
              setPlayedCardId(null);
              setDamagedEnemyIds([]);
              setFloatingNumbers([]);
            }, 920);
            commit(completeCombat({ ...run, hp: run.combat.player.hp, combat: { ...run.combat } }));
          }}
          onEndTurn={() => {
            if (!run.combat) return;
            const attackingEnemyIds = run.combat.enemies
              .filter((enemy) => enemy.hp > 0 && (enemy.intent?.intent === "attack" || enemy.intent?.intent === "attack_debuff"))
              .map((enemy) => enemy.id);
            const playerHpBefore = run.combat.player.hp;
            setEnemyActionById(toEnemyActionMap(attackingEnemyIds, "attack"));
            endPlayerTurn(run.combat);
            setPlayerAction(run.combat.player.hp < playerHpBefore ? "hurt" : "idle");
            window.setTimeout(() => {
              setPlayerAction("idle");
              setEnemyActionById({});
            }, 700);
            commit(completeCombat({ ...run, hp: run.combat.player.hp, combat: { ...run.combat } }));
          }}
        />
      ) : null}

      {run.status === "reward" && run.pendingReward ? (
        <RewardScreen
          gold={run.pendingReward.gold}
          relic={run.pendingReward.relicId ? toUiRelic(run.pendingReward.relicId) : undefined}
          cards={run.pendingReward.cardChoices.map((card) => toUiCard(card))}
          selectedCardId={selectedRewardCardId ?? undefined}
          screenTransitionKey={screenTransitionKey}
          onSelectCard={(card) => setSelectedRewardCardId(card.id)}
          onSkip={() => {
            setSelectedRewardCardId(null);
            commit(chooseRewardCard(run, null));
          }}
          onContinue={() => {
            commit(chooseRewardCard(run, selectedRewardCardId));
            setSelectedRewardCardId(null);
          }}
        />
      ) : null}

      {run.status === "shop" && shopInventory ? (
        <ShopScreen
          cards={shopInventory.cards.map((card) => ({ ...toUiCard(card), price: getCardPrice(card.cardId), playable: !soldShopIds.includes(card.uuid) }))}
          relics={shopInventory.relics.map((relic, index) => ({ ...toUiRelic(relic.id), price: 150 + index * 50, sold: soldShopIds.includes(relic.id) }))}
          removePrice={shopInventory.removePrice}
          onBuyCard={(card) => {
            if (soldShopIds.includes(card.id)) return;
            const next = buyCard(run, card.id, shopInventory);
            if (next !== run) {
              setSoldShopIds((ids) => [...ids, card.id]);
              commit(next);
            }
          }}
          onBuyRelic={(relic) => {
            if (soldShopIds.includes(relic.id)) return;
            const next = buyRelic(run, relic.id, relic.price);
            if (next !== run) {
              setSoldShopIds((ids) => [...ids, relic.id]);
              commit(next);
            }
          }}
          onRemoveCard={() => {
            const removable = run.masterDeck.find(() => run.masterDeck.length > 1);
            if (removable) commit(removeCard(run, removable.uuid, shopInventory.removePrice));
          }}
          onLeave={() => {
            setSoldShopIds([]);
            commit(returnToMap(run));
          }}
        />
      ) : null}

      {run.status === "rest" ? (
        <RestScreen
          healAmount={Math.ceil(run.maxHp * 0.3)}
          mode={restMode}
          upgradeCards={run.masterDeck.map((card) => toUiCard(card))}
          onRest={() => {
            setRestMode("choose");
            commit(returnToMap(rest(run)));
          }}
          onUpgradeMode={() => setRestMode("upgrade")}
          onUpgradeCard={(card) => {
            setRestMode("choose");
            commit(returnToMap(upgradeCard(run, card.id)));
          }}
        />
      ) : null}

      {run.status === "event" ? (
        <EventScreen
          title={currentEvent(run).title}
          body={currentEvent(run).body}
          choices={currentEvent(run).choices.map((label, index) => ({
            id: `${currentEvent(run).id}-${index}`,
            label,
            tone: label.includes("失去") ? "danger" : label.includes("获得") || label.includes("恢复") || label.includes("升级") ? "reward" : "neutral"
          }))}
          onChoose={(choice) => commit(returnToMap(applyEventChoice(run, choice.label)))}
        />
      ) : null}

      {run.status === "chest" ? (
        <RewardScreen
          gold={0}
          relic={getChestRelicId(run) ? toUiRelic(getChestRelicId(run)!) : undefined}
          cards={[]}
          onSkip={() => commit(returnToMap(openChest(run)))}
          onContinue={() => commit(returnToMap(openChest(run)))}
        />
      ) : null}

      {run.status === "victory" ? (
        <GameOverScreen result="victory" floor={run.floor} kills={run.visitedNodeIds.length} relicCount={run.relics.length} deck={run.masterDeck.map((card) => toUiCard(card))} onNewRun={() => restartWithIntro(commit, selectedStarterSkillId, setHasSeenIntro, setIsChoosingInitialSkill)} onMapOverview={() => commit({ ...run, status: "map", availableNodeIds: [] })} />
      ) : null}
      {run.status === "defeat" ? (
        <GameOverScreen result="defeat" floor={run.floor} kills={run.visitedNodeIds.length} relicCount={run.relics.length} deck={run.masterDeck.map((card) => toUiCard(card))} onNewRun={() => restartWithIntro(commit, selectedStarterSkillId, setHasSeenIntro, setIsChoosingInitialSkill)} onMapOverview={() => commit({ ...run, status: "map", availableNodeIds: [] })} />
      ) : null}
    </div>
  );
}

function restartWithIntro(commit: (run: RunState) => void, skillId: StarterSkillId | null, setHasSeenIntro: (value: boolean) => void, setIsChoosingInitialSkill: (value: boolean) => void): void {
  commit(createNewRun(Date.now(), skillId));
  setHasSeenIntro(false);
  setIsChoosingInitialSkill(false);
}

function toStarterSkillId(skill: UiInitialSkill): StarterSkillId {
  return skill.id as StarterSkillId;
}

function loadStarterSkillId(fallback: StarterSkillId | null): StarterSkillId | null {
  const stored = localStorage.getItem(STARTER_SKILL_KEY) as StarterSkillId | null;
  return stored === "burst-attack" || stored === "guard-counter" || stored === "flow-engine" ? stored : fallback;
}

function saveStarterSkillId(skillId: StarterSkillId): void {
  localStorage.setItem(STARTER_SKILL_KEY, skillId);
}

function actionForCardPlay(cardAnimation: CardAnimationMeta, blockBefore: number, blockAfter: number, newLogs: string[]): PlayerAction {
  if (newLogs.some((line) => line.includes("猩红突袭"))) return "attack";
  if (newLogs.some((line) => line.includes("铁壁回击"))) return "block";
  if (newLogs.some((line) => line.includes("余烬循环"))) return "skill";
  if (blockAfter > blockBefore) return "block";
  return cardAnimation.playerAction;
}

function triggeredSkillFromLogs(newLogs: string[]): CurrentCardAnimation["triggeredSkillFx"] {
  if (newLogs.some((line) => line.includes("猩红突袭"))) return "burst-attack";
  if (newLogs.some((line) => line.includes("铁壁回击"))) return "guard-counter";
  if (newLogs.some((line) => line.includes("余烬循环"))) return "flow-engine";
  return undefined;
}

function toEnemyActionMap(enemyIds: string[], action: EnemyAction): Record<string, EnemyAction> {
  return Object.fromEntries(enemyIds.map((id) => [id, action]));
}

function toUiPlayer(run: RunState): Pick<UiPlayer, "name" | "image" | "hp" | "maxHp"> {
  return { name: "默认角色", image: characterAssets.player, hp: run.hp, maxHp: run.maxHp };
}

function toCombatUiPlayer(combat: CombatState): UiPlayer {
  return {
    name: "默认角色",
    image: characterAssets.player,
    hp: combat.player.hp,
    maxHp: combat.player.maxHp,
    block: combat.block,
    energy: combat.energy,
    maxEnergy: combat.maxEnergy
  };
}

function toUiCard(instance: CardInstance, combat?: CombatState): UiCard {
  const def = cardsById[instance.cardId];
  const animation = def.animation;
  return {
    id: instance.uuid,
    name: def.name,
    cost: def.cost,
    type: def.type,
    rarity: ["strike", "defend", "bash"].includes(def.id) ? "starter" : def.rarity,
    description: instance.upgraded ? def.upgradedDescription : def.description,
    art: def.assetPath,
    fxKey: animation.fxKey,
    actionLabel: animation.shortLabel,
    actionTexture: def.assetPath,
    upgraded: instance.upgraded,
    playable: combat ? combat.energy >= def.cost && combat.phase === "player_input" : true
  };
}

function toUiRelic(relicId: string): UiRelic {
  const relic = relicsById[relicId];
  return {
    id: relic.id,
    name: relic.name,
    description: relic.description,
    image: relic.assetPath
  };
}

function toUiEnemy(enemy: CombatState["enemies"][number]): UiEnemy {
  const def = enemyDefs[enemy.defId];
  return {
    id: enemy.id,
    name: enemy.name,
    image: def.assetPath,
    hp: enemy.hp,
    maxHp: enemy.maxHp,
    block: enemy.block,
    kind: enemy.maxHp >= 140 ? "boss" : enemy.maxHp >= 70 ? "elite" : "normal",
    intent: enemy.intent ? { type: toUiIntentType(enemy.intent.intent), label: enemy.intent.label } : undefined
  };
}

function toUiIntentType(intent: IntentType): NonNullable<UiEnemy["intent"]>["type"] {
  if (intent === "attack") return "attack";
  if (intent === "attack_debuff") return "debuff";
  if (intent === "block") return "block";
  if (intent === "buff") return "buff";
  return "unknown";
}

function toUiMapNodes(run: RunState): UiMapNode[] {
  return run.map.floors.flatMap(({ nodes }) =>
    nodes.map((node) => ({
      id: node.id,
      type: node.type,
      state: toNodeState(run, node),
      x: nodeX(node, nodes.length),
      y: 96 - ((node.floor - 1) / 11) * 90
    }))
  );
}

function toUiMapEdges(run: RunState) {
  const visited = new Set(run.visitedNodeIds);
  return run.map.floors.flatMap(({ nodes }) =>
    nodes.flatMap((node) =>
      node.nextNodeIds.map((to) => ({
        from: node.id,
        to,
        completed: visited.has(node.id) && visited.has(to)
      }))
    )
  );
}

function toNodeState(run: RunState, node: MapNode): UiMapNode["state"] {
  if (run.currentNodeId === node.id) return "current";
  if (run.visitedNodeIds.includes(node.id)) return "completed";
  if (run.availableNodeIds.includes(node.id)) return "available";
  return "locked";
}

function nodeX(node: MapNode, count: number): number {
  if (count === 1) return 50;
  const span = Math.min(62, 18 * (count - 1));
  return 50 - span / 2 + (span / (count - 1)) * node.index;
}

function toStatusLines(statuses: Record<string, number>): string[] {
  return Object.entries(statuses).map(([key, value]) => `${statusLabel(key)} ${value}`);
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = { strength: "力量", dexterity: "敏捷", vulnerable: "易伤", weak: "虚弱" };
  return labels[status] ?? status;
}

function toIntentSummary(combat: CombatState): string[] {
  return combat.enemies
    .filter((enemy) => enemy.hp > 0 && enemy.intent)
    .map((enemy) => `${enemy.name}: ${enemy.intent?.label}`);
}

function currentEvent(run: RunState) {
  return events[(run.seed + run.floor) % events.length];
}

function applyEventChoice(run: RunState, label: string): RunState {
  let next = { ...run };
  const hpLoss = /失去 (\d+) HP/.exec(label);
  const goldGain = /获得 (\d+) 金币/.exec(label);
  const healGain = /恢复 (\d+) HP/.exec(label);
  if (hpLoss) next.hp = Math.max(1, next.hp - Number(hpLoss[1]));
  if (goldGain) next.gold += Number(goldGain[1]);
  if (healGain) next.hp = Math.min(next.maxHp, next.hp + Number(healGain[1]));
  if (label.includes("升级")) {
    const target = next.masterDeck.find((card) => !card.upgraded);
    if (target) next = upgradeCard(next, target.uuid);
  }
  if (label.includes("遗物")) {
    const relicId = getChestRelicId(next);
    if (relicId && !next.relics.includes(relicId)) next.relics = [...next.relics, relicId];
  }
  return next;
}
