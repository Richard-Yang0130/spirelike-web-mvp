import { sceneAssets } from "../assets/gameAssets";
import { GameButton } from "../ui/GameButton";

type IntroScreenProps = {
  onStart?: () => void;
};

const rules = [
  "在地图上选择路线，每个节点会带来战斗、事件、商店、休息或宝箱。",
  "每回合使用有限能量打出手牌，攻击敌人或为自己叠加格挡。",
  "观察敌人头顶意图，在防御和进攻之间做取舍。",
  "战斗胜利后选择卡牌、金币或遗物奖励，让牌组逐步成型。",
  "一路攀至第 12 层，击败 Boss 完成一幕爬塔。",
];

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <section className="intro-screen screen-fill" style={{ backgroundImage: `linear-gradient(90deg, rgba(10,9,8,.88), rgba(10,9,8,.44)), url(${sceneAssets.map})` }}>
      <div className="intro-panel">
        <h1>开始攀塔前</h1>
        <p>这是一局单人卡牌爬塔。路线、手牌、能量和敌人意图会共同决定每一回合的风险。</p>
        <ol>
          {rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ol>
        <GameButton variant="primary" onClick={onStart}>开始攀塔</GameButton>
      </div>
      <img className="intro-spire" src={sceneAssets.introSpire} alt="" />
    </section>
  );
}
