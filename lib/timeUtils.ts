/**
 * All times are handled as minutes since the day's wake-up anchor so that a
 * sleep time past midnight (e.g. 01:30) still sorts after the evening hours.
 */

export function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** Minutes since midnight, shifted forward a day when the clock time sits before wake time. */
export function toTimeline(time: string, wakeTime: string): number {
  const t = parseTimeToMinutes(time);
  const wake = parseTimeToMinutes(wakeTime);
  return t < wake ? t + 24 * 60 : t;
}

export function formatMinutes(timelineMinutes: number): string {
  const total = ((timelineMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const h24 = Math.floor(total / 60);
  const m = total % 60;
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

export function formatDuration(minutes: number): string {
  const abs = Math.abs(Math.round(minutes));
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}
