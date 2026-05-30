import { cardFxTextureAssets } from "../assets/gameAssets";
import type { UiCardAnimation, UiCardFx } from "./types";

type CardFxLayerProps = {
  currentCardAnimation?: UiCardAnimation | null;
  currentCardFx?: UiCardFx | null;
};

const toneByFxToken: Array<[string, string]> = [
  ["vulnerable", "vulnerable"],
  ["weak", "weak"],
  ["flame", "flame"],
  ["guard", "guard"],
  ["block", "guard"],
  ["draw", "draw"],
  ["energy", "energy"],
  ["warcry", "warcry"],
  ["shout", "warcry"],
  ["heavy", "heavy"],
  ["crush", "heavy"],
  ["slam", "heavy"],
  ["bludgeon", "heavy"],
  ["twin", "multi"],
  ["multi", "multi"],
  ["cleave", "multi"],
  ["exhaust", "exhaust"],
  ["ash", "exhaust"],
  ["power", "power"],
  ["strength", "power"],
  ["demon", "power"],
  ["echo", "power"],
  ["skill", "skill"],
];

function toneForFx(fx?: UiCardAnimation | UiCardFx | null): keyof typeof cardFxTextureAssets {
  if (fx?.triggeredSkillFx === "burst-attack") return "skillBurst";
  if (fx?.triggeredSkillFx === "guard-counter") return "skillGuard";
  if (fx?.triggeredSkillFx === "flow-engine") return "skillFlow";
  if ((fx as UiCardFx | null)?.tone) return toneToTextureKey((fx as UiCardFx).tone!);

  const key = `${fx?.fxKey ?? ""} ${fx?.impactClass ?? ""}`.toLowerCase();
  const match = toneByFxToken.find(([token]) => key.includes(token));
  return toneToTextureKey(match?.[1] ?? "slash");
}

function toneToTextureKey(tone: string): keyof typeof cardFxTextureAssets {
  if (tone === "slash") return "blade";
  if (tone === "skill") return "skillFlow";
  return (tone in cardFxTextureAssets ? tone : "blade") as keyof typeof cardFxTextureAssets;
}

export function CardFxLayer({ currentCardAnimation, currentCardFx }: CardFxLayerProps) {
  const fx = currentCardFx ?? currentCardAnimation;
  if (!fx) return null;

  const textureKey = toneForFx(fx);
  const motion = currentCardFx?.targetMotion ?? currentCardAnimation?.targetMotion ?? "single";
  const label = fx.label ?? fx.shortLabel ?? fx.fxKey ?? "card effect";
  const texture = fx.texture ?? cardFxTextureAssets[textureKey];
  const fxId = "id" in fx ? fx.id : undefined;
  const eventKey = `${fx.cardUuid ?? fxId ?? fx.fxKey ?? "card"}-${fx.eventId ?? 0}`;

  return (
    <div key={eventKey} className={`card-fx-layer card-fx-layer--${motion}`} aria-hidden="true">
      <span
        className={[
          "card-fx",
          `card-fx--${textureKey}`,
          `card-fx-motion--${motion}`,
          fx.impactClass ?? "",
          fx.triggeredSkillFx ? `card-fx--starter-${fx.triggeredSkillFx}` : "",
        ].filter(Boolean).join(" ")}
      >
        <img className="card-fx__texture" src={texture} alt="" />
        <span className="card-fx__echo" />
        <span className="card-fx__label">{label}</span>
      </span>
    </div>
  );
}
