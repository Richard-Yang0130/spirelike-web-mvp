import { itemAssets } from "../assets/gameAssets";
import { GameButton } from "../ui/GameButton";
import { GameCard } from "../ui/GameCard";
import type { UiCard, UiRelic } from "../ui/types";

type RewardScreenProps = {
  gold: number;
  relic?: UiRelic;
  cards?: UiCard[];
  selectedCardId?: string;
  screenTransitionKey?: string | number;
  onSelectCard?: (card: UiCard) => void;
  onSkip?: () => void;
  onContinue?: () => void;
};

export function RewardScreen({ gold, relic, cards = [], selectedCardId, screenTransitionKey, onSelectCard, onSkip, onContinue }: RewardScreenProps) {
  return (
    <section className="reward-view screen-fill room-enter" key={screenTransitionKey}>
      <div className="reward-panel">
        <h1>战斗胜利</h1>
        <div className="reward-row">
          <div className="reward-chip">
            <img src={itemAssets.gold} alt="" />
            <strong>{gold}</strong>
            <span>金币</span>
          </div>
          {relic ? (
            <div className="reward-chip">
              <img src={relic.image} alt="" />
              <strong>{relic.name}</strong>
              <span>{relic.description}</span>
            </div>
          ) : null}
        </div>
        {cards.length ? (
          <>
            <h2>选择 1 张牌加入牌组</h2>
            <div className="reward-cards">
              {cards.map((card) => (
                <GameCard key={card.id} card={{ ...card, selected: card.id === selectedCardId, animating: "rewardFlip" }} size="reward" onClick={onSelectCard} />
              ))}
            </div>
          </>
        ) : null}
        <div className="screen-actions">
          <GameButton variant="secondary" onClick={onSkip}>跳过奖励</GameButton>
          <GameButton variant="primary" onClick={onContinue}>继续</GameButton>
        </div>
      </div>
    </section>
  );
}
