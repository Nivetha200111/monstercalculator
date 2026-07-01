import type { CaffeineInput } from "@/types/caffeine";

export const defaultInput: CaffeineInput = {
  wakeTime: "07:00",
  sleepTime: "23:30",
  currentTime: "12:40",
  focusStart: "14:00",
  focusEnd: "17:00",
  energyLevel: 4,
  caffeineConsumedMg: 80,
  drinkCaffeineMg: 150,
  drinkCost: 112,
  sensitivity: "normal",
  goal: "deep_work",
};

/** Demo scenario tuned to produce a high-ROI "drink at 1:20 PM" style result. */
export const demoInput: CaffeineInput = {
  wakeTime: "07:00",
  sleepTime: "23:30",
  currentTime: "13:20",
  focusStart: "14:00",
  focusEnd: "17:00",
  energyLevel: 3,
  caffeineConsumedMg: 0,
  drinkCaffeineMg: 150,
  drinkCost: 112,
  sensitivity: "normal",
  goal: "deep_work",
};

export const SENSITIVITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "anxiety", label: "Anxiety-prone" },
] as const;

export const GOAL_OPTIONS = [
  { value: "deep_work", label: "Deep Work" },
  { value: "exam_prep", label: "Exam Prep" },
  { value: "workout", label: "Workout" },
  { value: "office", label: "Survive Office" },
  { value: "creative", label: "Creative Work" },
] as const;
