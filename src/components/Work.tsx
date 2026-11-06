import { useEffect, useRef, useState } from 'react';
import { work, type Project } from '../content/site';
import { ScrollTrigger, useReducedMotion } from '../lib/motion';
import { ArrowOut } from './Icons';
import { GridLines, Letters, ShotFrame } from './Shared';

const DOTS = [
  { col: 1, d: 12, delay: 2 },
  { col: 5, d: 15, delay: 6 },
  { col: 9, d: 10, delay: 0.5 },
];

function Panel({ p, i, total, active, onFocus }: { p: Project; i: number; total: number; active: boolean; onFocus?: () => void }) {
  return (
    <article
      className={`chapter ${active ? 'is-active' : ''}`}
      aria-labelledby={`p-${p.id}`}
      onFocusCapture={onFocus}
      data-i={i}
    >
      <div className="chapter-shots" aria-hidden={!active}>
        <div className="shot shot-a" data-amp="70">
          <ShotFrame shot={p.shots[0]} sizesAttr="(min-width:1024px) 34vw, 78vw" />
        </div>
        <div className="shot shot-b" data-amp="120">
          <ShotFrame shot={p.shots[1]} sizesAttr="26vw" />
        </div>
        <div className="shot shot-c" data-amp="160">
          <ShotFrame shot={p.shots[2]} sizesAttr="(min-width:1024px) 15vw, 34vw" />
        </div>
      </div>
      <div className="chapter-text">
        <p className="chapter-num tabular-nums" dir="ltr">
          {String(i + 1).padStart(2, '0')} <span className="text-muted">/ {String(total).padStart(2, '0')}</span>
        </p>
        <h3 id={`p-${p.id}`} className="chapter-name" dir="ltr" aria-label={p.name}>
          <Letters text={p.name} />
        </h3>
        <p className="chapter-up chapter-status" style={{ ['--u' as string]: 0 }}>{p.status}</p>
        <p className="chapter-up chapter-desc" style={{ ['--u' as string]: 1 }}>{p.desc}</p>
        <div className="chapter-up" style={{ ['--u' as string]: 2 }}>
          <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn mt-1">
            {p.cta}
            <ArrowOut />
            <span className="sr-only">: {p.urlLabel} (נפתח בחלון חדש)</span>
          </a>
        </div>
      </div>
    </article>
  );
}

export function Work() {
  const reduced = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const projects = work.projects;

  useEffect(() => {
    if (reduced || !track.current) return;
    const el = track.current;
    const shots = Array.from(el.querySelectorAll<HTMLElement>('.chapter'));
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const n = projects.length;
        const pos = self.progress * n;
        const idx = Math.min(n - 1, Math.floor(pos));
        setActive(idx);
        // local progress of each chapter drives its screenshot parallax
        shots.forEach((ch, k) => {
          const local = Math.max(-0.5, Math.min(1.5, pos - k));
          ch.style.setProperty('--p', local.toFixed(4));
        });
      },
    });
    return () => st.kill();
  }, [reduced, projects.length]);

  const focusChapter = (i: number) => {
    if (reduced || !track.current || i === active) return;
    const el = track.current;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const run = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (run * (i + 0.35)) / projects.length });
  };

  return (
    <section id="work" data-surface="dark" className="relative isolate bg-ink" aria-labelledby="work-title">
      <GridLines dots={reduced ? [] : DOTS} />
      <div className="wrap relative z-10 pt-[clamp(96px,14vh,160px)] pb-[clamp(24px,4vh,48px)] text-center">
        <h2 id="work-title" className="mx-auto max-w-[22ch] font-light leading-[1.25] text-cream/85" style={{ fontSize: 'var(--fs-lead)' }}>
          {work.title}
        </h2>
      </div>
      {reduced ? (
        <div className="wrap relative z-10 grid gap-24 pb-32">
          {projects.map((p, i) => (
            <div key={p.id} className="chapters-static">
              <Panel p={p} i={i} total={projects.length} active />
            </div>
          ))}
        </div>
      ) : (
        <div ref={track} className="chapters relative z-10" style={{ ['--n' as string]: projects.length }}>
          <div className="chapters-stage">
            {projects.map((p, i) => (
              <Panel key={p.id} p={p} i={i} total={projects.length} active={i === active} onFocus={() => focusChapter(i)} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
