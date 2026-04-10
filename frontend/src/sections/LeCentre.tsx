import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, MapPin, Trophy, Users } from 'lucide-react';

import { getContentIcon } from '../lib/content-icons';
import {
  defaultPublicHomepageData,
  type PublicHomepageContent,
} from '../lib/public-content';
import { sanitizeAnchorOrLink } from '../lib/safe-link';

gsap.registerPlugin(ScrollTrigger);

type LeCentreProps = {
  center?: PublicHomepageContent['center'];
};

const LeCentre = ({ center = defaultPublicHomepageData.homepage.center }: LeCentreProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const imagePanelRef = useRef<HTMLDivElement>(null);
  const accentStripeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

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
          statsRef.current?.children || [],
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 1, stagger: 0.02, ease: 'none' },
          0.18
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
          { y: '-10vh', opacity: 0, ease: 'power2.in' },
          0.7
        );

        scrollTl.fromTo(
          statsRef.current?.children || [],
          { y: 0, opacity: 1 },
          { y: '6vh', opacity: 0, stagger: 0.01, ease: 'power2.in' },
          0.7
        );
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  const centerCtaTarget = sanitizeAnchorOrLink(center.cta.target, '#galerie');

  return (
    <section ref={sectionRef} id="le-centre" className="section-pinned relative z-20 bg-[#0B0F17]">
      <div
        ref={imagePanelRef}
        className="relative h-[42vh] min-h-[250px] w-full lg:absolute lg:left-0 lg:top-0 lg:h-full lg:w-[56vw] lg:[clip-path:polygon(0_0,100%_0,85%_100%,0_100%)]"
      >
        <img src={center.imageUrl} alt={center.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0B0F17]/50" />
      </div>

      <div
        ref={accentStripeRef}
        className="absolute left-[54vw] top-0 hidden h-full w-[2.2vw] bg-accent lg:block lg:[clip-path:polygon(0_0,100%_0,50%_100%,0_100%)]"
      />

      <div className="relative z-10 bg-[#0B0F17] px-5 py-10 sm:px-8 lg:absolute lg:right-0 lg:top-0 lg:flex lg:h-full lg:w-[44vw] lg:items-center lg:px-0 lg:py-0">
        <div ref={contentRef} className="lg:px-[4vw]">
          <span className="mb-4 block font-mono text-xs font-bold uppercase tracking-widest text-accent">
            {center.eyebrow}
          </span>

          <h2 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {center.title}
          </h2>

          <p className="mb-8 max-w-md text-base leading-relaxed text-[#A9B3C2] lg:text-lg">
            {center.body}
          </p>

          <a
            href={centerCtaTarget}
            className="mb-12 inline-flex items-center gap-2 font-semibold text-accent transition-all duration-300 hover:gap-4"
          >
            {center.cta.label}
            <ArrowRight size={18} />
          </a>

          <div ref={statsRef} className="grid max-w-md grid-cols-2 gap-4 sm:max-w-none sm:flex sm:gap-8">
            {center.stats.map((stat, index) => {
              const Icon = getContentIcon(
                stat.iconKey,
                index === 0 ? MapPin : index === 1 ? Users : Trophy
              );

              return (
                <div key={`${stat.label}-${index}`} className="text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <Icon className="text-accent" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-white lg:text-3xl">{stat.value}</div>
                  <div className="text-sm text-[#A9B3C2]">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeCentre;
