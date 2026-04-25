import { useRef, useEffect } from 'react';
import type { Chapter } from '../../types';
import { getWeekStartDate, parseISODate, formatDate } from '../../utils/date';
import styles from './GridTooltip.module.css';

interface GridTooltipProps {
  weekIndex: number;
  year: number;
  weekInYear: number;
  x: number;
  y: number;
  chapter: Chapter | null;
  isLived: boolean;
  isCurrent: boolean;
  birthday: string;
}

export function GridTooltip({
  weekIndex,
  year,
  weekInYear,
  x,
  y,
  chapter,
  isLived,
  isCurrent,
  birthday,
}: GridTooltipProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let left = x + 12;
      let top = y - rect.height - 8;

      if (left + rect.width > vw - 16) {
        left = x - rect.width - 12;
      }
      if (top < 8) {
        top = y + 20;
      }
      if (top + rect.height > vh - 8) {
        top = vh - rect.height - 8;
      }

      ref.current.style.left = `${left}px`;
      ref.current.style.top = `${top}px`;
    }
  }, [x, y]);

  const weekDate = getWeekStartDate(parseISODate(birthday), weekIndex);
  const dateStr = formatDate(weekDate);

  return (
    <div ref={ref} className={styles.tooltip} role="tooltip">
      <div className={styles.header}>
        <span className={styles.weekLabel}>
          {isCurrent ? 'This week' : isLived ? 'Lived' : 'Future'}
        </span>
        {isCurrent && <span className={styles.currentDot} />}
      </div>
      <div className={styles.date}>{dateStr}</div>
      <div className={styles.meta}>
        Year {year} &middot; Week {weekInYear}
      </div>
      {chapter && (
        <div className={styles.chapter}>
          <span
            className={styles.chapterDot}
            style={{ background: chapter.color }}
          />
          <span>{chapter.name}</span>
        </div>
      )}
    </div>
  );
}
