"use client";

import { motion } from "framer-motion";
import GlowButton from "./GlowButton";

type HeroProps = {
  onCalculate: () => void;
  onDemo: () => void;
};

export default function Hero({ onCalculate, onDemo }: HeroProps) {
  return (
    <section className="relative flex min-h-[92vh] flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
      {/* rotating neon rings behind the capsule */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <svg width="640" height="640" viewBox="0 0 640 640" className="opacity-60 max-md:h-[420px] max-md:w-[420px]">
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#A9F6FF" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#52D7FF" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#B8A7FF" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <g className="ring-spin">
            <circle cx="320" cy="320" r="290" fill="none" stroke="url(#ringGrad)" strokeWidth="1.5" strokeDasharray="40 26" />
          </g>
          <g className="ring-spin-reverse">
            <circle cx="320" cy="320" r="235" fill="none" stroke="url(#ringGrad)" strokeWidth="1" strokeDasharray="8 14" opacity="0.7" />
          </g>
          <circle cx="320" cy="320" r="180" fill="none" stroke="rgba(169,246,255,0.12)" strokeWidth="1" />
        </svg>
      </div>

      {/* floating energy capsule */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="capsule-float relative mb-10"
      >
        <div
          className="relative h-44 w-20 rounded-[2.5rem] md:h-52 md:w-24"
          style={{
            background:
              "linear-gradient(155deg, #ffffff 0%, #e8f1fa 18%, #c8d3df 38%, #7c8a9a 50%, #dfeaf5 64%, #a9f6ff 88%, #52d7ff 100%)",
            boxShadow:
              "0 0 60px rgba(82,215,255,0.55), 0 0 140px rgba(82,215,255,0.25), inset 0 0 24px rgba(255,255,255,0.5)",
          }}
        >
          {/* chrome highlight strip */}
          <div className="absolute top-3 bottom-3 left-2.5 w-2 rounded-full bg-gradient-to-b from-white via-white/40 to-transparent" />
          {/* lightning glyph */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="34" height="52" viewBox="0 0 34 52" fill="none">
              <path
                d="M20 2 6 30h9l-3 20L28 20h-9l1-18z"
                fill="#05070A"
                opacity="0.85"
              />
            </svg>
          </div>
        </div>
        {/* reflection glow under the can */}
        <div className="absolute -bottom-8 left-1/2 h-6 w-32 -translate-x-1/2 rounded-full bg-electric/30 blur-xl" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="mb-5 font-display text-xs font-medium tracking-[0.35em] text-ice/80 uppercase"
      >
        Ultra Oracle · Caffeine Timing Engine
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.9 }}
        className="text-chrome-gradient max-w-4xl font-display text-5xl leading-[1.05] font-bold tracking-tight md:text-7xl"
      >
        Stop wasting caffeine.
        <br />
        <span className="text-glow-cyan">Time it like a weapon.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.9 }}
        className="mt-6 max-w-xl text-base text-muted md:text-lg"
      >
        Calculate the highest-ROI moment to drink your energy drink based on
        focus, sleep risk, and cost.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.9 }}
        className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
      >
        <GlowButton onClick={onCalculate}>⚡ Calculate My Caffeine ROI</GlowButton>
        <GlowButton variant="ghost" onClick={onDemo}>
          View Demo Result
        </GlowButton>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 1 }}
        className="mt-8 text-xs tracking-widest text-muted/70 uppercase"
      >
        Built for people who refuse to waste caffeine.
      </motion.p>

      <div className="shimmer-line absolute bottom-0 left-1/2 h-px w-2/3 -translate-x-1/2" />
    </section>
  );
}
