"use client";

import { motion } from "framer-motion";
import type { CaffeineInput, Goal, Sensitivity } from "@/types/caffeine";
import { GOAL_OPTIONS, SENSITIVITY_OPTIONS } from "@/lib/sampleData";
import GlowButton from "./GlowButton";

type InputConsoleProps = {
  input: CaffeineInput;
  onChange: (input: CaffeineInput) => void;
  onCalculate: () => void;
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-medium tracking-[0.2em] text-muted uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}

function ChipGroup<T extends string>({
  options,
  value,
  onSelect,
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onSelect: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onSelect(opt.value)}
          className={`rounded-full border px-4 py-1.5 font-display text-xs font-medium tracking-wide transition ${
            value === opt.value
              ? "border-electric/70 bg-electric/15 text-ice shadow-[0_0_20px_-6px_rgba(82,215,255,0.8)]"
              : "border-chrome/20 bg-void/50 text-muted hover:border-chrome/40 hover:text-chrome"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function InputConsole({ input, onChange, onCalculate }: InputConsoleProps) {
  const set = <K extends keyof CaffeineInput>(key: K, value: CaffeineInput[K]) =>
    onChange({ ...input, [key]: value });

  const num = (value: string) => (value === "" ? 0 : Number(value));

  return (
    <motion.section
      id="console"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8 }}
      className="mx-auto w-full max-w-4xl px-6 py-12"
    >
      <div className="glass-bright rounded-3xl p-6 md:p-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-frost md:text-3xl">
              Input Console
            </h2>
            <p className="mt-1 text-sm text-muted">
              Feed the oracle. Get your verdict.
            </p>
          </div>
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-danger/80 shadow-[0_0_10px_rgba(255,77,141,0.8)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber/80 shadow-[0_0_10px_rgba(255,200,87,0.8)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-mint/80 shadow-[0_0_10px_rgba(120,255,214,0.8)]" />
          </div>
        </div>

        {/* time grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-5">
          <Field label="Wake time">
            <input
              type="time"
              className="console-input"
              value={input.wakeTime}
              onChange={(e) => set("wakeTime", e.target.value)}
            />
          </Field>
          <Field label="Sleep time">
            <input
              type="time"
              className="console-input"
              value={input.sleepTime}
              onChange={(e) => set("sleepTime", e.target.value)}
            />
          </Field>
          <Field label="Current time">
            <input
              type="time"
              className="console-input"
              value={input.currentTime}
              onChange={(e) => set("currentTime", e.target.value)}
            />
          </Field>
          <Field label="Focus start">
            <input
              type="time"
              className="console-input"
              value={input.focusStart}
              onChange={(e) => set("focusStart", e.target.value)}
            />
          </Field>
          <Field label="Focus end">
            <input
              type="time"
              className="console-input"
              value={input.focusEnd}
              onChange={(e) => set("focusEnd", e.target.value)}
            />
          </Field>
        </div>

        {/* energy slider */}
        <div className="mt-8">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-[10px] font-medium tracking-[0.2em] text-muted uppercase">
              Current energy level
            </span>
            <span className="font-display text-xl font-bold text-ice tabular-nums">
              {input.energyLevel}
              <span className="text-sm text-muted">/10</span>
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={input.energyLevel}
            onChange={(e) => set("energyLevel", Number(e.target.value))}
            className="energy-slider"
          />
          <div className="mt-1.5 flex justify-between text-[10px] tracking-wider text-muted uppercase">
            <span>Running on fumes</span>
            <span>Fully charged</span>
          </div>
        </div>

        {/* dose + cost */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-5">
          <Field label="Caffeine already today (mg)">
            <input
              type="number"
              min={0}
              className="console-input"
              value={input.caffeineConsumedMg}
              onChange={(e) => set("caffeineConsumedMg", num(e.target.value))}
            />
          </Field>
          <Field label="Drink caffeine (mg)">
            <input
              type="number"
              min={0}
              className="console-input"
              value={input.drinkCaffeineMg}
              onChange={(e) => set("drinkCaffeineMg", num(e.target.value))}
            />
          </Field>
          <Field label="Drink cost (₹)">
            <input
              type="number"
              min={0}
              className="console-input"
              value={input.drinkCost}
              onChange={(e) => set("drinkCost", num(e.target.value))}
            />
          </Field>
        </div>

        {/* sensitivity + goal chips */}
        <div className="mt-8 flex flex-col gap-6">
          <div>
            <span className="mb-2.5 block text-[10px] font-medium tracking-[0.2em] text-muted uppercase">
              Caffeine sensitivity
            </span>
            <ChipGroup<Sensitivity>
              options={SENSITIVITY_OPTIONS}
              value={input.sensitivity}
              onSelect={(v) => set("sensitivity", v)}
            />
          </div>
          <div>
            <span className="mb-2.5 block text-[10px] font-medium tracking-[0.2em] text-muted uppercase">
              Mission goal
            </span>
            <ChipGroup<Goal>
              options={GOAL_OPTIONS}
              value={input.goal}
              onSelect={(v) => set("goal", v)}
            />
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <GlowButton onClick={onCalculate} className="w-full sm:w-auto">
            ⚡ Run the Oracle
          </GlowButton>
        </div>
      </div>
    </motion.section>
  );
}
