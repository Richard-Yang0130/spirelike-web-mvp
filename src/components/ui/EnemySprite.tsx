import { enemyActionAssetByBaseImage } from "../assets/gameAssets";
import type { EnemyAction } from "./types";

type EnemySpriteProps = {
  image: string;
  action?: EnemyAction;
  kind?: "normal" | "elite" | "boss";
  label?: string;
  className?: string;
};

export function EnemySprite({ image, action = "idle", kind = "normal", label = "敌人", className = "" }: EnemySpriteProps) {
  const actionSet = enemyActionAssetByBaseImage[image as keyof typeof enemyActionAssetByBaseImage];
  const sheet = actionSet?.[action];

  if (!sheet) {
    return <img className={`enemy-stand__image ${className}`.trim()} src={image} alt="" />;
  }

  return (
    <span
      className={`enemy-sprite enemy-sprite--${kind} enemy-sprite--${action} ${className}`.trim()}
      role="img"
      aria-label={label}
      style={{ backgroundImage: `url(${sheet})` }}
    />
  );
}
