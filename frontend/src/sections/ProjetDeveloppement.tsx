import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Brain, Target, Zap } from 'lucide-react';

import { getContentIcon } from '../lib/content-icons';
import {
  defaultPublicHomepageData,
  type PublicHomepageContent,
} from '../lib/public-content';
import { sanitizeAnchorOrLink } from '../lib/safe-link';

gsap.registerPlugin(ScrollTrigger);

type ProjetDeveloppementProps = {
  development?: PublicHomepageContent['development'];
};

const ProjetDeveloppement = ({
  development = defaultPublicHomepageData.homepage.development,
}: ProjetDeveloppementProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const imagePanelRef = useRef<HTMLDivElement>(null);
  const accentStripeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pillarsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const ctx = gsap.context(() => {
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=180%',
            pin: true,
            scrub: 1,
          },
        });

        scrollTl.fromTo(
          imagePanelRef.current,
          { x: '-60vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0
        );

        scrollTl.fromTo(
          accentStripeRef.current,
          { x: '-6vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0.05
        );

        scrollTl.fromTo(
          contentRef.current,
          { x: '18vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0.1
        );

        scrollTl.fromTo(
          pillarsRef.current?.children || [],
          { y: '6vh', opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.02, ease: 'none' },
          0.15
        );

        scrollTl.fromTo(
          imagePanelRef.current,
          { x: 0, opacity: 1 },
          { x: '-20vw', opacity: 0, ease: 'power2.in' },
          0.7
        );

        scrollTl.fromTo(
          accentStripeRef.current,
          { x: 0, opacity: 1 },
          { x: '-6vw', opacity: 0, ease: 'power2.in' },
          0.7
        );

        scrollTl.fromTo(
          contentRef.current,
          { y: 0, opacity: 1 },
          { y: '-8vh', opacity: 0, ease: 'power2.in' },
          0.7
        );
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  const developmentCtaTarget = sanitizeAnchorOrLink(development.cta.target, '#competences');

  return (
    <section ref={sectionRef} id="projet" className="section-pinned relative z-90 bg-[#0B0F17]">
      <div
        ref={imagePanelRef}
        className="relative h-[42vh] min-h-[250px] w-full lg:absolute lg:left-0 lg:top-0 lg:h-full lg:w-[56vw] lg:[clip-path:polygon(0_0,100%_0,85%_100%,0_100%)]"
      >
        <img src={development.imageUrl} alt={development.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0B0F17]/50" />
      </div>

      <div
        ref={accentStripeRef}
        className="absolute left-[54vw] top-0 hidden h-full w-[2.2vw] bg-accent lg:block lg:[clip-path:polygon(0_0,100%_0,50%_100%,0_100%)]"
      />

      <div className="relative z-10 bg-[#0B0F17] px-5 py-10 sm:px-8 lg:absolute lg:right-0 lg:top-0 lg:flex lg:h-full lg:w-[44vw] lg:items-center lg:px-0 lg:py-0">
        <div ref={contentRef} className="lg:px-[4vw]">
          <span className="mb-4 block font-mono text-xs font-bold uppercase tracking-widest text-accent">
            {development.eyebrow}
          </span>

          <h2 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {development.title}
          </h2>

          <p className="mb-8 max-w-md text-base leading-relaxed text-[#A9B3C2] lg:text-lg">
            {development.body}
          </p>

          <div ref={pillarsRef} className="mb-8 space-y-4">
            {development.pillars.map((pillar, index) => {
              const Icon = getContentIcon(
                pillar.iconKey,
                index === 0 ? Zap : index === 1 ? Target : Brain
              );

              return (
                <div
                  key={`${pillar.label}-${index}`}
                  className="flex items-center gap-4 rounded-xl bg-[#121A26] p-4"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <Icon className="text-accent" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{pillar.label}</h4>
                    <p className="text-sm text-[#A9B3C2]">{pillar.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <a
            href={developmentCtaTarget}
            className="inline-flex items-center gap-2 font-semibold text-accent transition-all duration-300 hover:gap-4"
          >
            {development.cta.label}
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProjetDeveloppement;
