import type {
  CaffeineInput,
  CaffeineRecommendation,
  Recommendation,
  RiskLevel,
  Sensitivity,
} from "@/types/caffeine";
import { toTimeline, formatMinutes, formatDuration } from "./timeUtils";

const CUTOFF_HOURS: Record<Sensitivity, number> = {
  low: 5,
  normal: 6,
  high: 8,
  anxiety: 9,
};

const SENSITIVITY_PENALTY: Record<Sensitivity, number> = {
  low: 0,
  normal: 0,
  high: 6,
  anxiety: 12,
};

const BEST_LEAD_MINUTES = 40; // drink ~40 min before the focus window opens
const DAILY_CAFFEINE_BUDGET_MG = 250;
const BASE_SCORE = 30;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function calculateCaffeineRoi(input: CaffeineInput): CaffeineRecommendation {
  const wake = input.wakeTime;
  const now = toTimeline(input.currentTime, wake);
  const sleep = toTimeline(input.sleepTime, wake);
  const focusStart = toTimeline(input.focusStart, wake);
  const focusEnd = toTimeline(input.focusEnd, wake);

  const bestDrinkTime = focusStart - BEST_LEAD_MINUTES;
  const doNotDrinkAfter = sleep - CUTOFF_HOURS[input.sensitivity] * 60;
  const deltaFromBest = now - bestDrinkTime; // negative = early, positive = late

  // Focus alignment: full marks within ±30 min of the ideal sip, fading to 0 at 3 hours off.
  const offBy = Math.abs(deltaFromBest);
  let focusAlignmentScore: number;
  if (now >= focusEnd) {
    focusAlignmentScore = 0; // the focus window is already gone
  } else if (offBy <= 30) {
    focusAlignmentScore = 35;
  } else {
    focusAlignmentScore = clamp(35 * (1 - (offBy - 30) / 150), 0, 35);
  }

  // Energy need: low energy + a focus block still ahead = caffeine actually has a job to do.
  const focusAhead = now < focusEnd;
  const energyGap = (10 - input.energyLevel) * 2; // 0–18
  const energyNeedScore = focusAhead ? clamp(energyGap, 0, 20) : clamp(energyGap * 0.3, 0, 6);

  // Timing bonus for hitting the sweet spot almost exactly.
  const timingBonus = deltaFromBest >= -10 && deltaFromBest <= 15 ? 10 : 0;

  // Sleep risk: ramps up in the 90 minutes before the cutoff, harsh after it.
  const overshoot = now - doNotDrinkAfter;
  let sleepRiskPenalty: number;
  let sleepRisk: RiskLevel;
  if (overshoot >= 0) {
    sleepRiskPenalty = clamp(28 + overshoot / 6, 28, 50);
    sleepRisk = "High";
  } else if (overshoot >= -90) {
    sleepRiskPenalty = clamp(15 * (1 + overshoot / 90), 0, 15);
    sleepRisk = "Medium";
  } else {
    sleepRiskPenalty = 0;
    sleepRisk = "Low";
  }

  // Caffeine load: everything past the daily budget costs points.
  const totalCaffeine = input.caffeineConsumedMg + input.drinkCaffeineMg;
  const caffeineLoadPenalty = clamp((totalCaffeine - DAILY_CAFFEINE_BUDGET_MG) * 0.12, 0, 30);

  const sensitivityPenalty = SENSITIVITY_PENALTY[input.sensitivity];

  const preliminaryScore =
    BASE_SCORE +
    focusAlignmentScore +
    energyNeedScore +
    timingBonus -
    sleepRiskPenalty -
    caffeineLoadPenalty -
    sensitivityPenalty;

  // Money waste: a low-ROI can gets pushed further down so "skip" is unambiguous.
  const moneyWastePenalty = preliminaryScore < 45 ? 8 : 0;

  const roiScore = Math.round(clamp(preliminaryScore - moneyWastePenalty, 0, 100));

  let recommendation: Recommendation;
  if (roiScore >= 75) recommendation = "DRINK_NOW";
  else if (roiScore >= 55) recommendation = "WAIT";
  else if (roiScore >= 40) recommendation = "HALF_CAN";
  else recommendation = "SKIP";

  // If it's still clearly early and waiting is safe, waiting beats drinking now —
  // the peak would land before the focus window even opens.
  const waitMinutes = Math.max(0, bestDrinkTime - now);
  const waitingIsViable = bestDrinkTime <= doNotDrinkAfter && waitMinutes > 0;
  if (recommendation === "DRINK_NOW" && waitMinutes > 25 && waitingIsViable) {
    recommendation = "WAIT";
  }

  const focusPayoff: RiskLevel =
    focusAlignmentScore >= 25 ? "High" : focusAlignmentScore >= 12 ? "Medium" : "Low";

  const windowClosed = bestDrinkTime > doNotDrinkAfter;
  const bestWindowStart = bestDrinkTime;
  const bestWindowEnd = Math.min(bestDrinkTime + 25, doNotDrinkAfter);

  const cost = input.drinkCost;
  let moneyInsight: string;
  let explanation: string;

  switch (recommendation) {
    case "DRINK_NOW":
      moneyInsight = `₹${cost} well spent — this can lands on peak focus.`;
      explanation = `Drink now. Caffeine peaks in ~40 minutes, right as your focus window ${
        now >= focusStart ? "is running" : "opens"
      }. Sleep risk is ${sleepRisk.toLowerCase()}, so this timing gives maximum payoff.`;
      break;
    case "WAIT":
      moneyInsight = `Same ₹${cost}, more focus — timing is the free upgrade.`;
      explanation =
        waitMinutes > 0
          ? `Wait ${formatDuration(waitMinutes)}. Drinking now wastes the peak. Best window: ${formatMinutes(
              bestWindowStart
            )}–${formatMinutes(bestWindowEnd)}.`
          : `Hold briefly — you're near the edge of the ideal window (${formatMinutes(
              bestWindowStart
            )}–${formatMinutes(bestWindowEnd)}).`;
      break;
    case "HALF_CAN":
      moneyInsight = `Half-can strategy: save ₹${Math.round(cost / 2)} and the rest of your tolerance.`;
      explanation = `Half-can strategy recommended. You need a lift, but ${
        sleepRisk !== "Low"
          ? "sleep risk is climbing"
          : totalCaffeine > DAILY_CAFFEINE_BUDGET_MG
            ? "your caffeine load is already high"
            : "a full can has poor ROI today"
      } — ${input.drinkCaffeineMg / 2} mg gets the job done.`;
      break;
    case "SKIP":
      moneyInsight = `Skip it. Save ₹${cost} and protect tonight's sleep.`;
      explanation =
        sleepRisk === "High"
          ? `Skip. It's past your ${formatMinutes(doNotDrinkAfter)} cutoff — this can trades tonight's sleep for very little focus.`
          : `Skip. This is a low-ROI can${
              totalCaffeine > DAILY_CAFFEINE_BUDGET_MG ? " on top of an already loaded system" : ""
            }. Save ₹${cost} and come back at full receptor sensitivity.`;
      break;
  }

  const moneySaved =
    recommendation === "SKIP" ? cost : recommendation === "HALF_CAN" ? Math.round(cost / 2) : 0;

  return {
    roiScore,
    recommendation,
    bestDrinkTime: formatMinutes(bestDrinkTime),
    doNotDrinkAfter: formatMinutes(doNotDrinkAfter),
    sleepRisk,
    focusPayoff,
    moneyInsight,
    explanation,
    waitMinutes: Math.round(waitMinutes),
    moneySaved,
    bestWindowStart: formatMinutes(bestWindowStart),
    bestWindowEnd: formatMinutes(bestWindowEnd),
    windowClosed,
  };
}

