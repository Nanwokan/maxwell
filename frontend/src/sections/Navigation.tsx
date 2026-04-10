import { useCallback, useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
  defaultPublicHomepageData,
  type PublicSiteSettings,
} from '../lib/public-content';

type NavigationProps = {
  settings?: PublicSiteSettings;
};

const Navigation = ({ settings = defaultPublicHomepageData.settings }: NavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const brandLabel = settings.clubName.replace(/^Association Sportive\s+/i, '').toUpperCase();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Le Centre', href: '#le-centre' },
    { label: 'Catégories', href: '#categories' },
    { label: 'Actualités', href: '#actualites' },
    { label: 'Galerie', href: '#galerie' },
    { label: 'Contact', href: '#contact' },
  ];

  const getScrollTargetFromTrigger = useCallback((
    element: HTMLElement,
    href: string,
    offset: number
  ) => {
    const pinnedProgressBySection: Record<string, number> = {
      // The value is where we land INSIDE the pinned scroll range (0..1).
      // Higher values jump deeper into the animation, making content fully visible.
      '#le-centre': 0.55,
      '#categories': 0.5,
      '#actualites': 0.58,
      '#inscription': 0.6,
      '#competences': 0.3,
      '#projet': 0.3,
      '#journee': 0.3,
    };

    const matchingTriggers = ScrollTrigger.getAll().filter((trigger) => {
      const triggerTarget = trigger.vars.trigger;

      if (!triggerTarget) {
        return false;
      }

      if (typeof triggerTarget === 'string') {
        return document.querySelector(triggerTarget) === element;
      }

      return triggerTarget === element;
    });

    if (matchingTriggers.length === 0) {
      return null;
    }

    const pinnedTrigger = matchingTriggers.find((trigger) => Boolean(trigger.vars.pin));
    const chosenTrigger = pinnedTrigger ?? matchingTriggers[0];

    if (!Number.isFinite(chosenTrigger.start)) {
      return null;
    }

    const hasFiniteEnd = Number.isFinite(chosenTrigger.end);
    const hasPin = Boolean(chosenTrigger.vars.pin);

    if (hasPin && hasFiniteEnd) {
      const sectionProgress = pinnedProgressBySection[href] ?? 0.3;
      const segmentLength = Math.max(0, chosenTrigger.end - chosenTrigger.start);
      return Math.max(0, chosenTrigger.start + segmentLength * sectionProgress - offset);
    }

    return Math.max(0, chosenTrigger.start - offset);
  }, []);

  const scrollToSection = useCallback((href: string) => {
    const element = document.querySelector<HTMLElement>(href);
    if (element) {
      const navHeight = navRef.current?.getBoundingClientRect().height ?? 0;
      const offset = navHeight + (window.innerWidth >= 1024 ? 12 : 8);
      let targetTop = window.scrollY + element.getBoundingClientRect().top - offset;

      if (ScrollTrigger.getAll().length > 0) {
        ScrollTrigger.refresh();
        targetTop = getScrollTargetFromTrigger(element, href, offset) ?? targetTop;
      }

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: 'smooth',
      });
    }
    setIsMobileMenuOpen(false);
  }, [getScrollTargetFromTrigger]);

  useEffect(() => {
    const handleProgrammaticScroll = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      if (typeof customEvent.detail !== 'string' || customEvent.detail.length === 0) {
        return;
      }

      scrollToSection(customEvent.detail);
    };

    window.addEventListener('maxwell-scroll-to-section', handleProgrammaticScroll as EventListener);
    return () => {
      window.removeEventListener(
        'maxwell-scroll-to-section',
        handleProgrammaticScroll as EventListener
      );
    };
  }, [scrollToSection]);

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[500] transition-all duration-500 ${
          isScrolled
            ? 'bg-[#0B0F17]/90 backdrop-blur-md py-2.5 lg:py-3'
            : 'bg-transparent py-4 lg:py-6'
        }`}
      >
        <div className="flex w-full items-center justify-between px-5 sm:px-8 lg:px-12">
          {/* Logo */}
          <a
            href="#accueil"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent sm:h-10 sm:w-10">
              <span className="text-base font-bold text-[#0B0F17] sm:text-lg">{settings.clubShortName}</span>
            </div>
            <span className="font-bold text-lg hidden sm:block">{brandLabel}</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className="text-sm text-[#A9B3C2] hover:text-white transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <a
              href="#inscription"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#inscription');
              }}
              className="btn-outline text-sm"
            >
              Inscription
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-[490] bg-[#0B0F17]/98 backdrop-blur-lg transition-all duration-500 lg:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(link.href);
              }}
              className="text-2xl font-bold text-white hover:text-accent transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#inscription"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#inscription');
            }}
            className="btn-primary mt-4"
          >
            Inscription
          </a>
        </div>
      </div>
    </>
  );
};

export default Navigation;
