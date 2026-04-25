import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  format?: (n: number) => string;
}

export function AnimatedCounter({
  value,
  duration = 1500,
  className,
  format = (n) => n.toLocaleString(),
}: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const frameRef = useRef<number>(0);
  const startRef = useRef(0);
  const startValueRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplay(value);
      return;
    }

    startValueRef.current = display;
    startRef.current = performance.now();
    const from = startValueRef.current;
    const to = value;
    const diff = to - from;

    const animate = (now: number) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + diff * eased);
      setDisplay(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration, prefersReducedMotion]);

  return <span className={className}>{format(display)}</span>;
}
