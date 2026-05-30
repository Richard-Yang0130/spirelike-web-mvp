import { sceneAssets, starterSkillPresets } from "../assets/gameAssets";
import { CharacterSprite } from "../ui/CharacterSprite";
import { GameButton } from "../ui/GameButton";
import type { PlayerAction, UiInitialSkill } from "../ui/types";

type InitialSkillScreenProps = {
  skills?: readonly UiInitialSkill[];
  selectedSkillId?: string | null;
  previewAction?: PlayerAction;
  onSelectSkill?: (skill: UiInitialSkill) => void;
  onConfirm?: () => void;
};

export function InitialSkillScreen({
  skills = starterSkillPresets,
  selectedSkillId,
  previewAction = "idle",
  onSelectSkill,
  onConfirm,
}: InitialSkillScreenProps) {
  const selected = skills.find((skill) => skill.id === selectedSkillId) ?? skills[0];
  const actorAction = selectedSkillId ? selected.action : previewAction;

  return (
    <section className="initial-skill-screen screen-fill room-enter" style={{ backgroundImage: `linear-gradient(rgba(10,9,8,.48), rgba(10,9,8,.78)), url(${sceneAssets.battle})` }}>
      <div className="initial-skill-stage">
        <CharacterSprite action={actorAction} label="默认角色动作预览" className="character-sprite--showcase" />
        <div className="skill-stage-caption">
          <strong>{selected.name}</strong>
          <span>{selected.visualAction}</span>
        </div>
      </div>
      <div className="initial-skill-panel">
        <h1>选择初始技能</h1>
        <p>开局技能会定义你的第一套牌组节奏。选择一种触发方式后再开始攀塔。</p>
        <div className="initial-skill-list">
          {skills.map((skill) => (
            <button
              key={skill.id}
              type="button"
              className={`initial-skill-card ${skill.id === selectedSkillId ? "is-selected" : ""}`}
              onClick={() => onSelectSkill?.(skill)}
            >
              <img src={skill.image} alt="" />
              <span>
                <strong>{skill.name}</strong>
                <em>{skill.description}</em>
                <small>{skill.trigger}</small>
              </span>
            </button>
          ))}
        </div>
        <GameButton variant="primary" disabled={!selectedSkillId} onClick={onConfirm}>确认技能</GameButton>
      </div>
    </section>
  );
}
