import { playerActionAssets } from "../assets/gameAssets";
import type { PlayerAction } from "./types";

type CharacterSpriteProps = {
  action?: PlayerAction;
  label?: string;
  className?: string;
};

export function CharacterSprite({ action = "idle", label = "玩家角色", className = "" }: CharacterSpriteProps) {
  return (
    <span
      className={`character-sprite character-sprite--${action} ${className}`.trim()}
      role="img"
      aria-label={label}
      style={{ backgroundImage: `url(${playerActionAssets[action]})` }}
    />
  );
}
