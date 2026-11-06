import { useEffect, useRef, useState, type FormEvent } from 'react';
import { contact, drawer as t } from '../content/site';
import { useDialogKeys, useOverlay } from '../lib/overlay';
import { Arrow, Close, Mail, WhatsApp } from './Icons';

type Field = 'name' | 'phone' | 'email' | 'message' | 'consent';
type Status = 'idle' | 'sending' | 'sent' | 'not-connected' | 'failed';

const KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

function validate(fd: FormData) {
  const e: Partial<Record<Field, string>> = {};
  if (!String(fd.get('name') ?? '').trim()) e.name = t.errors.name;
  const digits = String(fd.get('phone') ?? '').replace(/\D/g, '');
  if (digits.length < 9 || digits.length > 13) e.phone = t.errors.phone;
  const email = String(fd.get('email') ?? '').trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) e.email = t.errors.email;
  if (!fd.get('consent')) e.consent = t.errors.consent;
  return e;
}

export function ContactDrawer() {
  const { open, close } = useOverlay();
  const isOpen = open === 'drawer';
  const panel = useRef<HTMLDivElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>('idle');

  useDialogKeys(panel, isOpen, close);

  useEffect(() => {
    if (!panel.current) return;
    panel.current.inert = !isOpen;
    if (isOpen) {
      setStatus((s) => (s === 'sent' ? 'idle' : s));
      // focus the first field once the panel is in place
      const id = window.setTimeout(() => panel.current?.querySelector<HTMLElement>('#f-name')?.focus(), 60);
      return () => window.clearTimeout(id);
    }
  }, [isOpen]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get('botcheck')) return; // honeypot
    const errs = validate(fd);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    if (!KEY) {
      setStatus('not-connected');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: KEY,
          subject: `פנייה חדשה מהאתר: ${fd.get('name')}`,
          from_name: 'fellermarketing.com',
          name: fd.get('name'),
          phone: fd.get('phone'),
          email: fd.get('email') || undefined,
          message: fd.get('message'),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean };
      if (res.ok && data.success === true) {
        setStatus('sent');
        form.current?.reset();
      } else setStatus('failed');
    } catch {
      setStatus('failed');
    }
  }

  const err = (f: Field) =>
    errors[f] ? (
      <p id={`e-${f}`} className="text-[14px] font-semibold text-[#FFB4A8]">
        {errors[f]}
      </p>
    ) : null;
  const aria = (f: Field) => ({ 'aria-invalid': errors[f] ? true : undefined, 'aria-describedby': errors[f] ? `e-${f}` : undefined });
  const input =
    'w-full rounded-2xl border border-[var(--line-strong)] bg-ink px-4 py-3.5 text-[17px] text-cream placeholder:text-muted/70 transition-colors duration-300 focus:border-lavender focus:outline-none aria-[invalid=true]:border-[#FFB4A8]';

  return (
    <div className={`drawer fixed inset-0 z-[60] ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}>
      <div className="drawer-veil absolute inset-0 bg-ink/60 backdrop-blur-[6px]" onClick={close} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="drawer-panel absolute inset-y-0 left-0 flex w-full flex-col overflow-y-auto bg-ink-2 text-cream md:inset-y-3 md:left-3 md:w-[min(560px,calc(100vw-24px))] md:rounded-[28px] md:border md:border-[var(--line-strong)]"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6 md:px-10 md:pt-10">
          <h2 id="drawer-title" className="font-extrabold leading-[0.95]" style={{ fontSize: 'clamp(2.4rem, 2rem + 2vw, 3.5rem)' }}>
            {t.title}
            <span className="dot">.</span>
          </h2>
          <button type="button" onClick={close} className="grid size-11 shrink-0 place-items-center rounded-full border border-[var(--line-strong)]" aria-label={t.close}>
            <Close className="size-5" />
          </button>
        </div>

        {status === 'sent' ? (
          <div className="grid flex-1 content-center gap-6 px-6 py-10 md:px-10" role="status">
            <p className="text-2xl font-semibold">{t.ok}</p>
            <div>
              <button type="button" onClick={close} className="btn">{t.okClose}</button>
            </div>
          </div>
        ) : (
          <form ref={form} noValidate onSubmit={onSubmit} className="grid gap-5 px-6 py-8 md:px-10">
            <p className="text-cream/80">{t.intro}</p>
            <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <div className="grid gap-5 md:grid-cols-2">
              <div className="grid gap-2">
                <label htmlFor="f-name" className="font-semibold">{t.name} <span aria-hidden="true" className="text-lavender">*</span></label>
                <input id="f-name" name="name" autoComplete="name" required className={input} {...aria('name')} />
                {err('name')}
              </div>
              <div className="grid gap-2">
                <label htmlFor="f-phone" className="font-semibold">{t.phone} <span aria-hidden="true" className="text-lavender">*</span></label>
                <input id="f-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" required className={`${input} text-right`} {...aria('phone')} />
                {err('phone')}
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="f-email" className="font-semibold">{t.email}</label>
              <input id="f-email" name="email" type="email" inputMode="email" autoComplete="email" dir="ltr" className={`${input} text-right`} {...aria('email')} />
              {err('email')}
            </div>
            <div className="grid gap-2">
              <label htmlFor="f-message" className="font-semibold">{t.message}</label>
              <textarea id="f-message" name="message" rows={4} className={`${input} resize-y`} />
            </div>
            <div className="grid gap-2">
              <label className="flex cursor-pointer items-start gap-3">
                <input type="checkbox" name="consent" className="mt-1 size-5 shrink-0 accent-[#AA98FF]" {...aria('consent')} />
                <span>
                  {t.consent} <a href="privacy.html" target="_blank" className="underline underline-offset-4">מדיניות פרטיות</a>
                  <span className="block text-[14px] text-muted">{t.consentNote}</span>
                </span>
              </label>
              {err('consent')}
            </div>

            {(status === 'not-connected' || status === 'failed') && (
              <p role="alert" className="rounded-2xl border border-[#FFB4A8]/40 bg-[#FFB4A8]/10 p-4 text-[15px] leading-relaxed">
                {status === 'failed' ? t.failed : t.notConnected}
              </p>
            )}

            <div>
              <button type="submit" disabled={status === 'sending'} className="btn btn-solid w-full md:w-auto disabled:cursor-wait disabled:opacity-70">
                {status === 'sending' ? t.sending : t.submit}
                <Arrow />
              </button>
            </div>
          </form>
        )}

        <div className="mt-auto grid gap-3 border-t border-[var(--line-strong)] px-6 py-6 md:px-10">
          <p className="text-[14px] text-muted">{t.orDirect}</p>
          <div className="flex flex-wrap gap-3">
            <a href={contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn min-h-[46px] px-5 text-[15px]">
              <WhatsApp className="size-5" /> WhatsApp<span className="sr-only"> (נפתח בחלון חדש)</span>
            </a>
            <a href={`mailto:${contact.email}`} className="btn min-h-[46px] px-5 text-[15px]">
              <Mail /> <span dir="ltr">{contact.email}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
