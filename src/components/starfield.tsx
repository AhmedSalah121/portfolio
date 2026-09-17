import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import classes from './starfield.module.css';

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  layer: 'distant' | 'mid' | 'near';
  isAccent: boolean;
  twinklePhase: number;
  twinklePeriod: number;
  twinkleAmplitude: number;
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let isVisible = true;
    let isTabActive = true;
    let lastTime = 0;

    const generateStars = (w: number, h: number) => {
      const area = w * h;
      const targetCount = Math.min(220, Math.max(30, Math.floor(area / 10000)));
      const newStars: Star[] = [];

      for (let i = 0; i < targetCount; i++) {
        const rand = Math.random();
        let layer: 'distant' | 'mid' | 'near';
        let radius: number;
        let baseAlpha: number;
        let twinkleAmplitude: number;

        if (rand < 0.55) {
          layer = 'distant';
          radius = 0.4 + Math.random() * 0.4;
          baseAlpha = 0.2 + Math.random() * 0.2;
          twinkleAmplitude = 0.05;
        } else if (rand < 0.85) {
          layer = 'mid';
          radius = 0.8 + Math.random() * 0.5;
          baseAlpha = 0.4 + Math.random() * 0.25;
          twinkleAmplitude = 0.2;
        } else {
          layer = 'near';
          radius = 1.3 + Math.random() * 0.7;
          baseAlpha = 0.65 + Math.random() * 0.25;
          twinkleAmplitude = 0.3;
        }

        const isAccent = Math.random() < 0.15;
        const twinklePhase = Math.random() * Math.PI * 2;
        const twinklePeriod = 2000 + Math.random() * 4000;

        newStars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius,
          baseAlpha,
          layer,
          isAccent,
          twinklePhase,
          twinklePeriod,
          twinkleAmplitude,
        });
      }

      stars = newStars;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      generateStars(width, height);
    };

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 150);
    };

    resize();
    window.addEventListener('resize', handleResize);

    const renderStatic = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        if (star.isAccent) {
          ctx.fillStyle = `rgba(167, 139, 250, ${star.baseAlpha})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${star.baseAlpha})`;
        }
        ctx.fill();
      }
    };

    if (reducedMotion) {
      renderStatic();
      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(resizeTimeout);
      };
    }

    const drawFrame = (now: number) => {
      if (!lastTime) lastTime = now;
      const dt = Math.min(100, now - lastTime);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      const speeds = {
        distant: 0.005,
        mid: 0.012,
        near: 0.025,
      };

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        star.x += speeds[star.layer] * dt;
        star.y -= speeds[star.layer] * 0.5 * dt;

        if (star.x > width) star.x = 0;
        if (star.x < 0) star.x = width;
        if (star.y > height) star.y = height;
        if (star.y < 0) star.y = height;

        let alpha = star.baseAlpha;
        if (star.layer !== 'distant') {
          const sinVal = Math.sin(
            (now / star.twinklePeriod) * Math.PI * 2 + star.twinklePhase
          );
          alpha = Math.max(
            0.1,
            Math.min(1, star.baseAlpha + sinVal * star.twinkleAmplitude)
          );
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

        if (star.isAccent) {
          ctx.fillStyle = `rgba(167, 139, 250, ${alpha.toFixed(3)})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
        }

        ctx.fill();
      }

      if (isVisible && isTabActive) {
        animId = requestAnimationFrame(drawFrame);
      }
    };

    const startLoop = () => {
      if (!animId) {
        lastTime = 0;
        animId = requestAnimationFrame(drawFrame);
      }
    };

    const stopLoop = () => {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = 0;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && isTabActive) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0 }
    );

    observer.observe(canvas);

    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
      if (isVisible && isTabActive) {
        startLoop();
      } else {
        stopLoop();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    startLoop();

    return () => {
      stopLoop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={classes.starfieldCanvas}
      aria-hidden='true'
    />
  );
}

export default Starfield;
