type HealthBarProps = {
  value: number;
  max: number;
  size?: "player" | "enemy" | "boss";
};

export function HealthBar({ value, max, size = "enemy" }: HealthBarProps) {
  const percent = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));

  return (
    <div className={`health-bar health-bar--${size} ${percent <= 30 ? "is-low" : ""}`}>
      <div className="health-bar__fill" style={{ width: `${percent}%` }} />
      <span className="health-bar__text">
        {value}/{max}
      </span>
    </div>
  );
}
