import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import styles from './Select.module.css';

interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  error?: string;
}

export function Select({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  searchable = false,
  error,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const selectedOption = options.find(o => o.value === value);

  const filteredOptions = search
    ? options.filter(o =>
        o.label.toLowerCase().includes(search.toLowerCase()) ||
        o.value.toLowerCase() === search.toLowerCase()
      )
    : options;

  const close = useCallback(() => {
    setIsOpen(false);
    setSearch('');
    setHighlightedIndex(-1);
  }, []);

  useEffect(() => {
    if (isOpen && searchable) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen, searchable]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [close]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      close();
      return;
    }
    if (e.key === 'Enter') {
      if (!isOpen) {
        setIsOpen(true);
      } else if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        onChange(filteredOptions[highlightedIndex].value);
        close();
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setHighlightedIndex(i => Math.min(i + 1, filteredOptions.length - 1));
      }
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(i => Math.max(i - 1, 0));
    }
  };

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.children;
      if (items[highlightedIndex]) {
        (items[highlightedIndex] as HTMLElement).scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const id = `select-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <label className={styles.label} id={`${id}-label`}>
        {label}
      </label>
      <button
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.open : ''} ${error ? styles.error : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${id}-label`}
      >
        <span className={selectedOption ? styles.selectedText : styles.placeholderText}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
        />
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="listbox" aria-labelledby={`${id}-label`}>
          {searchable && (
            <div className={styles.searchWrapper}>
              <div className={styles.searchInner}>
                <Search size={16} className={styles.searchIcon} />
                <input
                  ref={searchInputRef}
                  className={styles.searchInput}
                  placeholder="Search countries..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setHighlightedIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
          )}
          <div className={styles.options} ref={listRef}>
            {filteredOptions.length === 0 ? (
              <div className={styles.empty}>No results found</div>
            ) : (
              filteredOptions.map((option, idx) => (
                <button
                  key={option.value}
                  type="button"
                  className={`${styles.option} ${option.value === value ? styles.selected : ''} ${idx === highlightedIndex ? styles.highlighted : ''}`}
                  onClick={() => {
                    onChange(option.value);
                    close();
                  }}
                  role="option"
                  aria-selected={option.value === value}
                >
                  <div className={styles.optionContent}>
                    <span className={styles.optionLabel}>{option.label}</span>
                    {option.sublabel && (
                      <span className={styles.optionSublabel}>{option.sublabel}</span>
                    )}
                  </div>
                  {option.value === value && <Check size={16} className={styles.checkIcon} />}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {error && <p className={styles.errorText} role="alert">{error}</p>}
    </div>
  );
}
