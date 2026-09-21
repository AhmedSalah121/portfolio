import { useEffect, useRef, useState } from 'react';
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

interface ShootingStar {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  headX: number;
  headY: number;
  radius: number;
  age: number;
  maxAge: number;
  color: string;
}

interface Burst {
  x: number;
  y: number;
  color: string;
  start: number;
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [score, setScore] = useState(0);
  const [showCounter, setShowCounter] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const burstRef = useRef<Burst | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const heroSection = canvas.closest('#hero') as HTMLElement | null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let isVisible = true;
    let isTabActive = true;
    let lastTime = 0;

    const pointer = { x: -9999, y: -9999, active: false };

    const getRandomColor = (): string => {
      const r = Math.random();
      if (r < 0.65) return '#ffffff';
      if (r < 0.85) return '#7dd3fc';
      return '#c084fc';
    };

    const getKeepClearZone = (w: number, h: number) => {
      const heroContentEl = heroSection?.querySelector('[class*="heroContent"]') as HTMLElement | null;
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
      const marginX = w * 0.22;
      const marginY = h * 0.18;
      return { left: marginX, right: w - marginX, top: marginY, bottom: h - marginY };
    };

    const generateStars = (w: number, h: number) => {
      const area = w * h;
      const targetCount = Math.min(320, Math.max(50, Math.floor(area / 7500)));
      const newStars: Star[] = [];
      const zone = getKeepClearZone(w, h);
      const gradientCache = new Map<string, CanvasGradient>();
      const getCachedGradient = (radius: number, color: string): CanvasGradient => {
        const key = `${radius.toFixed(2)}_${color}`;
        let g = gradientCache.get(key);
        if (!g) {
          g = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
          g.addColorStop(0, color);
          g.addColorStop(1, 'transparent');
          gradientCache.set(key, g);
        }
        return g;
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
        while (posX >= zone.left && posX <= zone.right && posY >= zone.top && posY <= zone.bottom && attempts < 100) {
          posX = Math.random() * w;
          posY = Math.random() * h;
          attempts++;
        }
        const color = getRandomColor();
        const isBright = layer === 'near' && Math.random() < 0.6;
        const twinklePhase = Math.random() * Math.PI * 2;
        const twinklePeriod = 2000 + Math.random() * 4000;
        const bodyGradient = getCachedGradient(radius, color);
        let haloGradient: CanvasGradient | undefined;
        if (isBright) {
          const haloRadius = radius * 3.5;
          haloGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, haloRadius);
          haloGradient.addColorStop(0, color);
          haloGradient.addColorStop(1, 'transparent');
        }
        newStars.push({
          x: posX, y: posY, radius, baseAlpha, layer, color, isBright,
          twinklePhase, twinklePeriod, twinkleAmplitude,
          dispX: 0, dispY: 0, brightnessBoost: 0,
          gradient: bodyGradient, haloGradient,
        });
      }
      stars = newStars;
    };

    const generateShootingStar = (): ShootingStar => {
      const rect = heroSection?.getBoundingClientRect();
      const w = rect ? rect.width : width;
      const h = rect ? rect.height : height;
      const color = Math.random() < 0.5 ? '#c084fc' : '#7dd3fc';
      const side = Math.random();
      let startX: number, startY: number, endX: number, endY: number;
      if (side < 0.25) {
        startX = -20; startY = h * (0.15 + Math.random() * 0.7); endX = w + 20; endY = startY + (Math.random() - 0.5) * 80;
      } else if (side < 0.5) {
        startX = w + 20; startY = h * (0.15 + Math.random() * 0.7); endX = -20; endY = startY + (Math.random() - 0.5) * 80;
      } else if (side < 0.75) {
        startX = w * (0.15 + Math.random() * 0.7); startY = -20; endX = startX + (Math.random() - 0.5) * 80; endY = h + 20;
      } else {
        startX = w * (0.15 + Math.random() * 0.7); startY = h + 20; endX = startX + (Math.random() - 0.5) * 80; endY = -20;
      }
      return {
        startX, startY, endX, endY,
        headX: startX, headY: startY,
        radius: 2.2 + Math.random() * 1.3,
        age: 0, maxAge: 1600, color,
      };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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

    // shooting star scheduling — slower streak but more frequent spawns
    let shootTimeout: ReturnType<typeof setTimeout> | undefined;
    if (!reducedMotion) {
      const scheduleNext = () => {
        const delay = 8000 + Math.random() * 6000;
        shootTimeout = setTimeout(() => {
          shootingStarsRef.current.push(generateShootingStar());
          scheduleNext();
        }, delay);
      };
      shootTimeout = setTimeout(() => {
        shootingStarsRef.current.push(generateShootingStar());
        scheduleNext();
      }, 2000 + Math.random() * 2000);
    }

    const INFLUENCE_RADIUS = 140;
    const MAX_DISPLACEMENT = 8;
    const CATCH_RADIUS = 24;

    const drawFrame = (now: number) => {
      if (!lastTime) lastTime = now;
      const dt = Math.min(100, now - lastTime);
      lastTime = now;
      ctx.clearRect(0, 0, width, height);

      const speeds = { distant: 0.005, mid: 0.012, near: 0.025 };

      if (!reducedMotion) {
        const sList = shootingStarsRef.current;
        for (let i = sList.length - 1; i >= 0; i--) {
          const ss = sList[i];
          ss.age += dt;
          const p = ss.age / ss.maxAge;
          if (p >= 1) { sList.splice(i, 1); continue; }
          ss.headX = ss.startX + (ss.endX - ss.startX) * p;
          ss.headY = ss.startY + (ss.endY - ss.startY) * p;
          const dx = ss.endX - ss.startX;
          const dy = ss.endY - ss.startY;
          const len = Math.hypot(dx, dy) || 1;
          const nx = dx / len, ny = dy / len;
          const tailLen = 70;
          const tailX = ss.headX - nx * tailLen;
          const tailY = ss.headY - ny * tailLen;
          ctx.save();
          ctx.globalAlpha = 0.45 * (1 - p * 0.3);
          ctx.strokeStyle = ss.color;
          ctx.lineWidth = 1.2;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(ss.headX, ss.headY);
          ctx.stroke();
          ctx.restore();
          ctx.save();
          ctx.globalAlpha = 0.95;
          ctx.fillStyle = ss.color;
          ctx.shadowColor = ss.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(ss.headX, ss.headY, ss.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      if (reducedMotion) {
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
      } else {
        for (let i = 0; i < stars.length; i++) {
          const star = stars[i];
          star.x += speeds[star.layer] * dt;
          star.y -= speeds[star.layer] * 0.5 * dt;
          if (star.x > width) star.x = 0;
          if (star.x < 0) star.x = width;
          if (star.y > height) star.y = height;
          if (star.y < 0) star.y = height;
          let targetDispX = 0, targetDispY = 0, targetBoost = 0;
          if (pointer.active && star.layer !== 'distant') {
            const dx = star.x - pointer.x;
            const dy = star.y - pointer.y;
            const dist = Math.hypot(dx, dy);
            if (dist < INFLUENCE_RADIUS && dist > 0) {
              const t = 1 - dist / INFLUENCE_RADIUS;
              const factor = t * t;
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
            const sinVal = Math.sin((now / star.twinklePeriod) * Math.PI * 2 + star.twinklePhase);
            alpha = Math.max(0.1, Math.min(1, star.baseAlpha + sinVal * star.twinkleAmplitude));
          }
          const renderAlpha = Math.min(1, alpha * (1 + star.brightnessBoost));
          const renderScale = 1 + star.brightnessBoost * 0.25;
          const renderX = star.x + star.dispX;
          const renderY = star.y + star.dispY;
          ctx.save();
          ctx.translate(renderX, renderY);
          if (renderScale !== 1) ctx.scale(renderScale, renderScale);
          if (star.isBright && star.haloGradient) {
            ctx.globalAlpha = renderAlpha * 0.22;
            ctx.fillStyle = star.haloGradient;
            ctx.beginPath();
            ctx.arc(0, 0, star.radius * 3.5, 0, Math.PI * 2);
            ctx.fill();
          }
          if (star.gradient) {
            ctx.globalAlpha = renderAlpha;
            ctx.fillStyle = star.gradient;
            ctx.beginPath();
            ctx.arc(0, 0, star.radius, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      if (burstRef.current) {
        const elapsed = now - burstRef.current.start;
        const dur = 400;
        if (elapsed < dur) {
          const t = elapsed / dur;
          const alpha = 1 - t;
          ctx.save();
          ctx.globalAlpha = alpha * 0.35;
          ctx.strokeStyle = burstRef.current.color;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(burstRef.current.x, burstRef.current.y, 4 + t * 18, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
          ctx.save();
          ctx.globalAlpha = alpha * 0.9;
          ctx.fillStyle = burstRef.current.color;
          for (let k = 0; k < 5; k++) {
            const ang = (k / 5) * Math.PI * 2 + t * 0.8;
            const r = 3 + t * 14 + (k % 2) * 4;
            const px = burstRef.current.x + Math.cos(ang) * r;
            const py = burstRef.current.y + Math.sin(ang) * r;
            ctx.beginPath();
            ctx.arc(px, py, 1.6, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        } else {
          burstRef.current = null;
        }
      }

      if (isVisible && isTabActive) animId = requestAnimationFrame(drawFrame);
    };

    const startLoop = () => {
      if (!animId) { lastTime = 0; animId = requestAnimationFrame(drawFrame); }
    };
    const stopLoop = () => { if (animId) { cancelAnimationFrame(animId); animId = 0; } };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && isTabActive) startLoop(); else stopLoop();
    }, { threshold: 0 });
    observer.observe(canvas);

    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
      if (isVisible && isTabActive) startLoop(); else stopLoop();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    startLoop();

    const handlePointerDown = (e: PointerEvent) => {
      if (!heroSection) return;
      const rect = heroSection.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const list = shootingStarsRef.current;
      for (let i = list.length - 1; i >= 0; i--) {
        const ss = list[i];
        if (ss.age / ss.maxAge >= 1) continue;
        const dx = cx - ss.headX;
        const dy = cy - ss.headY;
        if (Math.hypot(dx, dy) <= CATCH_RADIUS) {
          const hx = ss.headX, hy = ss.headY, col = ss.color;
          list.splice(i, 1);
          burstRef.current = { x: hx, y: hy, color: col, start: performance.now() };
          setScore((s) => s + 1);
          setShowCounter(true);
          setIsPulsing(true);
          window.setTimeout(() => setIsPulsing(false), 420);
          e.stopPropagation();
          break;
        }
      }
    };

    if (heroSection) heroSection.addEventListener('pointerdown', handlePointerDown);

    return () => {
      stopLoop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      if (shootTimeout) clearTimeout(shootTimeout);
      if (heroSection) {
        heroSection.removeEventListener('pointermove', handlePointerMove);
        heroSection.removeEventListener('pointerleave', handlePointerLeave);
        heroSection.removeEventListener('pointerdown', handlePointerDown);
      }
    };
  }, [reducedMotion]);

  return (
    <>
      <canvas ref={canvasRef} className={classes.starfieldCanvas} aria-hidden="true" />
      {showCounter && (
        <div
          className={`${classes.scoreCounter} ${classes.visible} ${isPulsing ? classes.pulse : ''}`}
          aria-label={`Caught ${score} shooting stars`}
          role="status"
          aria-live="polite"
        >
          ⭐ {score}
        </div>
      )}
    </>
  );
}
