import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import type { ButtonVariant } from "./types";

type GameButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
  }
>;

export function GameButton({ variant = "secondary", className = "", children, ...props }: GameButtonProps) {
  return (
    <button className={`game-button game-button--${variant} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
