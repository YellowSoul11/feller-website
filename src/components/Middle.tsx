import { useEffect, useRef } from 'react';
import { about, process, services, statement } from '../content/site';
import { useOverlay } from '../lib/overlay';
import { gsap, ScrollTrigger, useReducedMotion } from '../lib/motion';
import { Arrow } from './Icons';
import { GridLines } from './Shared';

/** Adds .is-in to [data-reveal] children once they enter the viewport. Content is visible without JS-driven motion. */
function useReveal(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const items = el.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }),
      { rootMargin: '0px 0px -10% 0px', threshold: 0.01 },
    );
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, [root]);
}

export function Statement() {
  const reduced = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const words = `${statement.before} ${statement.accent}${statement.after}`.split(' ');
  const accentAt = statement.before.split(' ').length;

  // one-time timed reveal: once the sentence is on screen it sharpens word by word and then stays fully readable
  useEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('is-in'); io.disconnect(); } }, { threshold: 0.35 });
    const target = el.querySelector('p');
    if (target) io.observe(target);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <section ref={root} data-surface="dark" className={`statement relative isolate bg-ink ${reduced ? '' : 'is-live'}`} aria-label="מה חשוב באמת">
      <GridLines />
      <div className="statement-stage wrap z-10 grid place-items-center">
        <p className="max-w-[24ch] text-center font-light leading-[1.22] text-cream" style={{ fontSize: 'clamp(1.9rem, 1.2rem + 2.9vw, 4rem)' }}>
          {words.map((w, i) => {
            const isAccent = i === accentAt;
            const clean = isAccent ? w.replace(statement.after.split(' ')[0], '') : w;
            return (
              <span key={i}>
                <span className={`sw ${isAccent ? 'font-semibold' : ''}`} style={{ ['--i' as string]: i }}>
                  {isAccent ? (
                    <>
                      <span className="dot">{clean}</span>
                      {w.slice(clean.length)}
                    </>
                  ) : (
                    w
                  )}
                </span>{' '}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}

export function Services() {
  const root = useRef<HTMLElement>(null);
  const { openDrawer } = useOverlay();
  useReveal(root);
  return (
    <section ref={root} id="services" data-surface="dark" className="relative isolate bg-ink py-[clamp(96px,14vh,180px)]" aria-labelledby="services-title">
      <GridLines />
      <div className="wrap relative z-10">
        <h2 id="services-title" data-reveal className="reveal font-extrabold leading-[0.95]" style={{ fontSize: 'var(--fs-h2)' }}>
          {services.title}
          <span className="dot">.</span>
        </h2>

        <div data-reveal className="reveal mt-[clamp(40px,6vw,80px)] grid gap-8 border-t border-[var(--line-strong)] pt-[clamp(28px,3vw,40px)] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16">
          <div className="grid content-start gap-5">
            <h3 className="font-extrabold leading-[1]" style={{ fontSize: 'clamp(2.2rem, 1.4rem + 3.3vw, 4.25rem)' }}>
              {services.core.name}
            </h3>
            <p className="max-w-[46ch] text-cream/80">{services.core.desc}</p>
            <div className="mt-2 grid max-w-[46ch] gap-1 rounded-2xl bg-ink-2 p-5 md:p-6">
              <p className="font-bold text-cream">{services.core.rapidName}</p>
              <p className="text-cream/75">{services.core.rapid}</p>
            </div>
            <div className="mt-2">
              <button type="button" onClick={openDrawer} className="btn">
                בואו נדבר על האתר שלכם
                <Arrow />
              </button>
            </div>
          </div>
          <figure className="self-start" aria-hidden="true">
            <div className="browser">
              <div className="browser-bar"><b /><b /><b /></div>
              <img src="assets/projects/gali-desktop-0-1600.webp" srcSet="assets/projects/gali-desktop-0-960.webp 960w, assets/projects/gali-desktop-0-1600.webp 1600w" sizes="(min-width:1024px) 40vw, 92vw" width={1600} height={1000} alt="" loading="lazy" decoding="async" />
            </div>
          </figure>
        </div>

        <div className="mt-[clamp(56px,7vw,96px)]">
          <h3 data-reveal className="reveal mb-4 font-semibold text-muted" style={{ fontSize: 'var(--fs-meta)' }}>
            {services.extensionsTitle}
          </h3>
          <ul className="border-t border-[var(--line-strong)]">
            {services.extensions.map((x, i) => (
              <li key={x.name} data-reveal className="svc-row reveal grid gap-2 border-b border-[var(--line-strong)] py-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] md:items-baseline md:gap-10 md:py-8" style={{ ['--i' as string]: i }}>
                <p className="font-extrabold leading-[1.1]" style={{ fontSize: 'var(--fs-h3)' }}>
                  {x.name}
                </p>
                <p className="max-w-[52ch] text-cream/75">{x.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function About() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { openDrawer } = useOverlay();
  useReveal(root);
  useEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-portrait', { yPercent: 14 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'center center', scrub: true } });
      gsap.fromTo('.about-big', { yPercent: 30 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 25%', scrub: true } });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={root} id="about" data-surface="light" className="on-light relative isolate overflow-clip border-b border-ink/15 bg-cream text-ink" aria-labelledby="about-title">
      <GridLines />
      <div className="wrap relative z-10 grid pt-[clamp(96px,12vh,150px)] lg:min-h-[max(100svh,820px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-10">
        <p className="about-big pointer-events-none select-none whitespace-nowrap text-center font-extrabold leading-[0.88] tracking-[-0.02em] lg:col-span-3 lg:col-start-1 lg:row-start-1" aria-hidden="true" style={{ fontSize: 'min(14.5vw, 15rem)' }}>
          {about.big}
        </p>

        <div className="relative z-20 grid content-end gap-4 pt-10 pb-10 lg:col-start-1 lg:row-start-2 lg:pb-[clamp(56px,10vh,110px)]">
          <h2 id="about-title" data-reveal className="reveal font-extrabold leading-[1] text-lavender-deep" style={{ fontSize: 'clamp(2rem, 1.5rem + 2vw, 3rem)' }}>
            {about.title}
          </h2>
          <p data-reveal className="reveal max-w-[40ch]">{about.p1}</p>
        </div>

        <div className="relative z-10 -mt-[clamp(40px,8vw,150px)] flex justify-center lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-[clamp(110px,14vw,240px)] lg:items-end">
          <picture className="about-portrait block w-[min(78vw,420px)] lg:w-[min(32vw,470px)]">
            <source type="image/avif" srcSet="assets/portrait/liem-34hd-480.avif 480w, assets/portrait/liem-34hd-800.avif 800w, assets/portrait/liem-34hd-1200.avif 1200w, assets/portrait/liem-34hd-1604.avif 1604w" sizes="(min-width:1024px) 32vw, 78vw" />
            <img src="assets/portrait/liem-34hd-1200.webp" srcSet="assets/portrait/liem-34hd-480.webp 480w, assets/portrait/liem-34hd-800.webp 800w, assets/portrait/liem-34hd-1200.webp 1200w, assets/portrait/liem-34hd-1604.webp 1604w" sizes="(min-width:1024px) 32vw, 78vw" width={1604} height={2366} alt={about.portraitAlt} loading="lazy" decoding="async" className="block h-auto w-full" />
          </picture>
        </div>

        <div className="relative z-20 grid content-end gap-6 py-10 lg:col-start-3 lg:row-start-2 lg:pb-[clamp(56px,10vh,110px)]">
          <p data-reveal className="reveal max-w-[40ch]">{about.p2}</p>
          <p data-reveal className="reveal max-w-[24ch] text-[1.35rem] font-semibold leading-[1.3]">
            {about.belief}
          </p>
          <div data-reveal className="reveal">
            <button type="button" onClick={openDrawer} className="btn btn-ghost-ink">
              {about.cta}
              <Arrow />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Process() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useReveal(root);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const steps = Array.from(el.querySelectorAll<HTMLElement>('.step'));
    if (reduced) {
      el.style.setProperty('--fill', '1');
      steps.forEach((s) => s.classList.add('is-lit'));
      return;
    }
    const st = ScrollTrigger.create({
      trigger: el.querySelector('.steps'),
      start: 'top 75%',
      end: 'bottom 55%',
      onUpdate: (self) => {
        el.style.setProperty('--fill', self.progress.toFixed(4));
        steps.forEach((s, i) => s.classList.toggle('is-lit', self.progress >= i / (steps.length - 1) - 0.02));
      },
    });
    return () => st.kill();
  }, [reduced]);

  return (
    <section ref={root} id="process" data-surface="light" className="on-light relative isolate bg-cream pt-[clamp(72px,10vh,120px)] pb-[clamp(110px,16vh,200px)] text-ink" aria-labelledby="process-title">
      <GridLines />
      <div className="wrap relative z-10">
        <h2 id="process-title" data-reveal className="reveal font-extrabold leading-[0.95]" style={{ fontSize: 'var(--fs-h2)' }}>
          {process.title}
          <span className="text-lavender-deep">.</span>
        </h2>
        <ol className="steps relative mt-[clamp(48px,7vw,96px)] grid gap-10 lg:grid-cols-5 lg:gap-8">
          <span className="steps-line" aria-hidden="true"><span /></span>
          {process.steps.map((s, i) => (
            <li key={s.name} className="step relative grid content-start gap-3 ps-10 lg:ps-0 lg:pt-12" data-last={i === process.steps.length - 1 ? '' : undefined}>
              <span className="step-dot" aria-hidden="true" />
              <p className="text-[14px] font-semibold text-muted-light tabular-nums" dir="ltr" style={{ textAlign: 'right' }}>
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="font-extrabold leading-[1.05]" style={{ fontSize: 'clamp(1.6rem, 1.3rem + 1.1vw, 2.3rem)' }}>
                {s.name}
              </h3>
              <p className="max-w-[30ch] text-ink/75">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
