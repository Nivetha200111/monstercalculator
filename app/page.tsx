"use client";

import { useRef, useState } from "react";
import type { CaffeineInput, CaffeineRecommendation } from "@/types/caffeine";
import { calculateCaffeineRoi } from "@/lib/caffeineCalculator";
import { defaultInput, demoInput } from "@/lib/sampleData";
import AuraBackground from "@/components/AuraBackground";
import Hero from "@/components/Hero";
import InputConsole from "@/components/InputConsole";
import ResultDashboard from "@/components/ResultDashboard";
import ShareCard from "@/components/ShareCard";

export default function Home() {
  const [input, setInput] = useState<CaffeineInput>(defaultInput);
  const [result, setResult] = useState<CaffeineRecommendation | null>(null);
  const [resultInput, setResultInput] = useState<CaffeineInput>(defaultInput);
  const resultsRef = useRef<HTMLDivElement>(null);

  const scrollToConsole = () =>
    document.getElementById("console")?.scrollIntoView({ behavior: "smooth" });

  const runCalculation = (source: CaffeineInput) => {
    setResult(calculateCaffeineRoi(source));
    setResultInput(source);
    // let the dashboard mount before scrolling to it
    requestAnimationFrame(() =>
      setTimeout(
        () => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        60
      )
    );
  };

  const runDemo = () => {
    setInput(demoInput);
    runCalculation(demoInput);
  };

  return (
    <main className="relative min-h-screen">
      <AuraBackground />

      <Hero onCalculate={scrollToConsole} onDemo={runDemo} />

      {/* product explanation strip */}
      <section className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-4 px-6 py-6 sm:grid-cols-3">
        {[
          {
            title: "Focus-aligned",
            body: "Peaks your caffeine exactly when your deep work window opens.",
            icon: "🎯",
          },
          {
            title: "Sleep-protected",
            body: "Computes your personal no-caffeine cutoff from bedtime and sensitivity.",
            icon: "🌙",
          },
          {
            title: "Wallet-aware",
            body: "Tells you when a can is a waste of money — before you buy it.",
            icon: "💸",
          },
        ].map((f) => (
          <div key={f.title} className="glass rounded-2xl p-5">
            <span className="text-2xl">{f.icon}</span>
            <h3 className="mt-2 font-display text-base font-semibold text-frost">{f.title}</h3>
            <p className="mt-1 text-sm text-muted">{f.body}</p>
          </div>
        ))}
      </section>

      <InputConsole
        input={input}
        onChange={setInput}
        onCalculate={() => runCalculation(input)}
      />

      <div ref={resultsRef}>
        {result && (
          <>
            <ResultDashboard input={resultInput} result={result} />
            <ShareCard result={result} />
          </>
        )}
      </div>

      <footer className="mx-auto w-full max-w-4xl px-6 pt-8 pb-12 text-center">
        <div className="shimmer-line mx-auto mb-8 h-px w-2/3" />
        <p className="font-display text-xs tracking-[0.3em] text-chrome/70 uppercase">
          Caffeine ROI — Ultra Oracle
        </p>
        <p className="mx-auto mt-4 max-w-xl text-xs leading-relaxed text-muted/70">
          Caffeine ROI is not medical advice. Caffeine sensitivity varies. If you have
          anxiety, heart issues, sleep disorders, pregnancy, or medical conditions, consult
          a professional before using caffeine strategically.
        </p>
        <p className="mt-4 text-[10px] tracking-wider text-muted/50 uppercase">
          Not affiliated with any energy drink brand · V2: WHOOP recovery-aware timing
        </p>
      </footer>
    </main>
  );
}
