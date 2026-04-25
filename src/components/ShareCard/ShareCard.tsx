import { forwardRef, useMemo } from 'react';
import type { LifeStats, Chapter } from '../../types';
import { parseISODate } from '../../utils/date';
import styles from './ShareCard.module.css';

// Instagram story: 1080x1920
const CARD_W = 1080;
const CARD_H = 1920;

interface ShareCardProps {
  stats: LifeStats;
  chapters: Chapter[];
  birthday: string;
  countryName: string;
  darkMode: boolean;
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  ({ stats, chapters, birthday, countryName, darkMode }, ref) => {
    const birthYear = birthday.split('-')[0];

    const chapterMap = useMemo(() => {
      if (!chapters.length) return new Map<number, Chapter>();
      const bd = parseISODate(birthday);
      const map = new Map<number, Chapter>();
      const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
      for (const chapter of chapters) {
        const chStart = parseISODate(chapter.startDate);
        const chEnd = parseISODate(chapter.endDate);
        // Compute week index range directly — no need to iterate all weeks
        const startWeek = Math.max(0, Math.floor((chStart.getTime() - bd.getTime()) / MS_PER_WEEK));
        const endWeek = Math.min(stats.totalWeeks - 1, Math.floor((chEnd.getTime() - bd.getTime()) / MS_PER_WEEK));
        for (let w = startWeek; w <= endWeek; w++) {
          map.set(w, chapter);
        }
      }
      return map;
    }, [chapters, birthday, stats.totalWeeks]);

    const bg = darkMode ? '#0A0A0C' : '#FAFAFA';
    const fg = darkMode ? '#F4F4F5' : '#09090B';
    const mutedFg = darkMode ? '#8B8B96' : '#71717A';
    const accent = darkMode ? '#60A5FA' : '#6366F1';
    const weekLived = darkMode ? '#52525B' : '#18181B';
    const weekEmpty = darkMode ? '#1E1E24' : '#E4E4E7';

    const totalYears = Math.ceil(stats.totalWeeks / 52);
    // Fit 52 columns into ~960px (1080 - 2*60 padding)
    const gridAreaWidth = CARD_W - 120;
    const gridGap = 2;
    const gridSquareSize = Math.floor((gridAreaWidth - 51 * gridGap) / 52);

    return (
      <div className={styles.cardWrapper} aria-hidden="true">
        <div ref={ref} className={styles.card} style={{ background: bg }}>
          <div className={styles.cardInner} style={{ background: bg }}>
            {/* Logo */}
            <div className={styles.logoRow}>
              <svg viewBox="0 0 32 32" width="36" height="36">
                <rect x="2" y="2" width="12" height="12" rx="2.5" fill={fg} />
                <rect x="18" y="2" width="12" height="12" rx="2.5" fill={accent} />
                <rect x="2" y="18" width="12" height="12" rx="2.5" fill={fg} />
                <rect x="18" y="18" width="12" height="12" rx="2.5" fill={weekEmpty} />
              </svg>
              <span className={styles.logoText} style={{ color: fg }}>
                <span style={{ color: accent }}>In</span> Weeks
              </span>
            </div>

            {/* Title */}
            <div className={styles.titleSection}>
              <h2 className={styles.title} style={{ color: fg }}>My Life, In Weeks</h2>
              <p className={styles.subtitle} style={{ color: mutedFg }}>
                Born {birthYear} &middot; {countryName}
              </p>
            </div>

            {/* Stats */}
            <div className={styles.statsRow}>
              <div className={styles.stat}>
                <span className={styles.statValue} style={{ color: fg }}>
                  {stats.weeksLived.toLocaleString()}
                </span>
                <span className={styles.statLabel} style={{ color: mutedFg }}>weeks lived</span>
              </div>
              <div className={styles.statDivider} style={{ background: weekEmpty }} />
              <div className={styles.stat}>
                <span className={styles.statValue} style={{ color: fg }}>
                  {stats.weeksRemaining.toLocaleString()}
                </span>
                <span className={styles.statLabel} style={{ color: mutedFg }}>weeks left</span>
              </div>
              <div className={styles.statDivider} style={{ background: weekEmpty }} />
              <div className={styles.stat}>
                <span className={styles.statValue} style={{ color: accent }}>
                  {stats.percentLived.toFixed(1)}%
                </span>
                <span className={styles.statLabel} style={{ color: mutedFg }}>of life</span>
              </div>
            </div>

            {/* Week grid — the main visual */}
            <div
              className={styles.weekGrid}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: `${gridGap}px`,
                width: `${52 * (gridSquareSize + gridGap) - gridGap}px`,
              }}
            >
              {Array.from({ length: Math.min(totalYears * 52, stats.totalWeeks) }, (_, weekIndex) => {
                let color: string;
                if (weekIndex === stats.currentWeekIndex) {
                  color = accent;
                } else if (weekIndex < stats.currentWeekIndex) {
                  const ch = chapterMap.get(weekIndex);
                  color = ch ? ch.color : weekLived;
                } else {
                  color = weekEmpty;
                }
                return (
                  <div
                    key={weekIndex}
                    style={{
                      width: `${gridSquareSize}px`,
                      height: `${gridSquareSize}px`,
                      borderRadius: `${Math.max(1, gridSquareSize * 0.15)}px`,
                      background: color,
                      flexShrink: 0,
                    }}
                  />
                );
              })}
            </div>

            {/* Chapters legend */}
            {chapters.length > 0 && (
              <div className={styles.chapters}>
                {chapters.slice(0, 8).map(ch => (
                  <div key={ch.id} className={styles.chapterTag} style={{ color: mutedFg }}>
                    <span className={styles.chapterDot} style={{ background: ch.color }} />
                    <span>{ch.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Branding */}
            <div className={styles.branding} style={{ color: mutedFg }}>
              inweeks.org
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ShareCard.displayName = 'ShareCard';

export { CARD_W, CARD_H };
