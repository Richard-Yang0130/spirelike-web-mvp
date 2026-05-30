import { itemAssets } from "../assets/gameAssets";
import type { UiPlayer, UiRelic } from "./types";

type TopBarProps = {
  player: Pick<UiPlayer, "name" | "image" | "hp" | "maxHp">;
  floor: number;
  act?: number;
  gold: number;
  relics: UiRelic[];
  triggeredRelicIds?: string[];
  onSettings?: () => void;
};

export function TopBar({ player, floor, act = 1, gold, relics, triggeredRelicIds = [], onSettings }: TopBarProps) {
  const visibleRelics = relics.slice(0, 12);
  const hiddenCount = Math.max(0, relics.length - visibleRelics.length);

  return (
    <header className="top-bar">
      <div className="top-bar__player">
        <img src={player.image} alt="" />
        <div>
          <strong>{player.name}</strong>
          <span>
            HP {player.hp}/{player.maxHp}
          </span>
        </div>
      </div>
      <div className="top-bar__floor">Floor {floor} / Act {act}</div>
      <div className="top-bar__gold">
        <img src={itemAssets.gold} alt="" />
        <span>{gold}</span>
      </div>
      <div className="top-bar__relics" aria-label="遗物">
        {visibleRelics.map((relic) => (
          <img
            key={relic.id}
            className={triggeredRelicIds.includes(relic.id) ? "is-triggered" : ""}
            src={relic.image}
            alt={relic.name}
            title={`${relic.name}${relic.description ? ` - ${relic.description}` : ""}`}
          />
        ))}
        {hiddenCount > 0 ? <span className="top-bar__more">+{hiddenCount}</span> : null}
      </div>
      <button className="top-bar__settings" type="button" title="设置" onClick={onSettings} aria-label="设置">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M10.5 3h3l.45 2.45c.46.16.9.34 1.3.55l2.08-1.35 2.12 2.12-1.35 2.08c.21.4.39.84.55 1.3L21 10.5v3l-2.35.45c-.16.46-.34.9-.55 1.3l1.35 2.08-2.12 2.12-2.08-1.35c-.4.21-.84.39-1.3.55L13.5 21h-3l-.45-2.35c-.46-.16-.9-.34-1.3-.55l-2.08 1.35-2.12-2.12 1.35-2.08c-.21-.4-.39-.84-.55-1.3L3 13.5v-3l2.35-.45c.16-.46.34-.9.55-1.3L4.55 6.67l2.12-2.12L8.75 5.9c.4-.21.84-.39 1.3-.55L10.5 3Zm1.5 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
        </svg>
      </button>
    </header>
  );
}
