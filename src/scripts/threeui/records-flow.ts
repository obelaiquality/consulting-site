/*
 * Records flow: dotted paths carry records from scattered places (inbox, shared drive, email,
 * spreadsheets) into one Obel-MS node. Adapted from the ThreeUI Community "Gateway Flow"
 * canvas (github.com/MengTo/threeui, MIT, copyright (c) 2026 Meng To; full notice in
 * docs/THIRD-PARTY-NOTICES.md). Changes: paper/ink/green palette, paths start at real HTML
 * labels and end at the HTML node, a scroll-linked arrival state, softer pointer ripples,
 * off-screen pausing and a static frame for reduced motion.
 *
 * Markup contract (see components/sections/ProblemScroll.astro):
 *   [data-records-flow]            root, position: relative
 *     canvas[data-rf-lines]        static dotted paths (redrawn on resize only)
 *     canvas[data-rf-dots]         moving records (one frame per rAF while on screen)
 *     [data-rf-source] x N         label chips on the left
 *     [data-rf-node]               the destination on the right
 */
import { ScrollTrigger, reduced, finePointer } from '../motion';

type Pt = { x: number; y: number };
type Strand = { p0: Pt; p1: Pt; p2: Pt; p3: Pt };
type Dot = { s: number; t: number; v: number };
type Ripple = { x: number; y: number; r: number; life: number };

const STONE = [120, 120, 110];
const GREEN = [22, 101, 52];
const STRANDS_PER_SOURCE = 12;
const DOTS_PER_STRAND = 2;

