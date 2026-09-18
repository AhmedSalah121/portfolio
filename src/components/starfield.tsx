import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import classes from './starfield.module.css';

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  layer: 'distant' | 'mid' | 'near';
  color: string;
  isBright: boolean;
  twinklePhase: number;
  twinklePeriod: number;
  twinkleAmplitude: number;
  dispX: number;
  dispY: number;
  brightnessBoost: number;
  gradient?: CanvasGradient;
  haloGradient?: CanvasGradient;
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const heroSection = canvas.closest('#hero') as HTMLElement | null;

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

    const pointer = {
      x: -9999,
      y: -9999,
      active: false,
    };

    const getRandomColor = (): string => {
      const r = Math.random();
      if (r < 0.65) {
        // ~65% pure white to warm white
        return '#ffffff';
      } else if (r < 0.85) {
        // ~20% vibrant pale blue
        return '#7dd3fc';
      } else {
        // ~15% vibrant accent purple/violet
        return '#c084fc';
      }
    };

    const getKeepClearZone = (w: number, h: number) => {
      const heroContentEl = heroSection?.querySelector(
        '[class*="heroContent"]'
      ) as HTMLElement | null;

      if (heroContentEl && canvas) {
        const cRect = canvas.getBoundingClientRect();
        const elRect = heroContentEl.getBoundingClientRect();
        const padding = 32;
        return {
          left: elRect.left - cRect.left - padding,
          right: elRect.right - cRect.left + padding,
          top: elRect.top - cRect.top - padding,
          bottom: elRect.bottom - cRect.top + padding,
        };
      }

      // Default fallback estimation if DOM element bounds not yet ready
      const marginX = w * 0.22;
      const marginY = h * 0.18;
      return {
        left: marginX,
        right: w - marginX,
        top: marginY,
        bottom: h - marginY,
      };
    };

    const generateStars = (w: number, h: number) => {
      const area = w * h;
      const targetCount = Math.min(320, Math.max(50, Math.floor(area / 7500)));
      const newStars: Star[] = [];
      const zone = getKeepClearZone(w, h);

      const gradientCache = new Map<string, CanvasGradient>();

      const getCachedGradient = (radius: number, color: string): CanvasGradient => {
        const key = `${radius.toFixed(2)}_${color}`;
        let grad = gradientCache.get(key);
        if (!grad) {
          grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
          grad.addColorStop(0, color);
          grad.addColorStop(1, 'transparent');
          gradientCache.set(key, grad);
        }
        return grad;
      };

      for (let i = 0; i < targetCount; i++) {
        const rand = Math.random();
        let layer: 'distant' | 'mid' | 'near';
        let radius: number;
        let baseAlpha: number;
        let twinkleAmplitude: number;

        if (rand < 0.55) {
          layer = 'distant';
          radius = 0.3 + Math.random() * 0.3;
          baseAlpha = 0.15 + Math.random() * 0.15;
          twinkleAmplitude = 0.05;
        } else if (rand < 0.85) {
          layer = 'mid';
          radius = 0.8 + Math.random() * 0.5;
          baseAlpha = 0.4 + Math.random() * 0.2;
          twinkleAmplitude = 0.2;
        } else {
          layer = 'near';
          radius = 1.4 + Math.random() * 0.8;
          baseAlpha = 0.7 + Math.random() * 0.25;
          twinkleAmplitude = 0.25;
        }

        let posX = Math.random() * w;
        let posY = Math.random() * h;
        let attempts = 0;

        // Strict keep-clear zone check with up to 100 re-rolls
        while (
          posX >= zone.left &&
          posX <= zone.right &&
          posY >= zone.top &&
          posY <= zone.bottom &&
          attempts < 100
        ) {
          posX = Math.random() * w;
          posY = Math.random() * h;
          attempts++;
        }

        const color = getRandomColor();
        const isBright = layer === 'near' && Math.random() < 0.6; // ~10% total stars overall
        const twinklePhase = Math.random() * Math.PI * 2;
        const twinklePeriod = 2000 + Math.random() * 4000;

        const bodyGradient = getCachedGradient(radius, color);

        let haloGradient: CanvasGradient | undefined = undefined;
        if (isBright) {
          const haloRadius = radius * 3.5;
          haloGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, haloRadius);
          haloGradient.addColorStop(0, color);
          haloGradient.addColorStop(1, 'transparent');
        }

        newStars.push({
          x: posX,
          y: posY,
          radius,
          baseAlpha,
          layer,
          color,
          isBright,
          twinklePhase,
          twinklePeriod,
          twinkleAmplitude,
          dispX: 0,
          dispY: 0,
          brightnessBoost: 0,
          gradient: bodyGradient,
          haloGradient,
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

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      if (window.matchMedia('(pointer: coarse)').matches) return;
      if (!heroSection) return;

      const rect = heroSection.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };

    const handlePointerLeave = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      pointer.active = false;
    };

    if (heroSection) {
      heroSection.addEventListener('pointermove', handlePointerMove);
      heroSection.addEventListener('pointerleave', handlePointerLeave);
    }

    const renderStatic = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        ctx.save();
        ctx.translate(star.x, star.y);

        if (star.isBright && star.haloGradient) {
          ctx.globalAlpha = star.baseAlpha * 0.2;
          ctx.fillStyle = star.haloGradient;
          ctx.beginPath();
          ctx.arc(0, 0, star.radius * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        if (star.gradient) {
          ctx.globalAlpha = star.baseAlpha;
          ctx.fillStyle = star.gradient;
          ctx.beginPath();
          ctx.arc(0, 0, star.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    };

    if (reducedMotion) {
      renderStatic();
      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(resizeTimeout);
        if (heroSection) {
          heroSection.removeEventListener('pointermove', handlePointerMove);
          heroSection.removeEventListener('pointerleave', handlePointerLeave);
        }
      };
    }

    const INFLUENCE_RADIUS = 140;
    const MAX_DISPLACEMENT = 8;

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

        let targetDispX = 0;
        let targetDispY = 0;
        let targetBoost = 0;

        if (pointer.active && star.layer !== 'distant') {
          const dx = star.x - pointer.x;
          const dy = star.y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < INFLUENCE_RADIUS && dist > 0) {
            const t = 1 - dist / INFLUENCE_RADIUS;
            const factor = t * t; // Smooth quadratic falloff

            const dispMag = factor * MAX_DISPLACEMENT;
            targetDispX = (dx / dist) * dispMag;
            targetDispY = (dy / dist) * dispMag;
            targetBoost = factor * 0.25;
          }
        }

        star.dispX += (targetDispX - star.dispX) * 0.12;
        star.dispY += (targetDispY - star.dispY) * 0.12;
        star.brightnessBoost += (targetBoost - star.brightnessBoost) * 0.12;

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

        const renderAlpha = Math.min(1, alpha * (1 + star.brightnessBoost));
        const renderScale = 1 + star.brightnessBoost * 0.25;
        const renderX = star.x + star.dispX;
        const renderY = star.y + star.dispY;

        ctx.save();
        ctx.translate(renderX, renderY);
        if (renderScale !== 1) {
          ctx.scale(renderScale, renderScale);
        }

        // 1. Draw soft halo for bright stars
        if (star.isBright && star.haloGradient) {
          ctx.globalAlpha = renderAlpha * 0.22;
          ctx.fillStyle = star.haloGradient;
          ctx.beginPath();
          ctx.arc(0, 0, star.radius * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // 2. Draw soft radial gradient body
        if (star.gradient) {
          ctx.globalAlpha = renderAlpha;
          ctx.fillStyle = star.gradient;
          ctx.beginPath();
          ctx.arc(0, 0, star.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
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
      if (heroSection) {
        heroSection.removeEventListener('pointermove', handlePointerMove);
        heroSection.removeEventListener('pointerleave', handlePointerLeave);
      }
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
