const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

export function getWeeksBetween(start: Date, end: Date): number {
  const diff = end.getTime() - start.getTime();
  return Math.floor(diff / MS_PER_WEEK);
}

export function getWeekStartDate(birthday: Date, weekIndex: number): Date {
  return new Date(birthday.getTime() + weekIndex * MS_PER_WEEK);
}

export function getCurrentWeekIndex(birthday: Date): number {
  return getWeeksBetween(birthday, new Date());
}

export function getTotalWeeks(lifeExpectancyYears: number): number {
  return Math.round(lifeExpectancyYears * 52.1775);
}

export function getLifeStats(birthday: Date, lifeExpectancy: number) {
  const now = new Date();
  const totalWeeks = getTotalWeeks(lifeExpectancy);
  const weeksLived = getCurrentWeekIndex(birthday);
  const weeksRemaining = Math.max(0, totalWeeks - weeksLived);
  const percentLived = Math.min(100, (weeksLived / totalWeeks) * 100);

  let ageYears = now.getFullYear() - birthday.getFullYear();
  let ageMonths = now.getMonth() - birthday.getMonth();
  if (ageMonths < 0 || (ageMonths === 0 && now.getDate() < birthday.getDate())) {
    ageYears--;
    ageMonths += 12;
  }
  if (now.getDate() < birthday.getDate()) {
    ageMonths--;
    if (ageMonths < 0) ageMonths += 12;
  }

  const lastBirthday = new Date(birthday);
  lastBirthday.setFullYear(now.getFullYear());
  if (lastBirthday > now) {
    lastBirthday.setFullYear(now.getFullYear() - 1);
  }
  const ageWeeks = getWeeksBetween(lastBirthday, now);

  return {
    weeksLived,
    weeksRemaining,
    totalWeeks,
    percentLived: Math.round(percentLived * 10) / 10,
    ageYears,
    ageMonths,
    ageWeeks,
    currentWeekIndex: weeksLived,
  };
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function toISOString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getYearFromWeekIndex(birthday: Date, weekIndex: number): number {
  const weekDate = getWeekStartDate(birthday, weekIndex);
  let year = weekDate.getFullYear() - birthday.getFullYear();
  const monthDiff = weekDate.getMonth() - birthday.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && weekDate.getDate() < birthday.getDate())) {
    year--;
  }
  return Math.max(0, year);
}
