/*
 * Engraved rosette: a guilloche medallion (the security-print pattern on deeds, banknotes and
 * certificates), drawn line by line on canvas. Adapted from the ThreeUI Community "Engraved
 * Certificate" (github.com/MengTo/threeui, MIT, copyright (c) 2026 Meng To; full notice in
 * docs/THIRD-PARTY-NOTICES.md). Changes: the medallion only, no certificate sheet or text; one
 * ink colour passed in by the caller; the drifting layer follows scroll and idles slowly;
 * off-screen pausing and a single static frame for reduced motion.
 *
 * Markup contract: [data-rosette] holds canvas[data-rosette-base] and canvas[data-rosette-drift].
 */
import { ScrollTrigger, reduced } from '../motion';

const TAU = Math.PI * 2;
type Ink = (a: number) => string;
type RosetteOpts = { A: number; d: number; m: number; n: number; pts: number; alpha: number; lw: number; dir?: number; shrink?: number; phase?: number };

function rosette(ctx: CanvasRenderingContext2D, ink: Ink, cx: number, cy: number, o: RosetteOpts) {
  const dir = o.dir ?? 1;
  const shrink = o.shrink ?? 0.06;
  ctx.lineWidth = o.lw;
  ctx.strokeStyle = ink(o.alpha);
  ctx.lineJoin = 'round';
  ctx.beginPath();
  for (let k = 0; k < o.n; k++) {
    const f = k / o.n;
    const phi = (o.phase ?? 0) + dir * f * TAU;
    const a = o.A * (1 - shrink * f);
    for (let i = 0; i <= o.pts; i++) {
      const t = (i / o.pts) * TAU;
      const x = cx + a * Math.cos(t) + o.d * Math.cos(o.m * t + phi);
      const y = cy + a * Math.sin(t) - o.d * Math.sin(o.m * t + phi);
      if (i) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    }
  }
  ctx.stroke();
}

/** A wavy band of K phase-shifted sine lines around a circle (the medallion's rim). */
function rimBand(ctx: CanvasRenderingContext2D, ink: Ink, cx: number, cy: number, r: number, amp: number, waves: number, K: number, alpha: number) {
  const M = 720;
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = ink(alpha);
  ctx.beginPath();
  for (let k = 0; k < K; k++) {
    const ph = (k / K) * TAU;
    for (let i = 0; i <= M; i++) {
      const th = (i / M) * TAU;
      const rr = r + amp * Math.sin(waves * th + ph);
      const x = cx + Math.cos(th) * rr;
      const y = cy + Math.sin(th) * rr;
      if (i) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    }
  }
  ctx.stroke();
  for (const [off, a] of [[-amp - 2, alpha * 1.1], [amp + 2, alpha * 0.9]] as const) {
    ctx.beginPath();
    ctx.arc(cx, cy, r + off, 0, TAU);
    ctx.strokeStyle = ink(a);
    ctx.lineWidth = 0.6;
    ctx.stroke();
  }
}

export function mountEngravedRosette(root: HTMLElement, rgb: [number, number, number], strength = 1) {
  const base = root.querySelector<HTMLCanvasElement>('[data-rosette-base]');
  const drift = root.querySelector<HTMLCanvasElement>('[data-rosette-drift]');
  const bctx = base?.getContext('2d');
  const dctx = drift?.getContext('2d');
  if (!base || !drift || !bctx || !dctx) return;
  const ink: Ink = (a) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${(a * strength).toFixed(3)})`;

  let size = 0;
  const fit = (c: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.max(2, Math.round(size * dpr));
    c.height = c.width;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
  };

  const drawBase = () => {
    fit(base, bctx);
    const c = size / 2;
    const R = size / 2;
    rimBand(bctx, ink, c, c, R * 0.93, R * 0.03, 60, 7, 0.32);
    rosette(bctx, ink, c, c, { A: R * 0.655, d: R * 0.215, m: 11, n: 58, pts: 520, alpha: 0.42, lw: 0.5, shrink: 0.035, phase: 0.2 });
    rosette(bctx, ink, c, c, { A: R * 0.335, d: R * 0.115, m: 19, n: 44, pts: 420, alpha: 0.38, lw: 0.5, dir: -1, shrink: 0.05, phase: 0.9 });
    bctx.beginPath();
    bctx.arc(c, c, R * 0.07, 0, TAU);
    bctx.strokeStyle = ink(0.32);
    bctx.lineWidth = 0.6;
    bctx.stroke();
  };

  let phase = 0;
  const drawDrift = () => {
    if (!size) return;
    fit(drift, dctx);
    const c = size / 2;
    const R = size / 2;
    rosette(dctx, ink, c, c, { A: R * 0.515, d: R * 0.165, m: 14, n: 34, pts: 360, alpha: 0.3, lw: 0.5, shrink: 0.03, phase });
  };

  const layout = () => {
    size = Math.round(root.clientWidth);
    if (!size) return;
    drawBase();
    drawDrift();
  };
  let rt = 0;
  new ResizeObserver(() => {
    clearTimeout(rt);
    rt = window.setTimeout(layout, 120);
  }).observe(root);
  layout();
  if (reduced) return;

  // The drifting layer turns with scroll, plus a slow idle turn, like a lathe stepping.
  // It redraws at about 12 frames a second, and only while the medallion is on screen.
  let scrollPhase = 0;
  let idle = 0;
  let onScreen = false;
  let timer = 0;
  const tick = () => {
    timer = 0;
    idle += 0.012;
    phase = (scrollPhase + idle) % TAU;
    drawDrift();
    schedule();
  };
  const schedule = () => {
    if (timer || !onScreen || document.hidden) return;
    timer = window.setTimeout(tick, 85);
  };
  const halt = () => {
    clearTimeout(timer);
    timer = 0;
  };
  new IntersectionObserver((entries) => {
    onScreen = entries[0]?.isIntersecting ?? false;
    if (onScreen) schedule();
    else halt();
  }).observe(root);
  document.addEventListener('visibilitychange', () => (document.hidden ? halt() : schedule()));

  ScrollTrigger.create({
    trigger: root.closest('section') ?? root,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (st) => { scrollPhase = st.progress * TAU * 0.6; },
  });
}
