import { useEffect, useRef, useState } from 'react';
import { hero, work } from '../content/site';
import { useOverlay } from '../lib/overlay';
import { gsap, scrollToId, useReducedMotion } from '../lib/motion';
import { Arrow } from './Icons';
import { GridLines, ShotFrame } from './Shared';

const DOTS = [
  { col: 2, d: 11, delay: 1.2 },
  { col: 7, d: 14, delay: 4 },
  { col: 10, d: 9.5, delay: 7.5 },
];

function TitleLetters({ text }: { text: string }) {
  const words = text.split(' ');
  const total = Array.from(text.replace(/ /g, '')).length;
  const mid = (total - 1) / 2;
  let n = 0;
  return (
    <span aria-hidden="true">
      {words.map((w, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {Array.from(w).map((c, ci) => {
            const r = Math.abs(n++ - mid);
            return (
              <span key={ci} className="rise" style={{ ['--r' as string]: r }}>
                {c}
              </span>
            );
          })}
          {wi < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const { openDrawer } = useOverlay();
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(true);
  const root = useRef<HTMLElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const shots = work.projects.map((p) => ({ shot: p.shots[0], name: p.name, status: p.status.split(' · ')[0] }));

  // cycle the work window while it is on screen
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    if (windowRef.current) io.observe(windowRef.current);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (reduced || !inView) return;
    const t = window.setInterval(() => { if (!document.hidden) setActive((a) => (a + 1) % shots.length); }, 3600);
    return () => window.clearInterval(t);
  }, [reduced, inView, shots.length]);

  // entrance + gentle scroll drift
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    // wait for the first-visit loader to start leaving, so the title rises into view rather than behind it
    (window.fellerLoader ?? Promise.resolve()).then(() => requestAnimationFrame(() => el.classList.add('is-in')));
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.to('[data-drift="title"]', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('[data-drift="window"]', { yPercent: -10, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="top" ref={root} data-surface="dark" className="hero relative isolate overflow-clip bg-ink" aria-labelledby="hero-title">
      <GridLines dots={reduced ? [] : DOTS} />
      <div className="wrap relative z-10 grid min-h-[100svh] grid-rows-[1fr_auto] pt-[calc(var(--header-h)+clamp(28px,6vh,72px))] pb-[clamp(28px,7vh,72px)] lg:min-h-[max(100svh,720px)]">
        <h1 id="hero-title" data-drift="title" className="self-start font-extrabold leading-[0.92] tracking-[-0.015em]" style={{ fontSize: 'var(--fs-display)' }}>
          <span className="hero-light mb-[0.12em] block font-extralight leading-[1.05]" style={{ fontSize: 'var(--fs-display-light)' }}>
            {hero.lineLight}
          </span>{' '}
          <span className="sr-only">{hero.title}.</span>
          <TitleLetters text={hero.title} />
          <span className="dot rise" style={{ ['--r' as string]: 0 }} aria-hidden="true">.</span>
        </h1>

        <div className="mt-10 grid items-end gap-10 lg:mt-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <div className="hero-copy grid max-w-[34rem] gap-7">
            <p className="font-light leading-[1.45] text-cream/85" style={{ fontSize: 'var(--fs-lead)' }}>
              {hero.sub}
            </p>
            <div className="flex flex-wrap gap-3">
              <button type="button" className="btn btn-solid" onClick={openDrawer}>
                {hero.primary}
                <Arrow />
              </button>
              <a href="#work" className="btn" onClick={(e) => { e.preventDefault(); scrollToId('work'); }}>
                {hero.secondary}
              </a>
            </div>
            <p className="hidden text-[13px] tracking-[0.22em] text-muted uppercase md:block" dir="ltr" style={{ textAlign: 'right' }}>
              {hero.meta}
            </p>
          </div>

          <div ref={windowRef} data-drift="window" className="hero-window justify-self-stretch lg:justify-self-end lg:w-full lg:max-w-[600px]">
            <div className="relative">
              {shots.map((s, i) => (
                <div
                  key={s.name}
                  className={`transition-[opacity,clip-path,transform] duration-[900ms] ease-[var(--ease-out)] ${i === 0 ? 'relative' : 'absolute inset-0'} ${i === active ? 'opacity-100 [clip-path:inset(0_0_0_0_round_12px)]' : 'pointer-events-none opacity-0 [clip-path:inset(0_0_0_100%_round_12px)]'}`}
                  aria-hidden={i !== active}
                >
                  <ShotFrame shot={s.shot} sizesAttr="(min-width:1024px) 600px, 92vw" eager={i === 0} />
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-[14px] text-muted" aria-live="off">
              <span>
                <span className="font-semibold text-cream">{shots[active].name}</span> · {shots[active].status}
              </span>
              <span dir="ltr" className="tabular-nums">
                {active + 1} / {shots.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
