import { useState, useRef } from 'react';
import styles from './DateInput.module.css';

interface DateInputProps {
  label: string;
  value: string; // ISO date string "YYYY-MM-DD"
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  error?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function parseInitial(value: string): { month: number; day: number; year: number } {
  if (!value) return { month: -1, day: -1, year: -1 };
  const [y, m, d] = value.split('-').map(Number);
  return { year: y || -1, month: (m || 0) - 1, day: d || -1 };
}

export function DateInput({ label, value, onChange, min, max, error }: DateInputProps) {
  const initial = parseInitial(value);
  const [month, setMonth] = useState(initial.month);
  const [day, setDay] = useState(initial.day);
  const [year, setYear] = useState(initial.year);
  const dayRef = useRef<HTMLSelectElement>(null);
  const yearRef = useRef<HTMLSelectElement>(null);

  const updateDate = (m: number, d: number, y: number) => {
    if (m >= 0 && d > 0 && y > 0) {
      const mm = String(m + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      onChange(`${y}-${mm}-${dd}`);
    }
  };

  const handleMonthChange = (newMonth: number) => {
    setMonth(newMonth);
    if (day > 0 && year > 0) {
      const maxDays = getDaysInMonth(newMonth, year);
      const newDay = Math.min(day, maxDays);
      setDay(newDay);
      updateDate(newMonth, newDay, year);
    }
    if (day <= 0) dayRef.current?.focus();
  };

  const handleDayChange = (newDay: number) => {
    setDay(newDay);
    if (month >= 0 && year > 0) {
      updateDate(month, newDay, year);
    }
    if (year <= 0) yearRef.current?.focus();
  };

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
    if (month >= 0 && day > 0) {
      const maxDays = getDaysInMonth(month, newYear);
      const newDay = Math.min(day, maxDays);
      setDay(newDay);
      updateDate(month, newDay, newYear);
    }
  };

  const currentYear = new Date().getFullYear();
  const minYear = min ? parseInt(min.split('-')[0]) : 1900;
  const maxYear = max ? parseInt(max.split('-')[0]) : currentYear;
  const daysInMonth = month >= 0 && year > 0 ? getDaysInMonth(month, year) : 31;

  const id = label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={styles.wrapper}>
      <label className={styles.label} id={`${id}-label`}>{label}</label>
      <div className={styles.selects} role="group" aria-labelledby={`${id}-label`}>
        <select
          className={styles.select}
          value={month}
          onChange={(e) => handleMonthChange(Number(e.target.value))}
          aria-label="Month"
        >
          <option value={-1} disabled>Month</option>
          {MONTHS.map((m, i) => (
            <option key={m} value={i}>{m}</option>
          ))}
        </select>

        <select
          ref={dayRef}
          className={`${styles.select} ${styles.daySelect}`}
          value={day}
          onChange={(e) => handleDayChange(Number(e.target.value))}
          aria-label="Day"
        >
          <option value={-1} disabled>Day</option>
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          ref={yearRef}
          className={styles.select}
          value={year}
          onChange={(e) => handleYearChange(Number(e.target.value))}
          aria-label="Year"
        >
          <option value={-1} disabled>Year</option>
          {Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i).map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      {error && <p className={styles.errorText} role="alert">{error}</p>}
    </div>
  );
}
