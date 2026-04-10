import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, Users } from 'lucide-react';

import {
  defaultPublicHomepageData,
  type PublicHomepageContent,
} from '../lib/public-content';
import { sanitizeAnchorOrLink } from '../lib/safe-link';

gsap.registerPlugin(ScrollTrigger);

type JourneeEntrainementProps = {
  trainingDay?: PublicHomepageContent['trainingDay'];
};

const JourneeEntrainement = ({
  trainingDay = defaultPublicHomepageData.homepage.trainingDay,
}: JourneeEntrainementProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const imagePanelRef = useRef<HTMLDivElement>(null);
  const accentStripeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);

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
          { x: '60vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0
        );

        scrollTl.fromTo(
          accentStripeRef.current,
          { x: '6vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0.05
        );

        scrollTl.fromTo(
          contentRef.current,
          { x: '-18vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0.1
        );

        scrollTl.fromTo(
          scheduleRef.current?.children || [],
          { x: '-4vw', opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.02, ease: 'none' },
          0.15
        );

        scrollTl.fromTo(
          imagePanelRef.current,
          { x: 0, opacity: 1 },
          { x: '20vw', opacity: 0, ease: 'power2.in' },
          0.7
        );

        scrollTl.fromTo(
          accentStripeRef.current,
          { x: 0, opacity: 1 },
          { x: '6vw', opacity: 0, ease: 'power2.in' },
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

  const trainingDayCtaTarget = sanitizeAnchorOrLink(trainingDay.cta.target, '#contact');

  return (
    <section ref={sectionRef} id="journee" className="section-pinned relative z-[110] bg-[#0B0F17]">
      <div className="relative z-10 bg-[#0B0F17] px-5 py-10 sm:px-8 lg:absolute lg:left-0 lg:top-0 lg:flex lg:h-full lg:w-[44vw] lg:items-center lg:px-0 lg:py-0">
        <div ref={contentRef} className="lg:px-[6vw]">
          <span className="mb-4 block font-mono text-xs font-bold uppercase tracking-widest text-accent">
            {trainingDay.eyebrow}
          </span>

          <h2 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {trainingDay.title}
          </h2>

          <p className="mb-8 max-w-md text-base leading-relaxed text-[#A9B3C2] lg:text-lg">
            {trainingDay.body}
          </p>

          <div ref={scheduleRef} className="mb-8 space-y-3">
            {trainingDay.schedule.map((item, index) => (
              <div
                key={`${item.timeLabel}-${index}`}
                className="flex items-center gap-4 rounded-xl bg-[#121A26] p-4"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <Clock className="text-accent" size={20} />
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                  <span className="font-mono font-bold text-accent">{item.timeLabel}</span>
                  <span className="text-white">{item.activity}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <a href={trainingDayCtaTarget} className="btn-primary flex items-center justify-center gap-2">
              <Users size={18} />
              {trainingDay.cta.label}
            </a>
          </div>
        </div>
      </div>

      <div
        ref={accentStripeRef}
        className="absolute left-[42vw] top-0 hidden h-full w-[2.2vw] bg-accent lg:block lg:[clip-path:polygon(50%_0,100%_0,100%_100%,0_100%)]"
      />

      <div
        ref={imagePanelRef}
        className="relative h-[42vh] min-h-[250px] w-full lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-[56vw] lg:[clip-path:polygon(15%_0,100%_0,100%_100%,0_100%)]"
      >
        <img src={trainingDay.imageUrl} alt={trainingDay.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0B0F17]/50" />
      </div>
    </section>
  );
};

export default JourneeEntrainement;
