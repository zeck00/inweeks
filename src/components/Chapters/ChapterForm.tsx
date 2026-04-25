import { useState } from 'react';
import { Input } from '../common/Input/Input';
import { DateInput } from '../common/DateInput/DateInput';
import { ColorPicker } from '../common/ColorPicker/ColorPicker';
import { Button } from '../common/Button/Button';
import { chapterColors } from '../../data/chapter-presets';
import type { Chapter } from '../../types';
import styles from './ChapterForm.module.css';

interface ChapterFormProps {
  initial?: Chapter | null;
  birthday: string;
  onSave: (chapter: Omit<Chapter, 'id'>) => void;
  onCancel: () => void;
}

export function ChapterForm({ initial, birthday, onSave, onCancel }: ChapterFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [color, setColor] = useState(initial?.color ?? chapterColors[0].hex);
  const [startDate, setStartDate] = useState(initial?.startDate ?? '');
  const [endDate, setEndDate] = useState(initial?.endDate ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!startDate) errs.startDate = 'Start date is required';
    if (!endDate) errs.endDate = 'End date is required';
    if (startDate && endDate && startDate > endDate) {
      errs.endDate = 'End date must be after start date';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave({ name: name.trim(), color, startDate, endDate });
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        label="Chapter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., University"
        error={errors.name}
      />

      <ColorPicker
        value={color}
        onChange={setColor}
      />

      <div className={styles.dateRow}>
        <DateInput
          label="Start date"
          value={startDate}
          onChange={setStartDate}
          min={birthday}
          max={today}
          error={errors.startDate}
        />
        <DateInput
          label="End date"
          value={endDate}
          onChange={setEndDate}
          min={startDate || birthday}
          max={today}
          error={errors.endDate}
        />
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initial ? 'Save Changes' : 'Add Chapter'}
        </Button>
      </div>
    </form>
  );
}
