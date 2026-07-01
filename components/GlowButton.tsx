"use client";

type GlowButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  className?: string;
  type?: "button" | "submit";
};

export default function GlowButton({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
}: GlowButtonProps) {
  if (variant === "ghost") {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`rounded-full border border-chrome/25 bg-panel/60 px-7 py-3.5 font-display text-sm font-medium tracking-wide text-chrome backdrop-blur-md transition hover:border-ice/50 hover:text-frost hover:shadow-[0_0_30px_-10px_rgba(169,246,255,0.6)] ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`glow-button rounded-full bg-gradient-to-r from-electric/20 via-panel to-ultraviolet/20 px-8 py-3.5 font-display text-sm font-semibold tracking-wide text-frost ${className}`}
    >
      {children}
    </button>
  );
}
