import { Button } from '../common/Button/Button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import type { LifeStats } from '../../types';
import { formatDate, parseISODate } from '../../utils/date';
import styles from './Onboarding.module.css';
import confirmStyles from './ConfirmStep.module.css';

interface ConfirmStepProps {
  birthday: string;
  countryName: string;
  lifeExpectancy: number;
  onLifeExpectancyChange: (value: number) => void;
  stats: LifeStats | null;
  onComplete: () => void;
  onBack: () => void;
}

export function ConfirmStep({
  birthday,
  countryName,
  lifeExpectancy,
  onLifeExpectancyChange,
  stats,
  onComplete,
  onBack,
}: ConfirmStepProps) {
  if (!stats) return null;

  return (
    <div>
      <h1 className={styles.stepTitle}>Your life in numbers</h1>
      <p className={styles.stepSubtitle}>
        Here's a preview. You can adjust the life expectancy if you'd like.
      </p>

      <div className={confirmStyles.statsGrid}>
        <div className={confirmStyles.statCard}>
          <span className={confirmStyles.statValue}>{stats.ageYears}</span>
          <span className={confirmStyles.statLabel}>Years old</span>
        </div>
        <div className={confirmStyles.statCard}>
          <span className={confirmStyles.statValue}>
            {stats.weeksLived.toLocaleString()}
          </span>
          <span className={confirmStyles.statLabel}>Weeks lived</span>
        </div>
        <div className={confirmStyles.statCard}>
          <span className={confirmStyles.statValue}>
            {stats.weeksRemaining.toLocaleString()}
          </span>
          <span className={confirmStyles.statLabel}>Weeks remaining</span>
        </div>
        <div className={confirmStyles.statCard}>
          <span className={confirmStyles.statValue}>
            {stats.percentLived}%
          </span>
          <span className={confirmStyles.statLabel}>Of your life</span>
        </div>
      </div>

      <div className={confirmStyles.detailRows}>
        <div className={confirmStyles.detailRow}>
          <span className={confirmStyles.detailLabel}>Born</span>
          <span className={confirmStyles.detailValue}>
            {formatDate(parseISODate(birthday))}
          </span>
        </div>
        <div className={confirmStyles.detailRow}>
          <span className={confirmStyles.detailLabel}>Country</span>
          <span className={confirmStyles.detailValue}>{countryName}</span>
        </div>
        <div className={confirmStyles.detailRow}>
          <span className={confirmStyles.detailLabel}>Life expectancy</span>
          <div className={confirmStyles.expectancyControl}>
            <button
              className={confirmStyles.adjustButton}
              onClick={() => onLifeExpectancyChange(Math.max(30, lifeExpectancy - 1))}
              aria-label="Decrease life expectancy"
            >
              -
            </button>
            <span className={confirmStyles.detailValue}>
              {lifeExpectancy.toFixed(1)} years
            </span>
            <button
              className={confirmStyles.adjustButton}
              onClick={() => onLifeExpectancyChange(Math.min(120, lifeExpectancy + 1))}
              aria-label="Increase life expectancy"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className={styles.stepActions}>
        <Button variant="secondary" size="lg" onClick={onBack} icon={<ArrowLeft size={18} />}>
          Back
        </Button>
        <Button
          onClick={onComplete}
          icon={<Sparkles size={18} />}
          size="lg"
        >
          See Your Life
        </Button>
      </div>
    </div>
  );
}