const bez = (t: number, a: number, b: number, c: number, d: number) => {
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
};
const smooth = (e0: number, e1: number, x: number) => {
  const k = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return k * k * (3 - 2 * k);
};
/** Small seeded random, so the static (reduced-motion) frame is the same on every load. */
const seeded = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export function mountRecordsFlow(root: HTMLElement) {
  const linesCanvas = root.querySelector<HTMLCanvasElement>('[data-rf-lines]');
  const dotsCanvas = root.querySelector<HTMLCanvasElement>('[data-rf-dots]');
  const node = root.querySelector<HTMLElement>('[data-rf-node]');
  const sources = Array.from(root.querySelectorAll<HTMLElement>('[data-rf-source]'));
  const lctx = linesCanvas?.getContext('2d');
  const dctx = dotsCanvas?.getContext('2d');
  if (!linesCanvas || !dotsCanvas || !node || !sources.length || !lctx || !dctx) return;

  let w = 0;
  let h = 0;
  let strands: Strand[] = [];
  const rnd = seeded(9001);
  const dots: Dot[] = [];
  for (let s = 0; s < sources.length * STRANDS_PER_SOURCE; s++) {
    for (let k = 0; k < DOTS_PER_STRAND; k++) dots.push({ s, t: (k + rnd()) / DOTS_PER_STRAND, v: 0.1 + rnd() * 0.09 });
  }
  let ripples: Ripple[] = [];
  let pointer: Pt | null = null;
  let progress = reduced ? 1 : 0;

  const fit = (c: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.max(2, Math.round(w * dpr));
    c.height = Math.max(2, Math.round(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const layout = () => {
    const r = root.getBoundingClientRect();
    w = r.width;
    h = r.height;
    if (!w || !h) return;
    fit(linesCanvas, lctx);
    fit(dotsCanvas, dctx);
    const nr = node.getBoundingClientRect();
    const rects = sources.map((el) => el.getBoundingClientRect());
    // Side by side (desktop): streams run right into the card's left edge.
    // Stacked (small screens): streams run down into the card's top edge.
    const stacked = nr.left - r.left < Math.max(...rects.map((sr) => sr.right - r.left));
    const end: Pt = stacked
      ? { x: nr.left - r.left + nr.width * 0.8, y: nr.top - r.top - 2 }
      : { x: nr.left - r.left - 2, y: nr.top - r.top + nr.height / 2 };
    const srnd = seeded(77);
    strands = [];
    rects.forEach((sr) => {
      const sx0 = sr.right - r.left + 12;
      const sy = sr.top - r.top + sr.height / 2;
      for (let i = 0; i < STRANDS_PER_SOURCE; i++) {
        const f = i / (STRANDS_PER_SOURCE - 1) - 0.5;
        const fan = f * Math.max(22, sr.height * 1.6) + (srnd() - 0.5) * 6;
        // Feather the start: each strand leaves the word at its own distance and height.
        const sx = sx0 + srnd() * 36;
        const y0 = sy + f * sr.height * 1.1;
        if (stacked) {
          const dy = end.y - sy;
          const right = Math.max(sx + 24, end.x);
          strands.push({
            p0: { x: sx, y: y0 },
            p1: { x: right + fan * 0.5, y: y0 + fan * 0.2 },
            p2: { x: end.x + fan * 0.4, y: sy + dy * 0.55 },
            p3: { x: end.x + f * 6, y: end.y },
          });
        } else {
          const span = end.x - sx;
          strands.push({
            p0: { x: sx, y: y0 },
            p1: { x: sx + span * 0.4, y: sy + fan * 1.4 },
            p2: { x: sx + span * 0.75, y: end.y + fan * 0.3 },
            p3: { x: end.x, y: end.y + f * 4 },
          });
        }
      }
    });
    drawLines();
    if (reduced) drawDots(0);
  };

  const drawLines = () => {
    lctx.clearRect(0, 0, w, h);
    lctx.lineWidth = 1;
    lctx.setLineDash([1, 4]);
    lctx.strokeStyle = 'rgba(17, 17, 16, 0.13)';
    lctx.beginPath();
    for (const s of strands) {
      lctx.moveTo(s.p0.x, s.p0.y);
      lctx.bezierCurveTo(s.p1.x, s.p1.y, s.p2.x, s.p2.y, s.p3.x, s.p3.y);
    }
    lctx.stroke();
    lctx.setLineDash([]);
  };

  let lastHit = 0;
  const hit = (now: number) => {
    if (now - lastHit < 650 || progress < 0.55) return;
    lastHit = now;
    node.classList.remove('is-hit');
    void node.offsetWidth; // restart the CSS ring
    node.classList.add('is-hit');
  };

  const drawDots = (dt: number) => {
    dctx.clearRect(0, 0, w, h);
    const now = performance.now();
    for (const rp of ripples) {
      rp.r += 380 * dt;
      rp.life -= 1.1 * dt;
    }
    ripples = ripples.filter((rp) => rp.life > 0);
    for (const rp of ripples) {
      dctx.strokeStyle = `rgba(17, 17, 16, ${0.1 * rp.life})`;
      dctx.lineWidth = 1;
      dctx.beginPath();
      dctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      dctx.stroke();
    }
    const base = 0.3 + 0.7 * progress;
    for (const d of dots) {
      const s = strands[d.s];
      if (!s) continue;
      d.t += d.v * dt * (0.55 + 0.45 * progress);
      if (d.t > 1) {
        d.t -= 1;
        hit(now);
      }
      let x = bez(d.t, s.p0.x, s.p1.x, s.p2.x, s.p3.x);
      let y = bez(d.t, s.p0.y, s.p1.y, s.p2.y, s.p3.y);
      for (const rp of ripples) {
        const dx = x - rp.x;
        const dy = y - rp.y;
        const dist = Math.hypot(dx, dy) || 1;
        const band = Math.abs(dist - rp.r);
        if (band < 80) {
          const f = (1 - band / 80) * rp.life * 26;
          x += (dx / dist) * f;
          y += (dy / dist) * f;
        }
      }
      if (pointer) {
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < 64) {
          const f = (1 - dist / 64) * 12;
          x += (dx / dist) * f;
          y += (dy / dist) * f;
        }
      }
      const g = smooth(0.5, 0.96, d.t) * progress;
      const c = STONE.map((v, i) => Math.round(v + (GREEN[i] - v) * g));
      const a = base * smooth(0, 0.06, d.t) * (1 - smooth(0.97, 1, d.t));
      dctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a.toFixed(3)})`;
      const size = 2 + g * 0.8;
      dctx.fillRect(x - size / 2, y - size / 2, size, size);
    }
  };

  // Frame loop, paused while off screen or in a background tab.
  let raf = 0;
  let last = 0;
  let onScreen = false;
  const frame = (now: number) => {
    raf = 0;
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
    last = now;
    drawDots(dt);
    schedule();
  };
  const schedule = () => {
    if (raf || reduced || !onScreen || document.hidden) return;
    raf = requestAnimationFrame(frame);
  };
  const halt = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
  };

  new IntersectionObserver((entries) => {
    onScreen = entries[0]?.isIntersecting ?? false;
    if (onScreen) schedule();
    else halt();
  }, { rootMargin: '80px' }).observe(root);
  document.addEventListener('visibilitychange', () => (document.hidden ? halt() : schedule()));

  let resizeTimer = 0;
  new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(layout, 80);
  }).observe(root);
  layout();

  if (reduced) {
    node.classList.add('is-on');
    root.classList.add('is-on');
    return;
  }

  // The flow wakes up while the problem statement fills in above it.
  ScrollTrigger.create({
    trigger: root.closest('section') ?? root,
    start: 'top 75%',
    end: 'bottom 45%',
    onUpdate: (st) => {
      progress = st.progress;
      node.classList.toggle('is-on', progress > 0.55);
      root.classList.toggle('is-on', progress > 0.55);
    },
    onLeave: () => { progress = 1; node.classList.add('is-on'); root.classList.add('is-on'); },
  });

  root.addEventListener('pointerdown', (e) => {
    const r = root.getBoundingClientRect();
    ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, r: 0, life: 1 });
    if (ripples.length > 4) ripples.shift();
  });
  if (finePointer) {
    root.addEventListener('pointermove', (e) => {
      const r = root.getBoundingClientRect();
      pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
    });
    root.addEventListener('pointerleave', () => { pointer = null; });
  }
}
