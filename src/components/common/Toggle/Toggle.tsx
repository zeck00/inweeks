import styles from './Toggle.module.css';

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  size?: 'sm' | 'md';
}

export function Toggle({ checked, onChange, label, size = 'md' }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`${styles.toggle} ${styles[size]} ${checked ? styles.checked : ''}`}
      onClick={onChange}
    >
      <span className={styles.thumb} />
    </button>
  );
}
