import { useRef, useEffect, useCallback, useState } from 'react';
import type { Chapter, LifeStats } from '../types';

interface GridConfig {
  cols: number;
  rows: number;
  squareSize: number;
  gap: number;
  paddingLeft: number;
  paddingTop: number;
  canvasWidth: number;
  canvasHeight: number;
}

interface HoverInfo {
  weekIndex: number;
  year: number;
  weekInYear: number;
  x: number;
  y: number;
  chapter: Chapter | null;
  isLived: boolean;
}

function getComputedColor(varName: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
}

export function useCanvasGrid(
  containerRef: React.RefObject<HTMLDivElement | null>,
  stats: LifeStats | null,
  chapterMap: Map<number, Chapter>,
  animationPhase: 'idle' | 'revealing' | 'complete',
  onAnimationComplete: () => void,
  prefersReducedMotion: boolean,
  darkMode: boolean
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const configRef = useRef<GridConfig | null>(null);
  const animFrameRef = useRef<number>(0);
  const revealedUpToRef = useRef(0);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const dprRef = useRef(window.devicePixelRatio || 1);

  const computeConfig = useCallback((containerWidth: number): GridConfig => {
    const cols = 52;
    const totalYears = stats ? Math.ceil(stats.totalWeeks / 52) : 80;
    const rows = totalYears;

    const paddingLeft = containerWidth > 600 ? 40 : 24;
    const paddingTop = 8;

    const availableWidth = containerWidth - paddingLeft;
    let gap: number;

    if (containerWidth < 500) {
      gap = 1;
    } else if (containerWidth < 900) {
      gap = 1.5;
    } else {
      gap = 2;
    }

    // Use exact floating-point size to fill the full width — no rounding
    const squareSize = Math.max(3, (availableWidth - (cols - 1) * gap) / cols);

    // Canvas is exactly the container width
    const canvasWidth = containerWidth;
    const canvasHeight = paddingTop + rows * (squareSize + gap) - gap;

    return { cols, rows, squareSize, gap, paddingLeft, paddingTop, canvasWidth, canvasHeight };
  }, [stats]);

  const draw = useCallback((revealUpTo: number = Infinity) => {
    const canvas = canvasRef.current;
    const config = configRef.current;
    if (!canvas || !config || !stats) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = dprRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const colorLived = getComputedColor('--color-week-lived');
    const colorEmpty = getComputedColor('--color-week-empty');
    const colorCurrent = getComputedColor('--color-week-current');
    const colorMutedFg = getComputedColor('--color-muted-fg');
    const colorBg = getComputedColor('--color-bg');

    const { cols, rows, squareSize, gap, paddingLeft, paddingTop } = config;
    const totalWeeks = rows * cols;
    const effectiveReveal = Math.min(revealUpTo, totalWeeks);

    // Draw year labels
    ctx.font = `${11 * dpr}px 'Space Grotesk', system-ui, sans-serif`;
    ctx.fillStyle = colorMutedFg;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (let row = 0; row < rows; row++) {
      if (row % 5 === 0) {
        const y = (paddingTop + row * (squareSize + gap) + squareSize / 2) * dpr;
        ctx.fillText(String(row), (paddingLeft - 6) * dpr, y);
      }
    }

    // Draw week squares
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const weekIndex = row * cols + col;
        if (weekIndex >= stats.totalWeeks) continue;

        const x = (paddingLeft + col * (squareSize + gap)) * dpr;
        const y = (paddingTop + row * (squareSize + gap)) * dpr;
        const size = squareSize * dpr;
        const r = Math.max(1, squareSize * 0.15) * dpr;

        // Determine color
        let color: string;
        let alpha = 1;

        if (weekIndex >= effectiveReveal) {
          alpha = 0;
        } else if (weekIndex === stats.currentWeekIndex) {
          color = colorCurrent;
        } else if (weekIndex < stats.currentWeekIndex) {
          const chapter = chapterMap.get(weekIndex);
          color = chapter ? chapter.color : colorLived;
        } else {
          color = colorEmpty;
        }

        if (alpha === 0) {
          // Draw faint placeholder during animation
          ctx.globalAlpha = 0.15;
          ctx.fillStyle = colorEmpty;
          drawRoundedRect(ctx, x, y, size, size, r);
          ctx.fill();
          ctx.globalAlpha = 1;
          continue;
        }

        ctx.globalAlpha = alpha;
        ctx.fillStyle = color!;
        drawRoundedRect(ctx, x, y, size, size, r);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Current week — draw a subtle ring
        if (weekIndex === stats.currentWeekIndex) {
          ctx.strokeStyle = colorBg;
          ctx.lineWidth = 1.5 * dpr;
          drawRoundedRect(ctx, x - 1 * dpr, y - 1 * dpr, size + 2 * dpr, size + 2 * dpr, r + 0.5 * dpr);
          ctx.stroke();
        }
      }
    }
  }, [stats, chapterMap]);

  // Animation loop
  useEffect(() => {
    if (animationPhase !== 'revealing' || !stats) return;

    if (prefersReducedMotion) {
      revealedUpToRef.current = stats.totalWeeks;
      draw(stats.totalWeeks);
      onAnimationComplete();
      return;
    }

    revealedUpToRef.current = 0;
    const totalWeeks = stats.totalWeeks;
    const weeksPerFrame = Math.max(20, Math.floor(totalWeeks / 120)); // ~2 seconds at 60fps

    const animate = () => {
      revealedUpToRef.current += weeksPerFrame;

      if (revealedUpToRef.current >= totalWeeks) {
        revealedUpToRef.current = totalWeeks;
        draw(totalWeeks);
        onAnimationComplete();
        return;
      }

      draw(revealedUpToRef.current);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [animationPhase, stats, draw, onAnimationComplete, prefersReducedMotion]);

  // Redraw on complete state, chapter changes, or theme change
  useEffect(() => {
    if (animationPhase === 'complete') {
      // Small delay to let CSS vars update after theme toggle
      const timer = setTimeout(() => draw(Infinity), 30);
      return () => clearTimeout(timer);
    }
  }, [animationPhase, draw, chapterMap, darkMode]);

  // Resize handling
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || !stats) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      dprRef.current = dpr;
      const rect = container.getBoundingClientRect();
      const config = computeConfig(rect.width);
      configRef.current = config;

      canvas.width = config.canvasWidth * dpr;
      canvas.height = config.canvasHeight * dpr;
      canvas.style.width = `${config.canvasWidth}px`;
      canvas.style.height = `${config.canvasHeight}px`;

      if (animationPhase === 'complete') {
        draw(Infinity);
      } else if (animationPhase === 'revealing') {
        draw(revealedUpToRef.current);
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef, stats, computeConfig, draw, animationPhase]);

  // Hit testing for hover
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const config = configRef.current;
    if (!canvas || !config || !stats) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor((x - config.paddingLeft) / (config.squareSize + config.gap));
    const row = Math.floor((y - config.paddingTop) / (config.squareSize + config.gap));

    if (col < 0 || col >= config.cols || row < 0 || row >= config.rows) {
      setHoverInfo(null);
      return;
    }

    const weekIndex = row * config.cols + col;
    if (weekIndex >= stats.totalWeeks) {
      setHoverInfo(null);
      return;
    }

    const chapter = chapterMap.get(weekIndex) || null;

    setHoverInfo({
      weekIndex,
      year: row,
      weekInYear: col + 1,
      x: e.clientX,
      y: e.clientY,
      chapter,
      isLived: weekIndex < stats.currentWeekIndex,
    });
  }, [stats, chapterMap]);

  const handlePointerLeave = useCallback(() => {
    setHoverInfo(null);
  }, []);

  return {
    canvasRef,
    hoverInfo,
    handlePointerMove,
    handlePointerLeave,
  };
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
