import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import classes from './back-to-top.module.css';

function BackToTop() {
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { rootMargin: '0px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <>
      <div
        ref={sentinelRef}
        className={classes.sentinel}
        aria-hidden='true'
      />
      <button
        type='button'
        className={`${classes.backToTop} ${visible ? classes.backToTopVisible : ''}`}
        onClick={scrollToTop}
        aria-label='Back to top'
      >
        ↑
      </button>
    </>
  );
}

export default BackToTop;
