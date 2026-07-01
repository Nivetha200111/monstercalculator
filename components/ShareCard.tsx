"use client";

import { motion } from "framer-motion";
import type { CaffeineRecommendation, Recommendation } from "@/types/caffeine";

type ShareCardProps = {
  result: CaffeineRecommendation;
};

const BADGE_TEXT: Record<Recommendation, { label: string; color: string }> = {
  DRINK_NOW: { label: "DRINK NOW", color: "#78FFD6" },
  WAIT: { label: "WAIT FOR IT", color: "#52D7FF" },
  HALF_CAN: { label: "HALF CAN", color: "#FFC857" },
  SKIP: { label: "SKIP THIS CAN", color: "#FF4D8D" },
};

export default function ShareCard({ result }: ShareCardProps) {
  const badge = BADGE_TEXT[result.recommendation];

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8 }}
      className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 py-12"
    >
      <p className="font-display text-xs tracking-[0.35em] text-ice/70 uppercase">
        Screenshot-ready
      </p>
      <h2 className="text-chrome-gradient mt-2 mb-8 font-display text-3xl font-bold md:text-4xl">
        Share Card
      </h2>

      {/* the card itself — portrait, social-optimized */}
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-[2rem] border border-ice/25 p-8"
        style={{
          aspectRatio: "4 / 5",
          background:
            "radial-gradient(ellipse 120% 60% at 50% -10%, rgba(82,215,255,0.25), transparent 60%), radial-gradient(ellipse 100% 50% at 80% 110%, rgba(184,167,255,0.2), transparent 60%), linear-gradient(170deg, #090D12, #05070A)",
          boxShadow:
            "0 0 80px -20px rgba(82,215,255,0.45), 0 40px 100px -40px rgba(0,0,0,0.9)",
        }}
      >
        {/* decorative ring */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full border border-ice/15" />
        <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full border border-ultraviolet/20" />
        <div className="noise-overlay pointer-events-none absolute inset-0" />

        <div className="relative flex h-full flex-col">
          {/* brand */}
          <div className="flex items-center justify-between">
            <span className="font-display text-sm font-bold tracking-[0.25em] text-frost">
              CAFFEINE&nbsp;ROI
            </span>
            <span className="text-lg">⚡</span>
          </div>

          {/* score */}
          <div className="mt-auto mb-auto flex flex-col items-center py-6">
            <span
              className="font-display text-[6.5rem] leading-none font-bold tabular-nums"
              style={{ color: badge.color, textShadow: `0 0 50px ${badge.color}80` }}
            >
              {result.roiScore}
            </span>
            <span className="mt-1 text-xs tracking-[0.4em] text-muted uppercase">
              / 100 ROI Score
            </span>
            <span
              className="mt-5 rounded-full border px-6 py-2 font-display text-base font-bold tracking-[0.2em]"
              style={{
                color: badge.color,
                borderColor: `${badge.color}66`,
                background: `${badge.color}14`,
                boxShadow: `0 0 35px -8px ${badge.color}`,
              }}
            >
              {badge.label}
            </span>
          </div>

          {/* stats */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-chrome/15 pt-5 text-left">
            <div>
              <p className="text-[9px] tracking-[0.2em] text-muted uppercase">Best sip time</p>
              <p className="font-display text-sm font-semibold text-ice">
                {result.windowClosed ? "Tomorrow" : result.bestDrinkTime}
              </p>
            </div>
            <div>
              <p className="text-[9px] tracking-[0.2em] text-muted uppercase">No caffeine after</p>
              <p className="font-display text-sm font-semibold text-ultraviolet">
                {result.doNotDrinkAfter}
              </p>
            </div>
            <div>
              <p className="text-[9px] tracking-[0.2em] text-muted uppercase">Sleep risk</p>
              <p className="font-display text-sm font-semibold text-frost">{result.sleepRisk}</p>
            </div>
            <div>
              <p className="text-[9px] tracking-[0.2em] text-muted uppercase">Money saved</p>
              <p className="font-display text-sm font-semibold text-mint">
                ₹{result.moneySaved}
              </p>
            </div>
          </div>

          <p className="mt-5 text-center text-[9px] tracking-[0.3em] text-muted/60 uppercase">
            caffeine-roi · time it like a weapon
          </p>
        </div>
      </div>

      <p className="mt-6 max-w-sm text-center text-xs text-muted">
        Screenshot this card and post it. Export-to-image lands in the next drop.
      </p>
    </motion.section>
  );
}
