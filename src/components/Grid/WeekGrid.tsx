import { useRef, useCallback, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';
import { useWeekCalculations } from '../../hooks/useWeekCalculations';
import { useCanvasGrid } from '../../hooks/useCanvasGrid';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { GridTooltip } from './GridTooltip';
import styles from './WeekGrid.module.css';

export function WeekGrid() {
  const { state, dispatch } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { stats, chapterMap } = useWeekCalculations(
    state.profile?.birthday ?? null,
    state.profile?.lifeExpectancy ?? null,
    state.chapters
  );

  const onAnimationComplete = useCallback(() => {
    dispatch({ type: 'SET_GRID_ANIMATION_PHASE', payload: 'complete' });
  }, [dispatch]);

  const { canvasRef, hoverInfo, handlePointerMove, handlePointerLeave } =
    useCanvasGrid(
      containerRef,
      stats,
      chapterMap,
      state.gridAnimationPhase,
      onAnimationComplete,
      prefersReducedMotion,
      state.darkMode
    );

  // Trigger animation on first render after onboarding
  useEffect(() => {
    if (state.hasCompletedOnboarding && state.gridAnimationPhase === 'idle' && stats) {
      // Small delay for dramatic effect
      const timer = setTimeout(() => {
        dispatch({ type: 'SET_GRID_ANIMATION_PHASE', payload: 'revealing' });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [state.hasCompletedOnboarding, state.gridAnimationPhase, stats, dispatch]);

  if (!stats) return null;

  return (
    <div className={styles.wrapper}>
      {/* Week column headers */}
      <div className={styles.columnHeader}>
        <span className={styles.axisLabel}>Week of the year</span>
      </div>

      <div className={styles.gridContainer} ref={containerRef}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          role="img"
          aria-label={`Life grid showing ${stats.weeksLived.toLocaleString()} weeks lived out of ${stats.totalWeeks.toLocaleString()} total weeks`}
        />
      </div>

      {hoverInfo && (
        <GridTooltip
          weekIndex={hoverInfo.weekIndex}
          year={hoverInfo.year}
          weekInYear={hoverInfo.weekInYear}
          x={hoverInfo.x}
          y={hoverInfo.y}
          chapter={hoverInfo.chapter}
          isLived={hoverInfo.isLived}
          isCurrent={hoverInfo.weekIndex === stats.currentWeekIndex}
          birthday={state.profile!.birthday}
        />
      )}
    </div>
  );
}
