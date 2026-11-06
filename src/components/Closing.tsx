import { useEffect, useRef, useState } from 'react';
import { contact, cta, footer, nav } from '../content/site';
import { useOverlay } from '../lib/overlay';
import { ScrollTrigger, scrollToId, useReducedMotion } from '../lib/motion';
import { Arrow, Instagram, Mail, Phone, WhatsApp } from './Icons';

export function Cta() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { openDrawer } = useOverlay();

  useEffect(() => {
    const el = root.current;
    if (!el || reduced) return;
    const line = el.querySelector<HTMLElement>('.cta-line');
    const triggers = [
      // the full stop grows into the lavender screen
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'top top',
        onUpdate: (s) => {
          el.style.setProperty('--grow', s.progress.toFixed(4));
          // the header reads this: cream until the lavender circle has covered the top of the screen
          el.dataset.surface = s.progress > 0.92 ? 'lavender' : 'light';
        },
      }),
      // the line travels in reading direction while the stage is pinned
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (s) => {
          if (!line) return;
          const travel = line.scrollWidth - window.innerWidth * 0.6;
          line.style.transform = `translate3d(${(s.progress * travel).toFixed(1)}px,0,0)`;
        },
      }),
    ];
    return () => triggers.forEach((t) => t.kill());
  }, [reduced]);

  return (
    <section ref={root} id="contact" data-surface="lavender" className={`cta relative isolate text-ink ${reduced ? 'is-static' : ''}`} aria-labelledby="cta-title">
      <div className="cta-stage">
        <div className="cta-fill" aria-hidden="true" />
        <div className="relative z-10 grid h-full grid-cols-[minmax(0,1fr)] grid-rows-[1fr_auto_1fr] items-center overflow-hidden">
          <p className="wrap self-end pb-6 text-center font-semibold" style={{ fontSize: 'var(--fs-lead)' }}>
            {cta.lead}
          </p>
          <h2 id="cta-title" className="cta-line-wrap">
            <span className="sr-only">{cta.line}. {cta.line2}.</span>
            <span className="cta-line" aria-hidden="true">
              <span>{cta.line}</span>
              <i className="cta-dot" />
              <span>{cta.line2}</span>
              <i className="cta-dot" />
            </span>
          </h2>
          <div className="wrap flex flex-wrap items-start justify-center gap-3 self-start pt-8">
            <button type="button" onClick={openDrawer} className="btn btn-ink">
              {cta.primary}
              <Arrow />
            </button>
            <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-ink">
              <WhatsApp className="size-5" />
              {cta.whatsapp}
              <span className="sr-only"> (נפתח בחלון חדש)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const year = 2026;
  return (
    <footer data-surface="dark" className="relative bg-ink pt-[clamp(72px,10vh,120px)] pb-[max(28px,env(safe-area-inset-bottom))] text-cream">
      <div className="wrap grid gap-14">
        <div className="grid gap-10 md:grid-cols-3">
          <nav aria-label="ניווט בתחתית העמוד">
            <ul className="grid text-lg">
              {nav.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} onClick={(e) => { e.preventDefault(); scrollToId(n.id); }} className="inline-flex min-h-11 items-center"><span className="ulink">
                    {n.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="grid content-start text-lg">
            <li>
              <a href={`mailto:${contact.email}`} className="ulink inline-flex min-h-11 items-center gap-3" dir="ltr">
                <Mail /> {contact.email}
              </a>
            </li>
            <li>
              <a href={contact.phoneHref} className="ulink inline-flex min-h-11 items-center gap-3" dir="ltr">
                <Phone /> {contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="ulink inline-flex min-h-11 items-center gap-3">
                <WhatsApp className="size-5" /> WhatsApp<span className="sr-only"> (נפתח בחלון חדש)</span>
              </a>
            </li>
            <li>
              <a href={contact.instagram.href} target="_blank" rel="noopener noreferrer" className="ulink inline-flex min-h-11 items-center gap-3">
                <Instagram /> <span dir="ltr">@liem_feller</span><span className="sr-only"> (נפתח בחלון חדש)</span>
              </a>
            </li>
            {contact.linkedin && (
              <li>
                <a href={contact.linkedin.href} target="_blank" rel="noopener noreferrer" className="ulink">{contact.linkedin.label}</a>
              </li>
            )}
          </ul>
          <ul className="grid content-start text-[15px] text-muted md:justify-self-end">
            <li><a href="privacy.html" className="inline-flex min-h-11 items-center">{footer.privacy}</a></li>
            <li><a href="accessibility.html" className="inline-flex min-h-11 items-center">{footer.accessibility}</a></li>
          </ul>
        </div>
        <img src="assets/brand/feller-logo-on-dark.svg" alt="Feller" width={338} height={107} className="block h-auto w-full" loading="lazy" />
        <p className="text-[14px] text-muted">
          © <span dir="ltr">{year}</span> {footer.rights}
        </p>
      </div>
    </footer>
  );
}

export function WhatsAppFab() {
  const { open } = useOverlay();
  // appears once the hero has scrolled away, so it never covers the first screen
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const on = () => {
      const f = document.querySelector('footer');
      const overFooter = !!f && f.getBoundingClientRect().top < window.innerHeight - 80;
      setShown(window.scrollY > window.innerHeight * 0.85 && !overFooter);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  const hidden = open !== 'none' || !shown;
  return (
    <a
      href={contact.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="שיחה בוואטסאפ (נפתח בחלון חדש)"
      className={`fab fixed z-30 grid size-14 place-items-center rounded-full bg-[#1FA855] text-white shadow-[0_12px_30px_-8px_rgb(0_0_0/0.55)] transition-[transform,opacity] duration-300 ease-[var(--ease-out)] ${hidden ? 'pointer-events-none scale-75 opacity-0' : ''}`}
      tabIndex={hidden ? -1 : undefined}
      aria-hidden={hidden || undefined}
      style={{ insetInlineEnd: 'max(18px, env(safe-area-inset-left, 0px))', bottom: 'max(18px, env(safe-area-inset-bottom, 0px))' }}
    >
      <WhatsApp className="size-7" />
    </a>
  );
}
