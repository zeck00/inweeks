import { Check } from 'lucide-react';
import { chapterColors } from '../../../data/chapter-presets';
import styles from './ColorPicker.module.css';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({ value, onChange, label = 'Color' }: ColorPickerProps) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>{label}</span>
      <div className={styles.swatches} role="radiogroup" aria-label={label}>
        {chapterColors.map((color) => (
          <button
            key={color.hex}
            type="button"
            className={`${styles.swatch} ${value === color.hex ? styles.selected : ''}`}
            style={{ '--swatch-color': color.hex } as React.CSSProperties}
            onClick={() => onChange(color.hex)}
            role="radio"
            aria-checked={value === color.hex}
            aria-label={color.name}
            title={color.name}
          >
            {value === color.hex && <Check size={14} strokeWidth={3} />}
          </button>
        ))}
      </div>
    </div>
  );
}
