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

interface ConstellationPoint {
  x: number;
  y: number;
  radius: number;
  color: string;
  pulseUntil: number;
}

// Fixed shape — same every load, not random. Simple 6-point hexagon outline
// in the top-left periphery, safely outside the heroContent keep-clear zone.
const CONSTELLATION_NORM: ReadonlyArray<{ x: number; y: number }> = [
  { x: 0.28, y: 0.22 },
  { x: 0.24, y: 0.15 },
  { x: 0.16, y: 0.15 },
  { x: 0.12, y: 0.22 },
  { x: 0.16, y: 0.29 },
  { x: 0.24, y: 0.29 },
];

const CONSTELLATION_LINE_COLOR = '#a78bfa';
const CONSTELLATION_HIT_RADIUS = 22;

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  // constellation session state
  const [showToast, setShowToast] = useState(false);
  const [toastPos, setToastPos] = useState<{ x: number; y: number } | null>(null);
  const constellationRef = useRef<ConstellationPoint[]>([]);
  const constellationStateRef = useRef<{
    nextIndex: number;
    segments: Array<{ from: number; to: number; start: number }>;
    completed: boolean;
    completedAt: number | null;
  }>({ nextIndex: 0, segments: [], completed: false, completedAt: null });

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

    const buildConstellation = (w: number, h: number) => {
      constellationRef.current = CONSTELLATION_NORM.map((p) => ({
        x: p.x * w,
        y: p.y * h,
        radius: 1.35,
        color: '#ffffff',
        pulseUntil: 0,
      }));
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
      buildConstellation(width, height);
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

    const INFLUENCE_RADIUS = 140;
    const MAX_DISPLACEMENT = 8;

    const drawFrame = (now: number) => {
      if (!lastTime) lastTime = now;
      const dt = Math.min(100, now - lastTime);
      lastTime = now;
      ctx.clearRect(0, 0, width, height);

      const speeds = { distant: 0.005, mid: 0.012, near: 0.025 };

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

      // constellation: lines (draw before points so points sit on top)
      const cPoints = constellationRef.current;
      const cState = constellationStateRef.current;
      if (cPoints.length && cState.segments.length) {
        const isCompleted = cState.completed;
        const completedAt = cState.completedAt ?? 0;
        let glowFactor = 0;
        if (isCompleted && !reducedMotion) {
          const gElapsed = now - completedAt;
          if (gElapsed < 700) glowFactor = 1 - gElapsed / 700;
        }

        for (let s = 0; s < cState.segments.length; s++) {
          const seg = cState.segments[s];
          const a = cPoints[seg.from];
          const b = cPoints[seg.to];
          if (!a || !b) continue;
          const segElapsed = now - seg.start;
          const segDur = reducedMotion ? 0 : 360;
          const tProg = segDur === 0 ? 1 : Math.min(1, segElapsed / segDur);
          const bx = a.x + (b.x - a.x) * tProg;
          const by = a.y + (b.y - a.y) * tProg;

          ctx.save();
          const baseAlpha = isCompleted ? 0.38 : 0.32;
          const alpha = baseAlpha + glowFactor * 0.42;
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = CONSTELLATION_LINE_COLOR;
          ctx.lineWidth = isCompleted ? 1.35 : 1.05;
          if (glowFactor > 0) {
            ctx.shadowColor = CONSTELLATION_LINE_COLOR;
            ctx.shadowBlur = 8 * glowFactor;
          }
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(bx, by);
          ctx.stroke();
          ctx.restore();
        }
      }

      // constellation points — normal-looking stars, pulse on correct click
      for (let i = 0; i < cPoints.length; i++) {
        const cp = cPoints[i];
        const isDone = i < cState.nextIndex || cState.completed;
        ctx.save();
        const foundAlpha = isDone ? 0.98 : 0.88;
        const pulseActive = now < cp.pulseUntil;
        if (pulseActive && !reducedMotion) {
          const pT = (cp.pulseUntil - now) / 380;
          ctx.globalAlpha = 0.28 * pT;
          ctx.fillStyle = CONSTELLATION_LINE_COLOR;
          ctx.beginPath();
          ctx.arc(cp.x, cp.y, cp.radius * (3.2 + (1 - pT) * 1.2), 0, Math.PI * 2);
          ctx.fill();
        } else if (pulseActive && reducedMotion) {
          ctx.globalAlpha = 0.22;
          ctx.fillStyle = CONSTELLATION_LINE_COLOR;
          ctx.beginPath();
          ctx.arc(cp.x, cp.y, cp.radius * 3.0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = foundAlpha;
        ctx.fillStyle = cp.color;
        if (cState.completed) {
          ctx.shadowColor = CONSTELLATION_LINE_COLOR;
          ctx.shadowBlur = 4;
        }
        ctx.beginPath();
        ctx.arc(cp.x, cp.y, cp.radius, 0, Math.PI * 2);
        ctx.fill();
        if (isDone) {
          ctx.globalAlpha = 0.18;
          ctx.fillStyle = CONSTELLATION_LINE_COLOR;
          ctx.beginPath();
          ctx.arc(cp.x, cp.y, cp.radius * 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
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

      const cPoints = constellationRef.current;
      const cState = constellationStateRef.current;
      if (cState.completed) return;
      let hitIndex = -1;
      let hitDist = Infinity;
      for (let i = 0; i < cPoints.length; i++) {
        const dx = cx - cPoints[i].x;
        const dy = cy - cPoints[i].y;
        const d = Math.hypot(dx, dy);
        if (d <= CONSTELLATION_HIT_RADIUS && d < hitDist) {
          hitDist = d;
          hitIndex = i;
        }
      }
      if (hitIndex === -1) return;
      if (hitIndex !== cState.nextIndex) return;

      const now = performance.now();
      cPoints[hitIndex].pulseUntil = now + 380;

      if (cState.nextIndex > 0) {
        const from = cState.nextIndex - 1;
        const to = hitIndex;
        cState.segments.push({ from, to, start: now });
      }

      cState.nextIndex += 1;
      e.stopPropagation();

      if (cState.nextIndex >= cPoints.length) {
        cState.completed = true;
        cState.completedAt = now;
        let sx = 0, sy = 0;
        for (let i = 0; i < cPoints.length; i++) { sx += cPoints[i].x; sy += cPoints[i].y; }
        const cx0 = sx / cPoints.length;
        const cy0 = sy / cPoints.length;
        setToastPos({ x: cx0, y: cy0 + 34 });
        setShowToast(true);
        window.setTimeout(() => setShowToast(false), 2600);
      }
    };

    if (heroSection) heroSection.addEventListener('pointerdown', handlePointerDown);

    return () => {
      stopLoop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
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
      {showToast && toastPos && (
        <div
          className={classes.constellationToast}
          role="status"
          aria-live="polite"
          style={{ left: `${toastPos.x}px`, top: `${toastPos.y}px` }}
        >
          constellation found
        </div>
      )}
    </>
  );
}
