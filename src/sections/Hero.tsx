import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronDown } from 'lucide-react';

import {
  defaultPublicHomepageData,
  type PublicHomepageContent,
} from '@/lib/public-content';
import { sanitizeAnchorOrLink } from '@/lib/safe-link';

gsap.registerPlugin(ScrollTrigger);

type HeroProps = {
  hero?: PublicHomepageContent['hero'];
};

const Hero = ({ hero = defaultPublicHomepageData.homepage.hero }: HeroProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const stripeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const accentPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.fromTo(
        stripeRef.current,
        { x: '-60vw', opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6 },
        0
      );

      tl.fromTo(
        eyebrowRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        0.2
      );

      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.word');
        tl.fromTo(
          words,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
          0.3
        );
      }

      tl.fromTo(
        subheadlineRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        0.6
      );

      tl.fromTo(
        ctaRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        0.8
      );

      tl.fromTo(
        accentPanelRef.current,
        { x: '12vw', opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5 },
        0.4
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=180%',
          pin: true,
          scrub: 1,
          onLeaveBack: () => {
            gsap.set([stripeRef.current, contentRef.current, accentPanelRef.current], {
              opacity: 1,
              x: 0,
            });
          },
        },
      });

      scrollTl.fromTo(
        contentRef.current,
        { x: 0, opacity: 1 },
        { x: '-18vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        stripeRef.current,
        { x: 0, opacity: 1 },
        { x: '-40vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        accentPanelRef.current,
        { x: 0, opacity: 1 },
        { x: '12vw', opacity: 0, ease: 'power2.in' },
        0.7
      );

      const backgroundImage = sectionRef.current?.querySelector('.hero-bg');
      if (backgroundImage) {
        scrollTl.fromTo(backgroundImage, { scale: 1 }, { scale: 1.06, ease: 'none' }, 0.7);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToNext = () => {
    const nextSection = document.querySelector('#le-centre');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCtaClick = (event: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    if (!target.startsWith('#')) {
      return;
    }

    event.preventDefault();
    window.dispatchEvent(new CustomEvent<string>('maxwell-scroll-to-section', { detail: target }));
  };

  const primaryTarget = sanitizeAnchorOrLink(hero.ctaPrimary.target, '#inscription');
  const secondaryTarget = sanitizeAnchorOrLink(hero.ctaSecondary.target, '#le-centre');

  return (
    <section ref={sectionRef} id="accueil" className="section-pinned relative z-10">
      <div className="hero-bg absolute inset-0">
        <img src={hero.backgroundImageUrl} alt={hero.titleMain} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F17]/80 via-[#0B0F17]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent" />
      </div>

      <div
        ref={stripeRef}
        className="absolute top-0 left-0 h-full w-[65vw] bg-[#121A26]/75"
        style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' }}
      />

      <div ref={contentRef} className="absolute top-0 left-0 flex h-full w-full items-center">
        <div className="max-w-3xl px-8 lg:px-[8vw]">
          <span
            ref={eyebrowRef}
            className="mb-4 block font-mono text-xs font-bold uppercase tracking-widest text-accent"
          >
            {hero.eyebrow}
          </span>

          <h1
            ref={headlineRef}
            className="mb-6 text-5xl font-extrabold leading-[0.92] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl"
          >
            <span className="word inline-block">{hero.titleMain}</span>{' '}
            <span className="word inline-block text-accent">{hero.titleAccent}</span>
          </h1>

          <p
            ref={subheadlineRef}
            className="mb-8 max-w-xl text-lg leading-relaxed text-[#A9B3C2] lg:text-xl"
          >
            {hero.subtitle}
          </p>

          <div ref={ctaRef} className="flex flex-wrap gap-4">
            <a
              href={primaryTarget}
              onClick={(event) => handleCtaClick(event, primaryTarget)}
              className="btn-primary flex items-center gap-2"
            >
              {hero.ctaPrimary.label}
              <ArrowRight size={18} />
            </a>
            <a
              href={secondaryTarget}
              onClick={(event) => handleCtaClick(event, secondaryTarget)}
              className="btn-outline"
            >
              {hero.ctaSecondary.label}
            </a>
          </div>
        </div>
      </div>

      <div
        ref={accentPanelRef}
        className="absolute top-0 right-0 h-full w-[10vw] bg-accent/15"
        style={{ clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0 100%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span
            className="whitespace-nowrap font-mono text-xs font-bold tracking-widest text-accent"
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)',
            }}
          >
            {hero.seasonLabel}
          </span>
        </div>
      </div>

      <button
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/60 transition-colors hover:text-accent"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  );
};

export default Hero;
