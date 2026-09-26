/*
 * Shared motion engine. Imported once by BaseLayout; section scripts import
 * { gsap, ScrollTrigger, reduced, onReady } from here so they share one GSAP/Lenis instance.
 *
 * Declarative hooks (no per-section JS needed):
 *   data-reveal                 fade-up on enter (data-reveal="fade" = opacity only)
 *   data-reveal-group           children with [data-reveal] stagger in together
 *   data-split                  headline split into masked lines, revealed on load/enter
 *   data-count="1490"           number counts up once (data-prefix / data-suffix / data-decimals)
 *   data-magnetic               retired (no-op); kept so older markup stays valid
 *   data-parallax="0.15"        element drifts vertically with scroll (fraction of section height)
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
export { gsap, ScrollTrigger, SplitText };

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

const readyQueue: Array<() => void> = [];
let booted = false;
/** Run a section initialiser after fonts + the engine are ready. */
export function onReady(fn: () => void) {
  if (booted) fn();
  else readyQueue.push(fn);
}

function initLenis() {
  if (reduced) return;
  // lerp 0.1 is the documented smooth-without-lag setting: gentle, never floaty.
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 0.9 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Smooth in-page anchor links.
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis?.scrollTo(target as HTMLElement, { offset: -80 });
    });
  });
}

function initSplits() {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    const split = new SplitText(el, { type: 'lines', linesClass: 'line', autoSplit: false });
    split.lines.forEach((line) => {
      const inner = document.createElement('span');
      inner.className = 'line-inner';
      while (line.firstChild) inner.appendChild(line.firstChild);
      line.appendChild(inner);
    });
    if (reduced) return;
    const inners = el.querySelectorAll('.line-inner');
    const onLoad = el.hasAttribute('data-split-load');
    gsap.to(inners, {
      yPercent: 0,
      y: 0,
      duration: 0.95,
      ease: 'power3.out',
      stagger: 0.07,
      delay: onLoad ? 0.15 : 0,
      scrollTrigger: onLoad ? undefined : { trigger: el, start: 'top 85%', once: true },
    });
  });
}

function initReveals() {
  if (reduced) return;
  const grouped = new Set<Element>();
  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
    const items = group.querySelectorAll<HTMLElement>('[data-reveal]');
    items.forEach((i) => grouped.add(i));
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      stagger: Number(group.dataset.revealGroup) || 0.06,
      scrollTrigger: { trigger: group, start: 'top 82%', once: true },
    });
  });
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    if (grouped.has(el)) return;
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      delay: Number(el.dataset.revealDelay) || 0,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
}

function initCounts() {
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const fmt = (n: number) => prefix + n.toLocaleString('en-ZA', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).replace(/ /g, ' ') + suffix;
    if (reduced) { el.textContent = fmt(end); return; }
    const obj = { v: 0 };
    el.textContent = fmt(0);
    gsap.to(obj, {
      v: end,
      duration: 1.4,
      ease: 'power2.out',
      onUpdate: () => { el.textContent = fmt(obj.v); },
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}

/* Magnetic hover is retired: it reads as a gimmick and fights a calm brand.
   The data-magnetic attribute is kept as a no-op so markup can stay unchanged. */
function initMagnetic() {
  /* no-op */
}

function initParallax() {
  if (reduced) return;
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const amt = Number(el.dataset.parallax) || 0.1;
    gsap.fromTo(el, { yPercent: amt * 100 }, {
      yPercent: -amt * 100,
      ease: 'none',
      scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/* Cards with [data-spotlight] get --mx/--my custom properties for a cursor-follow glow. */
function initSpotlight() {
  if (!finePointer) return;
  document.querySelectorAll<HTMLElement>('[data-spotlight]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

async function boot() {
  (window as unknown as { __motion: boolean }).__motion = true;
  document.documentElement.classList.add('js');
  try { await document.fonts.ready; } catch { /* ignore */ }
  initLenis();
  initSplits();
  initReveals();
  initCounts();
  initMagnetic();
  initParallax();
  initSpotlight();
  booted = true;
  readyQueue.splice(0).forEach((fn) => fn());
  ScrollTrigger.refresh();
}

boot();
