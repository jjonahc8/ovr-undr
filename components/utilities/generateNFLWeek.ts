export function getNFLKickoff(year: number): Date {
  const sept1 = new Date(year, 8, 1);
  const firstMonday = sept1.getDate() + ((1 - sept1.getDay() + 7) % 7);

  const laborDay = new Date(year, 8, firstMonday);

  const kickoff = new Date(laborDay);
  kickoff.setDate(laborDay.getDate() + 3);

  return kickoff;
}

export function getNFLWeek(
  today: Date = new Date(),
  year: number
): number | null {
  const seasonStart = getNFLKickoff(year);

  const start = new Date(seasonStart);
  start.setHours(0, 0, 0, 0);

  const current = new Date(today);
  current.setHours(0, 0, 0, 0);

  if (current < start) return null;

  const diffMs = current.getTime() - start.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return Math.floor(diffDays / 7) + 1;
}
