import { useEffect } from 'react';
import { OverlayProvider } from './lib/overlay';
import { ScrollTrigger, startSmoothScroll } from './lib/motion';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Work } from './components/Work';
import { About, Process, Services, Statement } from './components/Middle';
import { Cta, Footer, WhatsAppFab } from './components/Closing';
import { ContactDrawer } from './components/ContactDrawer';

export default function App() {
  useEffect(() => {
    startSmoothScroll();
    // layout settles after fonts load; recompute pinned/scrubbed ranges
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 800);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <OverlayProvider>
      <a href="#main" className="skip-link">דילוג לתוכן</a>
      <Header />
      <main id="main">
        <Hero />
        <Work />
        <Statement />
        <Services />
        <About />
        <Process />
        <Cta />
      </main>
      <Footer />
      <WhatsAppFab />
      <ContactDrawer />
    </OverlayProvider>
  );
}
