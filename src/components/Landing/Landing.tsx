import { ArrowRight } from 'lucide-react';
import { Button } from '../common/Button/Button';
import styles from './Landing.module.css';

interface LandingProps {
  onStart: () => void;
}

export function Landing({ onStart }: LandingProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Logo icon — matches favicon */}
        <div className={styles.logoIcon} aria-hidden="true">
          <svg viewBox="0 0 32 32" width="64" height="64">
            <rect x="2" y="2" width="12" height="12" rx="2.5" fill="var(--color-primary)" className={styles.logoSquare} style={{ animationDelay: '0.3s' }} />
            <rect x="18" y="2" width="12" height="12" rx="2.5" fill="var(--color-accent)" className={styles.logoSquare} style={{ animationDelay: '0.45s' }} />
            <rect x="2" y="18" width="12" height="12" rx="2.5" fill="var(--color-primary)" className={styles.logoSquare} style={{ animationDelay: '0.6s' }} />
            <rect x="18" y="18" width="12" height="12" rx="2.5" fill="var(--color-border)" className={styles.logoSquare} style={{ animationDelay: '0.75s' }} />
          </svg>
        </div>

        <h1 className={styles.title}>
          Your life,<br />
          in weeks.
        </h1>

        <p className={styles.subtitle}>
          4,000 weeks. That's roughly what you get. See how many you've lived,
          how many remain, and color them by the chapters that matter.
        </p>

        <Button size="lg" onClick={onStart} icon={<ArrowRight size={20} />}>
          Get Started
        </Button>

        <p className={styles.footnote}>
          Inspired by Tim Urban's perspective on time.
          <br />
          No account needed. Your data stays on your device.
        </p>
      </div>
    </div>
  );
}
