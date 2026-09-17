import { useEffect, useState } from 'react';
import { useReducedMotion } from './use-reduced-motion';

export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const supportsScrollTimeline = CSS.supports(
      'animation-timeline: scroll()'
    );
    if (supportsScrollTimeline) return;

    let ticking = false;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const value = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(Math.min(1, Math.max(0, value)));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateProgress);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateProgress();

    return () => window.removeEventListener('scroll', onScroll);
  }, [reducedMotion]);

  return progress;
}
