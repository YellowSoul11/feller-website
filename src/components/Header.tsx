import { useEffect, useRef, useState } from 'react';
import { contact, nav } from '../content/site';
import { useOverlay, useDialogKeys } from '../lib/overlay';
import { scrollToId } from '../lib/motion';
import { Close, Instagram, Mail, Phone, WhatsApp } from './Icons';

type Surface = 'dark' | 'light' | 'lavender';

export function Header() {
  const { open, openMenu, openDrawer, close } = useOverlay();
  const [surface, setSurface] = useState<Surface>('dark');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      // read the section that is actually painted under the logo, skipping the header itself
      const logo = document.querySelector('header img');
      const r = logo?.getBoundingClientRect();
      const x = r ? r.left + r.width / 2 : window.innerWidth - 60;
      const y = r ? r.top + r.height / 2 : 36;
      const under = document.elementsFromPoint(x, y).find((el) => !el.closest('header'));
      const s = (under?.closest('[data-surface]') as HTMLElement | null)?.dataset.surface as Surface | undefined;
      if (s) setSurface(s);
      setScrolled(window.scrollY > 8);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, []);

  const light = surface !== 'dark';
  const menuOpen = open === 'menu';

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,color,box-shadow] duration-500 ease-[var(--ease-out)] ${light ? 'text-ink' : 'text-cream'} ${scrolled ? `backdrop-blur-md ${surface === 'dark' ? 'bg-ink/85 shadow-[0_1px_0_var(--line-strong)]' : surface === 'light' ? 'bg-cream/88 shadow-[0_1px_0_rgb(21_19_17/0.1)]' : 'bg-lavender/90'}` : 'bg-transparent'}`}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="wrap flex items-center justify-between" style={{ height: 'var(--header-h)' }}>
          <a href="#top" onClick={(e) => { e.preventDefault(); scrollToId('top'); }} className="-my-2 block py-2.5" aria-label="Feller Marketing, לראש העמוד">
            <img src={light ? 'assets/brand/feller-logo-on-light.svg' : 'assets/brand/feller-logo-on-dark.svg'} alt="" width={338} height={107} className="h-[26px] w-auto md:h-[32px]" />
          </a>
          <div className="flex items-center gap-3 md:gap-6">
            <button type="button" onClick={openDrawer} className={`btn hidden min-h-[44px] px-5 text-[15px] md:inline-flex ${light ? 'btn-ghost-ink' : ''}`}>
              בואו נדבר
            </button>
            <button
              type="button"
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                const m = document.getElementById('site-menu');
                m?.style.setProperty('--mo-x', `${r.left + r.width / 2}px`);
                m?.style.setProperty('--mo-y', `${r.top + r.height / 2}px`);
                openMenu();
              }}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              className="grid size-11 place-items-center rounded-full"
              aria-label="תפריט"
            >
              <svg viewBox="0 0 34 14" className="w-[30px]" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M1 1h32M9 13h24" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <Menu open={menuOpen} onClose={close} onTalk={() => { close(); requestAnimationFrame(openDrawer); }} />
    </>
  );
}

function Menu({ open, onClose, onTalk }: { open: boolean; onClose: () => void; onTalk: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useDialogKeys(ref, open, onClose);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.inert = !open;
    if (open) ref.current.querySelector<HTMLElement>('[data-autofocus]')?.focus();
  }, [open]);

  const go = (id: string) => {
    onClose();
    requestAnimationFrame(() => scrollToId(id));
  };
  const items = [...nav.map((n) => ({ key: n.id, label: n.label, act: () => go(n.id), href: `#${n.id}` })), { key: 'talk', label: 'צור קשר', act: onTalk, href: '#contact' }];

  return (
    <div
      id="site-menu"
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="תפריט ראשי"
      className={`menu fixed inset-0 z-50 bg-ink text-cream ${open ? 'is-open' : ''}`}
    >
      <div className="gridlines" aria-hidden="true">{Array.from({ length: 12 }, (_, k) => <i key={k} />)}</div>
      <div className="relative z-10 border-b border-[var(--line-strong)]">
        <div className="wrap flex items-center justify-between" style={{ height: 'var(--header-h)', paddingTop: 'env(safe-area-inset-top, 0px)' }}>
          <img src="assets/brand/feller-logo-on-dark.svg" alt="Feller Marketing" width={338} height={107} className="h-[26px] w-auto md:h-[32px]" />
          <div className="flex items-center gap-3 md:gap-6">
            <button type="button" onClick={onTalk} className="btn btn-solid hidden min-h-[44px] px-5 text-[15px] md:inline-flex">
              בואו נדבר
            </button>
            <button type="button" onClick={onClose} className="grid size-11 place-items-center rounded-full" aria-label="סגירת התפריט" data-autofocus>
              <Close />
            </button>
          </div>
        </div>
      </div>
      <nav aria-label="ניווט ראשי" className="relative z-10 grid place-items-center py-6">
        <ul className="menu-list grid justify-items-center gap-[clamp(2px,0.6vh,10px)] text-center">
          {items.map((n, i) => (
            <li key={n.key} className="menu-item" style={{ ['--i' as string]: i }}>
              <a
                href={n.href}
                onClick={(e) => { e.preventDefault(); n.act(); }}
                className="menu-link block font-extrabold leading-[1.02]"
                style={{ fontSize: 'clamp(2.9rem, 1.4rem + 6.4vw, 6.75rem)' }}
                aria-label={n.label}
              >
                <span className="menu-clip" aria-hidden="true">
                  {Array.from(n.label).map((c, k, arr) => (
                    <span key={k} className="ml" style={{ ['--r' as string]: Math.abs(k - (arr.length - 1) / 2) }}>
                      {c === ' ' ? ' ' : c}
                    </span>
                  ))}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="relative z-10 border-t border-[var(--line-strong)]">
        <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4 pb-[max(16px,env(safe-area-inset-bottom))] text-[15px] text-muted">
          <div className="flex items-center gap-1">
            <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="grid size-11 place-items-center rounded-full text-cream" aria-label="WhatsApp (נפתח בחלון חדש)"><WhatsApp className="size-5" /></a>
            <a href={`mailto:${contact.email}`} className="grid size-11 place-items-center rounded-full text-cream" aria-label={`מייל: ${contact.email}`}><Mail /></a>
            <a href={contact.phoneHref} className="grid size-11 place-items-center rounded-full text-cream" aria-label={`טלפון: ${contact.phoneDisplay}`}><Phone /></a>
            <a href={contact.instagram.href} target="_blank" rel="noopener noreferrer" className="grid size-11 place-items-center rounded-full text-cream" aria-label="Instagram (נפתח בחלון חדש)"><Instagram /></a>
          </div>
          <p dir="ltr">© 2026 Feller Marketing</p>
        </div>
      </div>
    </div>
  );
}
