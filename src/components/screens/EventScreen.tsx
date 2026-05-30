import { sceneAssets } from "../assets/gameAssets";

type EventChoice = {
  id: string;
  label: string;
  disabledReason?: string;
  tone?: "danger" | "reward" | "neutral";
};

type EventScreenProps = {
  title: string;
  body: string;
  choices: EventChoice[];
  screenTransitionKey?: string | number;
  onChoose?: (choice: EventChoice) => void;
};

export function EventScreen({ title, body, choices, screenTransitionKey, onChoose }: EventScreenProps) {
  return (
    <section className="event-view screen-fill room-enter" key={screenTransitionKey}>
      <div className="event-art" style={{ backgroundImage: `linear-gradient(rgba(10,9,8,.12), rgba(10,9,8,.48)), url(${sceneAssets.event})` }} />
      <article className="event-panel">
        <h1>{title}</h1>
        <p>{body}</p>
        <div className="event-choices">
          {choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              className={`event-choice event-choice--${choice.tone ?? "neutral"}`}
              disabled={Boolean(choice.disabledReason)}
              onClick={() => onChoose?.(choice)}
              title={choice.disabledReason}
            >
              {choice.label}
              {choice.disabledReason ? <span>{choice.disabledReason}</span> : null}
            </button>
          ))}
        </div>
      </article>
    </section>
  );
}
