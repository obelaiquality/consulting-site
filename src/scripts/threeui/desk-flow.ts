/*
 * Desk to register: three scattered sources (an email, a shared drive, an old spreadsheet) each
 * hand one fact to one record (the approval, the current version, the expiry date). A trail of
 * dots carries each fact along a curve into its field. The dot trail is adapted from the ThreeUI
 * Community "Gateway Flow" canvas (github.com/MengTo/threeui, MIT, copyright (c) 2026 Meng To;
 * full notice in docs/THIRD-PARTY-NOTICES.md). Changes: one trail per fact, driven by scroll
 * (scrubbed, so the dots stop when the reader stops), paper/ink/green palette, anchored to HTML.
 *
 * Markup contract (components/sections/ProblemScroll.astro):
 *   [data-desk]                    root
 *     canvas[data-desk-dots]       overlay for the trails (desktop only)
 *     [data-frag]                  source fragments; [data-src="key"] marks the fact inside
 *     [data-rec]                   the record; [data-dst="key"] marks the field it fills
 */
import { gsap, reduced } from '../motion';

type Pt = { x: number; y: number };
const KEYS = ['expiry', 'version', 'approval'] as const;
const STONE = [120, 120, 110];
const GREEN = [22, 101, 52];
const DOTS = 40;
// Timeline layout (seconds of timeline time; the scroll scrubs through it).
const STEP = 1.1;   // one fact per step
const TRAIL = 0.8;  // how long a trail takes to arrive
const START = 0.3;
const END = START + KEYS.length * STEP + 0.6;

const bez = (t: number, a: number, b: number, c: number, d: number) => {
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
};
const clamp = (v: number) => Math.min(1, Math.max(0, v));

export function mountDeskFlow(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-desk-dots]');
  const rec = root.querySelector<HTMLElement>('[data-rec]');
  const frags = Array.from(root.querySelectorAll<HTMLElement>('[data-frag]'));
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx || !rec) return;
  const src = (k: string) => root.querySelector<HTMLElement>(`[data-src="${k}"]`);
  const dst = (k: string) => root.querySelector<HTMLElement>(`[data-dst="${k}"]`);

  // Final state, with no motion: every fact filed, the record validated.
  const finish = () => {
    KEYS.forEach((k) => { src(k)?.classList.add('is-lit'); dst(k)?.classList.add('is-filled'); });
    rec.classList.add('is-done');
    root.classList.add('is-done');
  };
  if (reduced) { finish(); return; }

  let w = 0;
  let h = 0;
  const fit = () => {
    const r = root.getBoundingClientRect();
    w = r.width;
    h = r.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(2, Math.round(w * dpr));
    canvas.height = Math.max(2, Math.round(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  /** Curve from the fact's right edge to the field's left edge, read live (fragments move). */
  const path = (k: string) => {
    const a = src(k)?.getBoundingClientRect();
    const b = dst(k)?.getBoundingClientRect();
    if (!a || !b || !a.width || !b.width) return null;
    const r = root.getBoundingClientRect();
    const p0: Pt = { x: a.right - r.left + 6, y: a.top - r.top + a.height / 2 };
    const p3: Pt = { x: b.left - r.left - 8, y: b.top - r.top + b.height / 2 };
    const dx = Math.max(60, p3.x - p0.x);
    return { p0, p1: { x: p0.x + dx * 0.45, y: p0.y }, p2: { x: p3.x - dx * 0.45, y: p3.y }, p3 };
  };

  const draw = (time: number) => {
    ctx.clearRect(0, 0, w, h);
    if (getComputedStyle(canvas).display === 'none') return;
    KEYS.forEach((k, i) => {
      const t0 = START + i * STEP;
      const p = (time - t0) / TRAIL;           // 0..1 while the trail runs
      if (p <= 0 || p >= 1.6) return;
      const c = path(k);
      if (!c) return;
      const fade = p < 1 ? 1 : 1 - (p - 1) / 0.6; // the trail fades after it lands
      // The faint dotted route, as in the original Gateway Flow.
      ctx.setLineDash([1, 4]);
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(17, 17, 16, ${(0.22 * fade).toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(c.p0.x, c.p0.y);
      ctx.bezierCurveTo(c.p1.x, c.p1.y, c.p2.x, c.p2.y, c.p3.x, c.p3.y);
      ctx.stroke();
      ctx.setLineDash([]);
      // A train of dots; the head reaches the field when p = 1.
      for (let j = 0; j < DOTS; j++) {
        const u = clamp(p * 1.35 - (j / DOTS) * 0.35);
        if (u <= 0 || u >= 1) continue;
        const x = bez(u, c.p0.x, c.p1.x, c.p2.x, c.p3.x);
        const y = bez(u, c.p0.y, c.p1.y, c.p2.y, c.p3.y);
        const g = clamp((u - 0.45) / 0.5);
        const col = STONE.map((v, n) => Math.round(v + (GREEN[n] - v) * g));
        const a = fade * (0.45 + 0.55 * (1 - j / DOTS));
        ctx.fillStyle = `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${a.toFixed(3)})`;
        const s = 2.4 + g * 1.2;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
    });
  };

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: root, start: 'top 72%', end: 'bottom 62%', scrub: 0.6 },
    onUpdate: () => {
      const time = tl.time();
      // Scrub-safe: states are derived from the playhead, so scrolling back undoes them.
      KEYS.forEach((k, i) => {
        const t0 = START + i * STEP;
        src(k)?.classList.toggle('is-lit', time > t0);
        dst(k)?.classList.toggle('is-filled', time > t0 + TRAIL);
      });
      const done = time > START + (KEYS.length - 1) * STEP + TRAIL + 0.15;
      rec.classList.toggle('is-done', done);
      root.classList.toggle('is-done', done);
      draw(time);
    },
  });
  // Fragments start a little scattered and settle as their fact is filed (transform only).
  frags.forEach((el, i) => {
    tl.fromTo(el, { y: 18 * (i % 2 ? -1 : 1) }, { y: 0, duration: END }, 0);
  });
  tl.set({}, {}, END);

  fit();
  let rt = 0;
  new ResizeObserver(() => {
    clearTimeout(rt);
    rt = window.setTimeout(() => { fit(); draw(tl.time()); }, 80);
  }).observe(root);
}
