import { useState, useCallback } from 'react';
import { useApp } from '../../hooks/useApp';
import { countries } from '../../data/life-expectancy';
import { getLifeStats, parseISODate } from '../../utils/date';
import { BirthdayStep } from './BirthdayStep';
import { CountryStep } from './CountryStep';
import { ConfirmStep } from './ConfirmStep';
import styles from './Onboarding.module.css';

export function Onboarding() {
  const { dispatch } = useApp();
  const [step, setStep] = useState(0);
  const [birthday, setBirthday] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'overall'>('overall');
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(0);

  const country = countries.find(c => c.code === countryCode);

  const handleCountrySelect = useCallback((code: string) => {
    setCountryCode(code);
    const c = countries.find(cc => cc.code === code);
    if (c) {
      setLifeExpectancy(c[gender]);
    }
  }, [gender]);

  const handleGenderChange = useCallback((g: 'male' | 'female' | 'overall') => {
    setGender(g);
    if (country) {
      setLifeExpectancy(country[g]);
    }
  }, [country]);

  const handleComplete = useCallback(() => {
    dispatch({
      type: 'SET_PROFILE',
      payload: { birthday, countryCode, lifeExpectancy, gender },
    });
    dispatch({ type: 'COMPLETE_ONBOARDING' });
  }, [dispatch, birthday, countryCode, lifeExpectancy, gender]);

  const stats = birthday && lifeExpectancy > 0
    ? getLifeStats(parseISODate(birthday), lifeExpectancy)
    : null;

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {/* Progress dots */}
        <div className={styles.progress}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`${styles.dot} ${i === step ? styles.dotActive : ''} ${i < step ? styles.dotDone : ''}`}
            />
          ))}
        </div>

        <div className={styles.stepWrapper}>
          {step === 0 && (
            <BirthdayStep
              value={birthday}
              onChange={setBirthday}
              onNext={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <CountryStep
              value={countryCode}
              onChange={handleCountrySelect}
              gender={gender}
              onGenderChange={handleGenderChange}
              lifeExpectancy={lifeExpectancy}
              countryName={country?.name}
              onNext={() => setStep(2)}
              onBack={() => setStep(0)}
            />
          )}
          {step === 2 && (
            <ConfirmStep
              birthday={birthday}
              countryName={country?.name ?? ''}
              lifeExpectancy={lifeExpectancy}
              onLifeExpectancyChange={setLifeExpectancy}
              stats={stats}
              onComplete={handleComplete}
              onBack={() => setStep(1)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
