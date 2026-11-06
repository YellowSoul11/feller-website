import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { resumeScroll, stopScroll } from './motion';

type Overlay = 'none' | 'menu' | 'drawer';
type Ctx = {
  open: Overlay;
  openDrawer: () => void;
  openMenu: () => void;
  close: () => void;
};

const OverlayCtx = createContext<Ctx | null>(null);

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<Overlay>('none');
  const returnTo = useRef<HTMLElement | null>(null);

  const show = useCallback((which: Overlay) => {
    if (document.activeElement instanceof HTMLElement) returnTo.current = document.activeElement;
    setOpen(which);
  }, []);

  const close = useCallback(() => {
    setOpen('none');
    // restore focus to whatever opened the overlay
    const el = returnTo.current;
    requestAnimationFrame(() => el?.isConnected && el.focus({ preventScroll: true }));
  }, []);

  useEffect(() => {
    if (open === 'none') resumeScroll();
    else stopScroll();
  }, [open]);

  return (
    <OverlayCtx.Provider value={{ open, openDrawer: () => show('drawer'), openMenu: () => show('menu'), close }}>
      {children}
    </OverlayCtx.Provider>
  );
}

export function useOverlay() {
  const c = useContext(OverlayCtx);
  if (!c) throw new Error('useOverlay outside provider');
  return c;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Escape to close + Tab focus trap inside `ref` while `active`. */
export function useDialogKeys(ref: RefObject<HTMLElement | null>, active: boolean, onClose: () => void) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !ref.current) return;
      const items = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [ref, active, onClose]);
}
