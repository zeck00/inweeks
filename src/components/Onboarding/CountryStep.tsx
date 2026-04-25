import { useMemo } from 'react';
import { Select } from '../common/Select/Select';
import { Button } from '../common/Button/Button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { countries } from '../../data/life-expectancy';
import styles from './Onboarding.module.css';
import countryStyles from './CountryStep.module.css';

interface CountryStepProps {
  value: string;
  onChange: (value: string) => void;
  gender: 'male' | 'female' | 'overall';
  onGenderChange: (gender: 'male' | 'female' | 'overall') => void;
  lifeExpectancy: number;
  countryName?: string;
  onNext: () => void;
  onBack: () => void;
}

export function CountryStep({
  value,
  onChange,
  gender,
  onGenderChange,
  lifeExpectancy,
  countryName,
  onNext,
  onBack,
}: CountryStepProps) {
  const options = useMemo(
    () => countries.map(c => ({
      value: c.code,
      label: c.name,
      sublabel: `${c.overall} years avg.`,
    })),
    []
  );

  return (
    <div>
      <h1 className={styles.stepTitle}>Where do you call home?</h1>
      <p className={styles.stepSubtitle}>
        We'll use your country's life expectancy data as a baseline.
      </p>

      <Select
        label="Country"
        options={options}
        value={value}
        onChange={onChange}
        placeholder="Search for a country..."
        searchable
      />

      {value && (
        <div className={countryStyles.details}>
          <div className={countryStyles.genderToggle} role="radiogroup" aria-label="Gender">
            {(['overall', 'male', 'female'] as const).map(g => (
              <button
                key={g}
                type="button"
                className={`${countryStyles.genderButton} ${gender === g ? countryStyles.genderActive : ''}`}
                onClick={() => onGenderChange(g)}
                role="radio"
                aria-checked={gender === g}
              >
                {g === 'overall' ? 'Average' : g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>

          <div className={countryStyles.expectancyDisplay}>
            <span className={countryStyles.expectancyLabel}>
              Life expectancy in {countryName}
            </span>
            <span className={countryStyles.expectancyValue}>
              {lifeExpectancy.toFixed(1)} years
            </span>
          </div>
        </div>
      )}

      <div className={styles.stepActions}>
        <Button variant="secondary" size="lg" onClick={onBack} icon={<ArrowLeft size={18} />}>
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!value}
          icon={<ArrowRight size={18} />}
          size="lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