/**
 * Caffeine concentration curve for the dashboard graph.
 * One-compartment absorption/elimination: fast uptake (~45 min to peak),
 * ~5 h elimination half-life. Output is normalized so a dose's peak ≈ dose mg.
 */
const KA = 0.055; // absorption rate per minute
const KE = Math.LN2 / 300; // elimination rate per minute (5 h half-life)
const PEAK_NORMALIZER = (() => {
  const tPeak = Math.log(KA / KE) / (KA - KE);
  return Math.exp(-KE * tPeak) - Math.exp(-KA * tPeak);
})();

export function doseConcentration(doseMg: number, minutesSinceDose: number): number {
  if (minutesSinceDose <= 0) return 0;
  return (
    (doseMg / PEAK_NORMALIZER) *
    (Math.exp(-KE * minutesSinceDose) - Math.exp(-KA * minutesSinceDose))
  );
}

export type CurvePoint = { t: number; mg: number };

/** Samples the combined curve of prior caffeine + the proposed drink across the day. */
export function buildCurve(
  input: CaffeineInput,
  drinkAtTimeline: number,
  from: number,
  to: number,
  halfCan: boolean
): CurvePoint[] {
  const wake = input.wakeTime;
  const now = toTimeline(input.currentTime, wake);
  // Prior caffeine is modeled as a single dose ~90 min ago (V1 simplification).
  const priorDoseAt = now - 90;
  const dose = halfCan ? input.drinkCaffeineMg / 2 : input.drinkCaffeineMg;

  const points: CurvePoint[] = [];
  const step = 10;
  for (let t = from; t <= to; t += step) {
    const mg =
      doseConcentration(input.caffeineConsumedMg, t - priorDoseAt) +
      doseConcentration(dose, t - drinkAtTimeline);
    points.push({ t, mg });
  }
  return points;
}
