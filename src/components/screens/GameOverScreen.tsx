import { sceneAssets } from "../assets/gameAssets";
import { GameButton } from "../ui/GameButton";
import { GameCard } from "../ui/GameCard";
import type { UiCard } from "../ui/types";

type GameOverScreenProps = {
  result: "victory" | "defeat";
  floor: number;
  kills: number;
  relicCount: number;
  deck: UiCard[];
  screenTransitionKey?: string | number;
  onNewRun?: () => void;
  onMapOverview?: () => void;
};

export function GameOverScreen({ result, floor, kills, relicCount, deck, screenTransitionKey, onNewRun, onMapOverview }: GameOverScreenProps) {
  return (
    <section className={`gameover-view gameover-view--${result} screen-fill room-enter`} key={screenTransitionKey} style={{ backgroundImage: `linear-gradient(rgba(10,9,8,.34), rgba(10,9,8,.78)), url(${sceneAssets.gameOver})` }}>
      <div className="gameover-panel">
        <h1>{result === "victory" ? "通关胜利" : "你倒下了"}</h1>
        <div className="run-summary">
          <span><b>{floor}</b>楼层</span>
          <span><b>{kills}</b>击杀</span>
          <span><b>{relicCount}</b>遗物</span>
          <span><b>{deck.length}</b>卡组</span>
        </div>
        <div className="final-deck-preview">
          {deck.map((card) => <GameCard key={card.id} card={card} size="small" />)}
        </div>
        <div className="screen-actions">
          <GameButton variant="primary" onClick={onNewRun}>再来一局</GameButton>
          <GameButton variant="secondary" onClick={onMapOverview}>返回地图概览</GameButton>
        </div>
      </div>
    </section>
  );
}
