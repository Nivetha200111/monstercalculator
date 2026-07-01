# ⚡ Caffeine ROI — Ultra Oracle

**Stop wasting caffeine. Time it like a weapon.**

A futuristic caffeine-timing web app that tells you the best moment to drink your
energy drink for maximum focus — without wasting money or ruining sleep. Icy
white/chrome/cyan sci-fi UI, glowing ROI meter, animated caffeine curve, and a
social-media-ready share card.

## What it does

Enter your wake/sleep times, focus window, current energy, caffeine already
consumed, and drink cost. The oracle scores the moment 0–100 and hands down a
verdict:

- **DRINK NOW** — peak caffeine lands on your focus window
- **WAIT** — drinking now wastes the peak; it tells you the exact best window
- **HALF CAN** — you need a lift, but a full can has poor ROI today
- **SKIP** — low-ROI can; save the money and protect tonight's sleep

Plus: best sip window, no-caffeine-after cutoff (sensitivity-aware), sleep risk,
focus payoff, money saved, and a caffeine concentration curve with focus window
and sleep danger zone.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy

Push to GitHub and import into [Vercel](https://vercel.com) — no backend, no
env vars, fully static. Done.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Framer Motion
- Custom SVG (ROI meter + caffeine curve)

All recommendation logic runs client-side in
[`lib/caffeineCalculator.ts`](lib/caffeineCalculator.ts).

## Roadmap

- **V2** — WHOOP integration: recovery-aware recommendations, sleep-debt adjustment
- **V3** — accounts, daily logs, weekly money-saved tracking
- **V4** — notifications ("best caffeine window starts now")

## Disclaimer

Caffeine ROI is not medical advice. Caffeine sensitivity varies. If you have
anxiety, heart issues, sleep disorders, pregnancy, or medical conditions,
consult a professional before using caffeine strategically.

Not affiliated with any energy drink brand.
