import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Activity, ArrowRight, Target, Zap } from 'lucide-react';

import { getContentIcon } from '@/lib/content-icons';
import {
  defaultPublicHomepageData,
  type PublicHomepageContent,
} from '@/lib/public-content';
import { sanitizeAnchorOrLink } from '@/lib/safe-link';

gsap.registerPlugin(ScrollTrigger);

type CompetencesProps = {
  playerProfile?: PublicHomepageContent['playerProfile'];
};

function getProgressWidth(value: string): number {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return 0;
  }

  return Math.max(0, Math.min(parsed, 100));
}

const Competences = ({
  playerProfile = defaultPublicHomepageData.homepage.playerProfile,
}: CompetencesProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const imagePanelRef = useRef<HTMLDivElement>(null);
  const accentStripeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
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
  }, []);

  const playerProfileCtaTarget = sanitizeAnchorOrLink(playerProfile.cta.target, '#contact');

  return (
    <section ref={sectionRef} id="competences" className="section-pinned relative z-[100] bg-[#0B0F17]">
      <div
        ref={imagePanelRef}
        className="absolute top-0 left-0 h-full w-[56vw]"
        style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' }}
      >
        <img src={playerProfile.imageUrl} alt={playerProfile.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0B0F17]/50" />
      </div>

      <div
        ref={accentStripeRef}
        className="absolute top-0 left-[54vw] h-full w-[2.2vw] bg-accent"
        style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%, 0 100%)' }}
      />

      <div className="absolute top-0 right-0 flex h-full w-[44vw] items-center bg-[#0B0F17]">
        <div ref={contentRef} className="px-8 lg:px-[4vw]">
          <span className="mb-4 block font-mono text-xs font-bold uppercase tracking-widest text-accent">
            {playerProfile.eyebrow}
          </span>

          <h2 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {playerProfile.title}
          </h2>

          <p className="mb-8 max-w-md text-base leading-relaxed text-[#A9B3C2] lg:text-lg">
            {playerProfile.body}
          </p>

          <div className="mb-8 space-y-4">
            {playerProfile.stats.map((stat, index) => {
              const Icon = getContentIcon(
                stat.iconKey,
                index === 0 ? Zap : index === 1 ? Target : Activity
              );

              return (
                <div key={`${stat.label}-${index}`} className="rounded-xl bg-[#121A26] p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                        <Icon className="text-accent" size={20} />
                      </div>
                      <span className="font-medium text-white">{stat.label}</span>
                    </div>
                    <span className="text-2xl font-bold text-accent">{stat.value}</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-[#0B0F17]">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-1000"
                      style={{ width: `${getProgressWidth(stat.value)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <a
            href={playerProfileCtaTarget}
            className="inline-flex items-center gap-2 font-semibold text-accent transition-all duration-300 hover:gap-4"
          >
            {playerProfile.cta.label}
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Competences;
