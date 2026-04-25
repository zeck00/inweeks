import { useState } from 'react';
import { Sun, Moon, RotateCcw, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ShareButton } from '../ShareCard/ShareButton';
import { Modal } from '../common/Modal/Modal';
import { Button } from '../common/Button/Button';
import styles from './Header.module.css';

export function Header() {
  const { state, dispatch } = useApp();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    localStorage.removeItem('inweeks_v1');
    dispatch({ type: 'RESET' });
    setShowResetConfirm(false);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.left}>
          <h1 className={styles.logo}>
            <span className={styles.logoAccent}>In</span> Weeks
          </h1>
        </div>

        <div className={styles.right}>
          {state.hasCompletedOnboarding && <ShareButton />}

          <button
            className={styles.iconButton}
            onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
            aria-label={state.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {state.darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {state.hasCompletedOnboarding && (
            <button
              className={styles.iconButton}
              onClick={() => setShowResetConfirm(true)}
              aria-label="Reset"
              title="Start over"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      </header>

      <Modal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Start over?"
        size="sm"
      >
        <div className={styles.confirmBody}>
          <div className={styles.confirmIcon}>
            <AlertTriangle size={24} />
          </div>
          <p className={styles.confirmText}>
            This will erase all your data — birthday, chapters, everything. You'll start fresh from the beginning.
          </p>
          <div className={styles.confirmActions}>
            <Button
              variant="secondary"
              onClick={() => setShowResetConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReset}
            >
              Yes, start over
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
