"use client";

import type { CaffeineRecommendation } from "@/types/caffeine";

type EnergyTickerProps = {
  result: CaffeineRecommendation | null;
};

const IDLE_ITEMS = [
  "CAFFEINE ROI ENGINE ONLINE",
  "TIME IT LIKE A WEAPON",
  "PEAK FOCUS IS EARNED, NOT BOUGHT",
  "CAFFEINE HALF-LIFE: ~5 HOURS",
  "PEAK HITS ~40 MIN AFTER THE SIP",
  "PROTECT THE SLEEP, KEEP THE EDGE",
  "SAVE THE CAN FOR THE PEAK",
];

export default function EnergyTicker({ result }: EnergyTickerProps) {
  const items = result
    ? [
        `CAFFEINE ROI: ${result.roiScore}/100`,
        `VERDICT: ${result.recommendation.replace("_", " ")}`,
        result.windowClosed
          ? "BEST WINDOW: CLOSED FOR TODAY"
          : `BEST SIP: ${result.bestDrinkTime}`,
        `NO CAFFEINE AFTER: ${result.doNotDrinkAfter}`,
        `SLEEP RISK: ${result.sleepRisk.toUpperCase()}`,
        result.moneySaved > 0
          ? `MONEY SAVED TODAY: ₹${result.moneySaved}`
          : "EVERY RUPEE ON PEAK FOCUS",
        `FOCUS PAYOFF: ${result.focusPayoff.toUpperCase()}`,
      ]
    : IDLE_ITEMS;

  return (
    <div className="relative overflow-hidden border-y border-ice/15 bg-panel/50 py-2.5 backdrop-blur-sm">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-void to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-void to-transparent" />
      <div className="ticker-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {items.map((item, i) => (
              <span
                key={i}
                className="flex items-center font-display text-[11px] font-medium tracking-[0.28em] whitespace-nowrap text-ice/80"
              >
                <span className="px-5 text-electric">⚡</span>
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
