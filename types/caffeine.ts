export type Sensitivity = "low" | "normal" | "high" | "anxiety";

export type Goal = "deep_work" | "exam_prep" | "workout" | "office" | "creative";

export type CaffeineInput = {
  wakeTime: string;
  sleepTime: string;
  currentTime: string;
  focusStart: string;
  focusEnd: string;
  energyLevel: number;
  caffeineConsumedMg: number;
  drinkCaffeineMg: number;
  drinkCost: number;
  sensitivity: Sensitivity;
  goal: Goal;
};

export type Recommendation = "DRINK_NOW" | "WAIT" | "HALF_CAN" | "SKIP";

export type RiskLevel = "Low" | "Medium" | "High";

export type CaffeineRecommendation = {
  roiScore: number;
  recommendation: Recommendation;
  bestDrinkTime: string;
  doNotDrinkAfter: string;
  sleepRisk: RiskLevel;
  focusPayoff: RiskLevel;
  moneyInsight: string;
  explanation: string;
  waitMinutes: number;
  moneySaved: number;
  bestWindowStart: string;
  bestWindowEnd: string;
  /** True when the ideal drink time falls after today's no-caffeine cutoff. */
  windowClosed: boolean;
};
