import type { CSSProperties } from "react";
import { sceneAssets } from "../assets/gameAssets";
import { CardFxLayer } from "../ui/CardFxLayer";
import { CharacterSprite } from "../ui/CharacterSprite";
import { EnemySprite } from "../ui/EnemySprite";
import { GameButton } from "../ui/GameButton";
import { GameCard } from "../ui/GameCard";
import { HealthBar } from "../ui/HealthBar";
import type { PlayerAction, UiCard, UiCardAnimation, UiCardFx, UiEnemy, UiPlayer } from "../ui/types";

type BattleScreenProps = {
  player: UiPlayer;
  enemies: UiEnemy[];
  hand: UiCard[];
  drawCount: number;
  discardCount: number;
  exhaustCount: number;
  logs?: string[];
  playerStatuses?: string[];
  intentSummary?: string[];
  playedCardId?: string | null;
  damagedEnemyIds?: string[];
  floatingNumbers?: Array<{ id: string; enemyId?: string; value: string; tone?: "damage" | "block" | "heal" }>;
  screenTransitionKey?: string | number;
  playerAction?: PlayerAction;
  enemyActionById?: Record<string, "idle" | "attack" | "hurt">;
  currentCardAnimation?: UiCardAnimation | null;
  currentCardFx?: UiCardFx | null;
  onEndTurn?: () => void;
  onPlayCard?: (card: UiCard) => void;
};

export function BattleScreen({
  player,
  enemies,
  hand,
  drawCount,
  discardCount,
  exhaustCount,
  logs = [],
  playerStatuses = [],
  intentSummary = [],
  playedCardId = null,
  damagedEnemyIds = [],
  floatingNumbers = [],
  screenTransitionKey,
  playerAction = "idle",
  enemyActionById = {},
  currentCardAnimation = null,
  currentCardFx = null,
  onEndTurn,
  onPlayCard,
}: BattleScreenProps) {
  return (
    <section className="battle-screen screen-fill room-enter" key={screenTransitionKey}>
      <aside className="left-hud">
        <div className="hud-panel player-panel">
          <img className="player-panel__portrait" src={player.image} alt="" />
          <div className="player-panel__body">
            <strong>{player.name}</strong>
            <HealthBar value={player.hp} max={player.maxHp} size="player" />
          </div>
          <div className="block-badge">{player.block ?? 0}</div>
        </div>
        <div className="hud-panel energy-panel">
          <span>能量</span>
          <div className="energy-orbs">
            {Array.from({ length: player.maxEnergy }).map((_, index) => (
              <span key={index} className={index < player.energy ? "is-on" : ""} />
            ))}
          </div>
          <strong>{player.energy}/{player.maxEnergy}</strong>
        </div>
        <div className="pile-row">
          <button type="button">抽牌 <b>{drawCount}</b></button>
          <button type="button">弃牌 <b>{discardCount}</b></button>
          <button type="button">消耗 <b>{exhaustCount}</b></button>
        </div>
        <div className="hud-panel combat-log">
          {logs.slice(-4).map((log, index) => (
            <p key={`${log}-${index}`}>{log}</p>
          ))}
        </div>
      </aside>

      <main className="combat-board" style={{ backgroundImage: `linear-gradient(rgba(12,10,8,.08), rgba(12,10,8,.38) 58%, rgba(12,10,8,.86)), url(${sceneAssets.battleRuins})` }}>
        <CardFxLayer currentCardAnimation={currentCardAnimation} currentCardFx={currentCardFx} />
        <div className="player-actor">
          <CharacterSprite action={playerAction} label={`${player.name} ${playerAction}`} />
        </div>
        <div className="enemy-zone">
          {enemies.map((enemy) => (
            <article
              key={enemy.id}
              className={[
                "enemy-stand",
                `enemy-stand--${enemy.kind ?? "normal"}`,
                enemy.damaged || damagedEnemyIds.includes(enemy.id) ? "is-damaged" : "",
              ].filter(Boolean).join(" ")}
            >
              <div className="enemy-stand__status">
                <strong>{enemy.name}</strong>
                <HealthBar value={enemy.hp} max={enemy.maxHp} size={enemy.kind === "boss" ? "boss" : "enemy"} />
                {enemy.block ? <span className="enemy-stand__block">{enemy.block}</span> : null}
              </div>
              {enemy.intent ? (
                <div className={`intent intent--${enemy.intent.type}`}>
                  <span className="intent__mark" />
                  <b>{enemy.intent.label}</b>
                </div>
              ) : null}
              <EnemySprite
                image={enemy.image}
                kind={enemy.kind}
                action={enemyActionById[enemy.id] ?? enemy.action ?? (enemy.damaged || damagedEnemyIds.includes(enemy.id) ? "hurt" : "idle")}
                label={`${enemy.name} action`}
              />
              {floatingNumbers
                .filter((item) => item.enemyId === enemy.id)
                .map((item) => <span key={item.id} className={`floating-number floating-number--${item.tone ?? "damage"}`}>{item.value}</span>)}
              <span className="enemy-stand__base" />
            </article>
          ))}
        </div>
        <div className="intent-strip">
          {intentSummary.length ? intentSummary.join(" · ") : "观察敌人意图，规划本回合行动"}
        </div>
        <div className="hand-zone">
          <div className="play-track" />
          <div className="hand-row" style={{ "--card-count": hand.length } as CSSProperties}>
            {hand.map((card, index) => (
              <div className="hand-slot" style={{ "--card-index": index } as CSSProperties} key={card.id}>
                <GameCard card={card} className={playedCardId === card.id ? "is-played" : ""} onClick={onPlayCard} />
              </div>
            ))}
          </div>
        </div>
      </main>

      <aside className="right-hud">
        <GameButton variant="combat" className="end-turn-button" onClick={onEndTurn}>结束回合</GameButton>
        <div className="hud-panel">
          <h3>敌人意图</h3>
          {intentSummary.map((item) => <p key={item}>{item}</p>)}
        </div>
        <div className="hud-panel">
          <h3>玩家状态</h3>
          {playerStatuses.length ? playerStatuses.map((item) => <p key={item}>{item}</p>) : <p>无持续状态</p>}
        </div>
        <div className="hud-panel room-goal">击败所有敌人</div>
      </aside>
    </section>
  );
}
