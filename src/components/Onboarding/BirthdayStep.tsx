import { DateInput } from '../common/DateInput/DateInput';
import { Button } from '../common/Button/Button';
import { ArrowRight } from 'lucide-react';
import styles from './Onboarding.module.css';

interface BirthdayStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

export function BirthdayStep({ value, onChange, onNext }: BirthdayStepProps) {
  const isValid = value && value.length === 10;

  return (
    <div>
      <h1 className={styles.stepTitle}>When were you born?</h1>
      <p className={styles.stepSubtitle}>
        This is the starting point of your life in weeks.
      </p>

      <DateInput
        label="Date of birth"
        value={value}
        onChange={onChange}
        max={new Date().toISOString().split('T')[0]}
        min="1900-01-01"
      />

      <div className={styles.stepActions}>
        <Button
          onClick={onNext}
          disabled={!isValid}
          icon={<ArrowRight size={18} />}
          size="lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
