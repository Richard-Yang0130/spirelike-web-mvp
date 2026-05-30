import { sceneAssets } from "../assets/gameAssets";
import { GameButton } from "../ui/GameButton";
import { GameCard } from "../ui/GameCard";
import type { UiCard, UiRelic } from "../ui/types";

type ShopRelic = UiRelic & {
  price: number;
  sold?: boolean;
};

type ShopScreenProps = {
  cards: UiCard[];
  relics: ShopRelic[];
  removePrice: number;
  screenTransitionKey?: string | number;
  onBuyCard?: (card: UiCard) => void;
  onBuyRelic?: (relic: ShopRelic) => void;
  onRemoveCard?: () => void;
  onLeave?: () => void;
};

export function ShopScreen({ cards, relics, removePrice, screenTransitionKey, onBuyCard, onBuyRelic, onRemoveCard, onLeave }: ShopScreenProps) {
  return (
    <section className="shop-view screen-fill room-enter" key={screenTransitionKey} style={{ backgroundImage: `linear-gradient(rgba(10,9,8,.45), rgba(10,9,8,.72)), url(${sceneAssets.shop})` }}>
      <div className="shop-column shop-column--cards">
        <h1>商店</h1>
        <div className="shop-card-grid">
          {cards.map((card) => <GameCard key={card.id} card={card} size="reward" onClick={onBuyCard} />)}
        </div>
      </div>
      <div className="shop-column">
        <h2>遗物</h2>
        <div className="shop-relic-grid">
          {relics.map((relic) => (
            <button key={relic.id} type="button" className={`shop-relic ${relic.sold ? "is-sold" : ""}`} onClick={() => onBuyRelic?.(relic)} disabled={relic.sold}>
              <img src={relic.image} alt="" />
              <strong>{relic.name}</strong>
              <span>{relic.price}</span>
            </button>
          ))}
        </div>
      </div>
      <aside className="shop-services">
        <button className="remove-service" type="button" onClick={onRemoveCard}>
          <span>删除一张牌</span>
          <strong>{removePrice}</strong>
        </button>
        <GameButton variant="secondary" onClick={onLeave}>离开商店</GameButton>
      </aside>
    </section>
  );
}
