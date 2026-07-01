type MetricChipProps = {
  label: string;
  value: string;
  tone?: "cyan" | "violet" | "mint" | "amber" | "danger" | "neutral";
  sub?: string;
};

const TONE_STYLES: Record<NonNullable<MetricChipProps["tone"]>, string> = {
  cyan: "border-electric/30 text-electric shadow-[0_0_30px_-12px_rgba(82,215,255,0.7)]",
  violet: "border-ultraviolet/30 text-ultraviolet shadow-[0_0_30px_-12px_rgba(184,167,255,0.7)]",
  mint: "border-mint/30 text-mint shadow-[0_0_30px_-12px_rgba(120,255,214,0.7)]",
  amber: "border-amber/30 text-amber shadow-[0_0_30px_-12px_rgba(255,200,87,0.7)]",
  danger: "border-danger/30 text-danger shadow-[0_0_30px_-12px_rgba(255,77,141,0.7)]",
  neutral: "border-chrome/20 text-chrome",
};

export default function MetricChip({ label, value, tone = "neutral", sub }: MetricChipProps) {
  return (
    <div
      className={`glass flex flex-col gap-1 rounded-2xl border px-4 py-3 ${TONE_STYLES[tone]}`}
    >
      <span className="text-[10px] font-medium tracking-[0.18em] text-muted uppercase">
        {label}
      </span>
      <span className="font-display text-lg font-semibold tabular-nums">{value}</span>
      {sub && <span className="text-xs text-muted">{sub}</span>}
    </div>
  );
}
