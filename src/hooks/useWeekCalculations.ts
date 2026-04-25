import { useMemo } from 'react';
import type { Chapter, LifeStats } from '../types';
import { parseISODate, getLifeStats, getWeekStartDate, getTotalWeeks } from '../utils/date';

export function useWeekCalculations(
  birthday: string | null,
  lifeExpectancy: number | null,
  chapters: Chapter[]
) {
  const stats: LifeStats | null = useMemo(() => {
    if (!birthday || !lifeExpectancy) return null;
    const bd = parseISODate(birthday);
    return getLifeStats(bd, lifeExpectancy);
  }, [birthday, lifeExpectancy]);

  const chapterMap = useMemo(() => {
    if (!birthday || !chapters.length) return new Map<number, Chapter>();
    const bd = parseISODate(birthday);
    const map = new Map<number, Chapter>();

    for (const chapter of chapters) {
      const chStart = parseISODate(chapter.startDate);
      const chEnd = parseISODate(chapter.endDate);
      const totalWeeks = lifeExpectancy ? getTotalWeeks(lifeExpectancy) : 5000;

      for (let w = 0; w < totalWeeks; w++) {
        const weekDate = getWeekStartDate(bd, w);
        if (weekDate >= chStart && weekDate <= chEnd) {
          map.set(w, chapter);
        }
      }
    }

    return map;
  }, [birthday, lifeExpectancy, chapters]);

  return { stats, chapterMap };
}
