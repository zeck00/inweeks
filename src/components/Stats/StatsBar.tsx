import { useApp } from '../../context/AppContext';
import { useWeekCalculations } from '../../hooks/useWeekCalculations';
import { AnimatedCounter } from './AnimatedCounter';
import styles from './StatsBar.module.css';

export function StatsBar() {
  const { state } = useApp();
  const { stats } = useWeekCalculations(
    state.profile?.birthday ?? null,
    state.profile?.lifeExpectancy ?? null,
    state.chapters
  );

  if (!stats) return null;

  return (
    <div className={styles.bar}>
      <div className={styles.stat}>
        <AnimatedCounter value={stats.weeksLived} className={styles.value} />
        <span className={styles.label}>weeks lived</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.stat}>
        <AnimatedCounter value={stats.weeksRemaining} className={styles.value} />
        <span className={styles.label}>weeks left</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.stat}>
        <AnimatedCounter
          value={stats.percentLived}
          className={styles.value}
          format={(n) => `${n.toFixed(1)}%`}
        />
        <span className={styles.label}>of your life</span>
      </div>

      <div className={styles.progressWrapper}>
        <div
          className={styles.progressFill}
          style={{ width: `${Math.min(stats.percentLived, 100)}%` }}
        />
      </div>
    </div>
  );
}
