import type { UiCard } from "./types";

type GameCardProps = {
  card: UiCard;
  size?: "hand" | "reward" | "small";
  className?: string;
  onClick?: (card: UiCard) => void;
};

export function GameCard({ card, size = "hand", className = "", onClick }: GameCardProps) {
  const isPlayable = card.playable !== false;
  const actionLabel = card.actionLabel ?? card.fxKey ?? card.type;
  const actionTexture = card.actionTexture ?? card.art;

  return (
    <button
      type="button"
      className={[
        "game-card",
        `game-card--${size}`,
        `game-card--${card.type}`,
        card.selected ? "is-selected" : "",
        isPlayable ? "is-playable" : "",
        !isPlayable ? "is-unplayable" : "",
        card.upgraded ? "is-upgraded" : "",
        card.animating ? `is-${card.animating}` : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => onClick?.(card)}
      aria-pressed={card.selected}
    >
      <span className="game-card__cost">{card.cost}</span>
      <span className="game-card__action" title={actionLabel}>
        <img src={actionTexture} alt="" />
        <b>{actionLabel}</b>
      </span>
      <span className="game-card__title">
        {card.name}
        {card.upgraded ? <b>+</b> : null}
      </span>
      <span className="game-card__art" style={{ backgroundImage: `url(${card.art})` }} />
      <span className="game-card__rules">{card.description}</span>
      <span className="game-card__meta">
        <span>{card.type}</span>
        <span>{card.rarity}</span>
      </span>
      {typeof card.price === "number" ? <span className="game-card__price">{card.price}</span> : null}
    </button>
  );
}
