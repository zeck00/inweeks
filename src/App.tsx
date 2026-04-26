import { useState } from 'react';
import { useApp } from './hooks/useApp';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Landing } from './components/Landing/Landing';
import { Onboarding } from './components/Onboarding/Onboarding';
import { WeekGrid } from './components/Grid/WeekGrid';
import { StatsBar } from './components/Stats/StatsBar';
import { ChapterPanel } from './components/Chapters/ChapterPanel';
import styles from './App.module.css';

function AppContent() {
  const { state } = useApp();
  const [showLanding, setShowLanding] = useState(!state.hasCompletedOnboarding);

  if (!state.hasCompletedOnboarding && showLanding) {
    return (
      <div className={styles.pageLocked}>
        <Header />
        <Landing onStart={() => setShowLanding(false)} />
        <Footer />
      </div>
    );
  }

  if (!state.hasCompletedOnboarding) {
    return (
      <div className={styles.pageLocked}>
        <Header />
        <Onboarding />
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.statsSection}>
          <StatsBar />
        </div>

        <div className={styles.content}>
          <div className={styles.gridSection}>
            <WeekGrid />
          </div>
          <aside className={styles.sidebar}>
            <ChapterPanel />
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
