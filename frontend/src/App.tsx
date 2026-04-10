import { startTransition, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Toaster } from 'sonner';
import { getJson } from './lib/api';
import {
  defaultPublicHomepageData,
  normalizePublicHomepageData,
  type PublicHomepageData,
  type PublicHomepageResponse,
} from './lib/public-content';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import LeCentre from './sections/LeCentre';
import Categories from './sections/Categories';
import Inscription from './sections/Inscription';
import Actualites from './sections/Actualites';
import Equipe from './sections/Equipe';
import Galerie from './sections/Galerie';
import Partenaires from './sections/Partenaires';
import ProjetDeveloppement from './sections/ProjetDeveloppement';
import Competences from './sections/Competences';
import JourneeEntrainement from './sections/JourneeEntrainement';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [publicContent, setPublicContent] = useState<PublicHomepageData>(defaultPublicHomepageData);

  useEffect(() => {
    ScrollTrigger.defaults({
      anticipatePin: 1,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
    });

    ScrollTrigger.config({
      ignoreMobileResize: true,
    });

    const normalizer = ScrollTrigger.normalizeScroll(true);
    const refresh = () => ScrollTrigger.refresh();
    const raf = window.requestAnimationFrame(refresh);
    const timer = window.setTimeout(refresh, 300);
    window.addEventListener('load', refresh);

    return () => {
      normalizer?.kill();
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      window.removeEventListener('load', refresh);
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadPublicContent() {
      try {
        const response = await getJson<PublicHomepageResponse>('/api/public/homepage');
        if (!isActive) {
          return;
        }

        startTransition(() => {
          setPublicContent(normalizePublicHomepageData(response.item));
        });
      } catch (error) {
        console.error('[public-content] failed to load homepage data', error);
      }
    }

    void loadPublicContent();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      window.cancelAnimationFrame(raf);
    };
  }, [publicContent]);

  return (
    <div ref={mainRef} className="relative bg-[#0B0F17] min-h-screen">
      {/* Grain overlay */}
      <div className="grain-overlay" />
      
      {/* Navigation */}
      <Navigation settings={publicContent.settings} />
      
      {/* Main content */}
      <main className="relative">
        <Hero hero={publicContent.homepage.hero} />
        <LeCentre center={publicContent.homepage.center} />
        <Categories categories={publicContent.categories} />
        <Inscription
          seasonLabel={publicContent.settings.seasonLabel || publicContent.homepage.hero.seasonLabel}
          categories={publicContent.categories}
        />
        <Actualites article={publicContent.latestNews[0] ?? null} />
        <Equipe staff={publicContent.staff} />
        <Galerie
          initialItems={publicContent.gallery}
          facebookUrl={publicContent.settings.facebookUrl}
        />
        <Partenaires partners={publicContent.partners} />
        <ProjetDeveloppement development={publicContent.homepage.development} />
        <Competences playerProfile={publicContent.homepage.playerProfile} />
        <JourneeEntrainement trainingDay={publicContent.homepage.trainingDay} />
        <Contact settings={publicContent.settings} />
      </main>
      
      {/* Footer */}
      <Footer settings={publicContent.settings} />
      
      {/* WhatsApp Button */}
      <WhatsAppButton
        phoneNumber={publicContent.settings.whatsappPhone}
        clubName={publicContent.settings.clubName}
      />
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default App;
