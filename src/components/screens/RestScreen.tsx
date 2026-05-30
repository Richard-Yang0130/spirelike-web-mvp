import { sceneAssets } from "../assets/gameAssets";
import { GameButton } from "../ui/GameButton";
import { GameCard } from "../ui/GameCard";
import type { UiCard } from "../ui/types";

type RestScreenProps = {
  healAmount: number;
  upgradeCards?: UiCard[];
  mode?: "choose" | "upgrade";
  screenTransitionKey?: string | number;
  onRest?: () => void;
  onUpgradeMode?: () => void;
  onUpgradeCard?: (card: UiCard) => void;
};

export function RestScreen({ healAmount, upgradeCards = [], mode = "choose", screenTransitionKey, onRest, onUpgradeMode, onUpgradeCard }: RestScreenProps) {
  return (
    <section className="rest-view screen-fill room-enter" key={screenTransitionKey} style={{ backgroundImage: `linear-gradient(rgba(10,9,8,.28), rgba(10,9,8,.66)), url(${sceneAssets.rest})` }}>
      <div className="campfire-visual" />
      <div className="rest-choices">
        <button type="button" className="rest-choice" onClick={onRest}>
          <strong>休息</strong>
          <span>+{healAmount} HP</span>
        </button>
        <button type="button" className="rest-choice" onClick={onUpgradeMode}>
          <strong>升级</strong>
          <span>强化 1 张牌</span>
        </button>
      </div>
      {mode === "upgrade" ? (
        <div className="deck-preview">
          {upgradeCards.map((card) => (
            <GameCard key={card.id} card={{ ...card, playable: !card.upgraded }} size="small" onClick={onUpgradeCard} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
