"use client";

import { motion } from "framer-motion";
import type { CaffeineInput, CaffeineRecommendation, Recommendation } from "@/types/caffeine";
import RoiMeter from "./RoiMeter";
import MetricChip from "./MetricChip";
import CaffeineCurve from "./CaffeineCurve";

type ResultDashboardProps = {
  input: CaffeineInput;
  result: CaffeineRecommendation;
};

const BADGE: Record<
  Recommendation,
  { label: string; emoji: string; classes: string; hex: string }
> = {
  DRINK_NOW: {
    label: "DRINK NOW",
    emoji: "⚡",
    classes: "border-mint/50 bg-mint/10 text-mint shadow-[0_0_40px_-10px_rgba(120,255,214,0.9)]",
    hex: "#78FFD6",
  },
  WAIT: {
    label: "WAIT",
    emoji: "⏳",
    classes:
      "border-electric/50 bg-electric/10 text-electric shadow-[0_0_40px_-10px_rgba(82,215,255,0.9)]",
    hex: "#52D7FF",
  },
  HALF_CAN: {
    label: "HALF CAN",
    emoji: "◐",
    classes: "border-amber/50 bg-amber/10 text-amber shadow-[0_0_40px_-10px_rgba(255,200,87,0.9)]",
    hex: "#FFC857",
  },
  SKIP: {
    label: "SKIP",
    emoji: "🛑",
    classes:
      "border-danger/50 bg-danger/10 text-danger shadow-[0_0_40px_-10px_rgba(255,77,141,0.9)]",
    hex: "#FF4D8D",
  },
};

const riskTone = (risk: "Low" | "Medium" | "High", invert = false) => {
  const good = invert ? risk === "High" : risk === "Low";
  const bad = invert ? risk === "Low" : risk === "High";
  return good ? ("mint" as const) : bad ? ("danger" as const) : ("amber" as const);
};

export default function ResultDashboard({ input, result }: ResultDashboardProps) {
  const badge = BADGE[result.recommendation];

  return (
    <motion.section
      id="results"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mx-auto w-full max-w-5xl px-6 py-12"
    >
      <div className="mb-8 text-center">
        <p className="font-display text-xs tracking-[0.35em] text-ice/70 uppercase">
          The Oracle has spoken
        </p>
        <h2 className="text-chrome-gradient mt-2 font-display text-3xl font-bold md:text-4xl">
          Your Verdict
        </h2>
      </div>

      <motion.div
        className="glass-bright rounded-3xl p-6 md:p-10"
        animate={{ x: [0, -7, 6, -4, 2, 0], y: [0, 3, -2, 1, 0, 0] }}
        transition={{ delay: 1.15, duration: 0.45, ease: "easeOut" }}
      >
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-12">
          {/* meter + badge */}
          <div className="flex shrink-0 flex-col items-center gap-6">
            <RoiMeter score={result.roiScore} />
            <div className="relative">
              {/* shockwave on impact */}
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-full border-2"
                style={{ borderColor: badge.hex }}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: [0.6, 1, 2.4], opacity: [0, 0.8, 0] }}
                transition={{ delay: 1.1, duration: 0.7, times: [0, 0.25, 1], ease: "easeOut" }}
              />
              {/* verdict slam */}
              <motion.div
                initial={{ opacity: 0, scale: 3.2, rotate: -12 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 360, damping: 15, mass: 1.1, delay: 0.85 }}
                className={`rounded-full border-2 px-8 py-3 font-display text-xl font-bold tracking-[0.15em] ${badge.classes}`}
              >
                {badge.emoji} {badge.label}
              </motion.div>
            </div>
          </div>

          {/* verdict details */}
          <div className="flex w-full flex-col gap-5">
            <p className="text-lg leading-relaxed text-frost md:text-xl">
              {result.explanation}
            </p>
            <p className="text-sm text-muted">{result.moneyInsight}</p>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <MetricChip
                label="Best sip window"
                value={result.windowClosed ? "Closed" : result.bestWindowStart}
                sub={result.windowClosed ? "resets tomorrow" : `until ${result.bestWindowEnd}`}
                tone="cyan"
              />
              <MetricChip
                label="No caffeine after"
                value={result.doNotDrinkAfter}
                tone="violet"
              />
              <MetricChip
                label="Sleep risk"
                value={result.sleepRisk}
                tone={riskTone(result.sleepRisk)}
              />
              <MetricChip
                label="Focus payoff"
                value={result.focusPayoff}
                tone={riskTone(result.focusPayoff, true)}
              />
              <MetricChip
                label="Money saved"
                value={result.moneySaved > 0 ? `₹${result.moneySaved}` : "₹0"}
                sub={result.moneySaved > 0 ? "by not overbuying" : "spent on peak focus"}
                tone={result.moneySaved > 0 ? "mint" : "neutral"}
              />
              <MetricChip
                label="Total load today"
                value={`${input.caffeineConsumedMg + (result.recommendation === "SKIP" ? 0 : result.recommendation === "HALF_CAN" ? input.drinkCaffeineMg / 2 : input.drinkCaffeineMg)} mg`}
                tone="neutral"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-6">
        <CaffeineCurve input={input} result={result} />
      </div>
    </motion.section>
  );
}
