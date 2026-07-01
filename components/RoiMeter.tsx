"use client";

import { motion } from "framer-motion";

type RoiMeterProps = {
  score: number;
  size?: number;
};

function scoreColor(score: number): string {
  if (score >= 75) return "#78FFD6";
  if (score >= 55) return "#52D7FF";
  if (score >= 40) return "#FFC857";
  return "#FF4D8D";
}

export default function RoiMeter({ score, size = 240 }: RoiMeterProps) {
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = scoreColor(score);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 240 240" width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="meterGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A9F6FF" />
            <stop offset="55%" stopColor={color} />
            <stop offset="100%" stopColor="#B8A7FF" />
          </linearGradient>
          <filter id="meterGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* track */}
        <circle
          cx="120"
          cy="120"
          r={radius}
          fill="none"
          stroke="rgba(200,211,223,0.1)"
          strokeWidth="10"
        />
        {/* tick marks */}
        {Array.from({ length: 40 }).map((_, i) => {
          const angle = (i / 40) * 2 * Math.PI;
          const x1 = 120 + Math.cos(angle) * 86;
          const y1 = 120 + Math.sin(angle) * 86;
          const x2 = 120 + Math.cos(angle) * 80;
          const y2 = 120 + Math.sin(angle) * 80;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(169,246,255,0.25)"
              strokeWidth="1"
            />
          );
        })}
        {/* progress arc */}
        <motion.circle
          cx="120"
          cy="120"
          r={radius}
          fill="none"
          stroke="url(#meterGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          filter="url(#meterGlow)"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      {/* center readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="font-display text-6xl font-bold tabular-nums"
          style={{ color, textShadow: `0 0 30px ${color}66` }}
        >
          {score}
        </motion.span>
        <span className="mt-1 text-[10px] font-medium tracking-[0.3em] text-muted uppercase">
          Caffeine ROI
        </span>
      </div>
      {/* ambient pulse ring */}
      <div
        className="meter-pulse absolute inset-4 -z-10 rounded-full blur-2xl"
        style={{ background: `${color}22` }}
      />
    </div>
  );
}
