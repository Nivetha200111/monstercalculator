"use client";

import { motion } from "framer-motion";
import type { CaffeineInput, CaffeineRecommendation } from "@/types/caffeine";
import { buildCurve } from "@/lib/caffeineCalculator";
import { toTimeline, formatMinutes } from "@/lib/timeUtils";

type CaffeineCurveProps = {
  input: CaffeineInput;
  result: CaffeineRecommendation;
};

const W = 800;
const H = 300;
const PAD_X = 48;
const PAD_TOP = 30;
const PAD_BOTTOM = 44;

export default function CaffeineCurve({ input, result }: CaffeineCurveProps) {
  const wake = toTimeline(input.wakeTime, input.wakeTime);
  const now = toTimeline(input.currentTime, input.wakeTime);
  const sleep = toTimeline(input.sleepTime, input.wakeTime);
  const focusStart = toTimeline(input.focusStart, input.wakeTime);
  const focusEnd = toTimeline(input.focusEnd, input.wakeTime);

  const from = wake;
  const to = sleep + 60;

  // The curve assumes you sip at the recommended moment (now if DRINK_NOW, else best time).
  const halfCan = result.recommendation === "HALF_CAN";
  const skip = result.recommendation === "SKIP";
  const drinkAt =
    result.recommendation === "DRINK_NOW" || result.recommendation === "HALF_CAN"
      ? now
      : now + result.waitMinutes;

  const points = buildCurve(input, skip ? Number.POSITIVE_INFINITY : drinkAt, from, to, halfCan);
  const maxMg = Math.max(120, ...points.map((p) => p.mg)) * 1.15;

  const x = (t: number) => PAD_X + ((t - from) / (to - from)) * (W - PAD_X * 2);
  const y = (mg: number) => PAD_TOP + (1 - mg / maxMg) * (H - PAD_TOP - PAD_BOTTOM);

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(p.t).toFixed(1)},${y(p.mg).toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L${x(to).toFixed(1)},${H - PAD_BOTTOM} L${x(from).toFixed(1)},${H - PAD_BOTTOM} Z`;

  const peak = points.reduce((a, b) => (b.mg > a.mg ? b : a), points[0]);

  // danger zone: after the do-not-drink cutoff
  const cutoff = Math.min(
    to,
    Math.max(from, sleep - { low: 5, normal: 6, high: 8, anxiety: 9 }[input.sensitivity] * 60)
  );

  const hourTicks: number[] = [];
  for (let t = Math.ceil(from / 120) * 120; t <= to; t += 120) hourTicks.push(t);

  return (
    <div className="glass overflow-hidden rounded-3xl p-5 md:p-7">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-lg font-semibold text-frost">
          Caffeine Curve
        </h3>
        <div className="flex flex-wrap gap-4 text-[10px] tracking-wider text-muted uppercase">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-electric" /> Caffeine level
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-ice/40" /> Focus window
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-danger/60" /> Sleep danger zone
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <defs>
          <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#52D7FF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#52D7FF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="curveStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#A9F6FF" />
            <stop offset="60%" stopColor="#52D7FF" />
            <stop offset="100%" stopColor="#B8A7FF" />
          </linearGradient>
          <linearGradient id="dangerFill" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF4D8D" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#FF4D8D" stopOpacity="0.16" />
          </linearGradient>
          <filter id="curveGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* focus window band */}
        <rect
          x={x(focusStart)}
          y={PAD_TOP}
          width={Math.max(0, x(focusEnd) - x(focusStart))}
          height={H - PAD_TOP - PAD_BOTTOM}
          fill="rgba(169,246,255,0.07)"
          stroke="rgba(169,246,255,0.2)"
          strokeDasharray="4 6"
        />
        <text
          x={(x(focusStart) + x(focusEnd)) / 2}
          y={H - PAD_BOTTOM - 10}
          textAnchor="middle"
          fill="#A9F6FF"
          fontSize="10"
          letterSpacing="2"
          opacity="0.8"
        >
          FOCUS WINDOW
        </text>

        {/* sleep danger zone */}
        {cutoff < to && (
          <>
            <rect
              x={x(cutoff)}
              y={PAD_TOP}
              width={x(to) - x(cutoff)}
              height={H - PAD_TOP - PAD_BOTTOM}
              fill="url(#dangerFill)"
            />
            <line
              x1={x(cutoff)}
              y1={PAD_TOP}
              x2={x(cutoff)}
              y2={H - PAD_BOTTOM}
              stroke="#FF4D8D"
              strokeWidth="1"
              strokeDasharray="3 5"
              opacity="0.7"
            />
            <text
              x={x(cutoff) + 6}
              y={PAD_TOP + 16}
              fill="#FF4D8D"
              fontSize="10"
              letterSpacing="2"
              opacity="0.85"
            >
              NO-CAFFEINE ZONE
            </text>
          </>
        )}

        {/* hour grid + labels */}
        {hourTicks.map((t) => (
          <g key={t}>
            <line
              x1={x(t)}
              y1={PAD_TOP}
              x2={x(t)}
              y2={H - PAD_BOTTOM}
              stroke="rgba(200,211,223,0.06)"
            />
            <text
              x={x(t)}
              y={H - PAD_BOTTOM + 18}
              textAnchor="middle"
              fill="#8B98A8"
              fontSize="10"
            >
              {formatMinutes(t).replace(":00 ", "")}
            </text>
          </g>
        ))}

        {/* the curve */}
        <path d={areaPath} fill="url(#curveFill)" />
        <motion.path
          d={linePath}
          fill="none"
          stroke="url(#curveStroke)"
          strokeWidth="2.5"
          filter="url(#curveGlow)"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        />

        {/* peak marker */}
        {!skip && peak.mg > 5 && (
          <g>
            <circle cx={x(peak.t)} cy={y(peak.mg)} r="5" fill="#A9F6FF" filter="url(#curveGlow)" />
            <text
              x={x(peak.t)}
              y={y(peak.mg) - 12}
              textAnchor="middle"
              fill="#A9F6FF"
              fontSize="11"
              fontWeight="600"
            >
              PEAK {formatMinutes(peak.t)}
            </text>
          </g>
        )}

        {/* current time marker */}
        <line
          x1={x(now)}
          y1={PAD_TOP}
          x2={x(now)}
          y2={H - PAD_BOTTOM}
          stroke="#F4F8FF"
          strokeWidth="1.5"
          opacity="0.8"
        />
        <circle cx={x(now)} cy={PAD_TOP} r="3.5" fill="#F4F8FF" />
        <text
          x={x(now)}
          y={H - PAD_BOTTOM + 34}
          textAnchor="middle"
          fill="#F4F8FF"
          fontSize="10"
          fontWeight="600"
          letterSpacing="1"
        >
          NOW
        </text>

        {/* bedtime marker */}
        <text
          x={x(sleep)}
          y={H - PAD_BOTTOM + 34}
          textAnchor="middle"
          fill="#FF4D8D"
          fontSize="10"
          fontWeight="600"
          letterSpacing="1"
        >
          BED
        </text>
      </svg>

      {skip && (
        <p className="mt-2 text-center text-xs text-muted">
          Curve shows your existing caffeine only — the oracle says this can isn&apos;t worth it.
        </p>
      )}
    </div>
  );
}
