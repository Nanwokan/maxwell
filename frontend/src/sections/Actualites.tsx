import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Calendar, Trophy } from 'lucide-react';

import {
  defaultPublicHomepageData,
  type PublicNewsItem,
} from '../lib/public-content';

gsap.registerPlugin(ScrollTrigger);

type ActualitesProps = {
  article?: PublicNewsItem | null;
};

function formatNewsDate(value: string | null): string {
  if (!value) {
    return 'Date a venir';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Date a venir';
  }

  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(date);
}

const Actualites = ({ article = defaultPublicHomepageData.latestNews[0] }: ActualitesProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const imagePanelRef = useRef<HTMLDivElement>(null);
  const accentStripeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const currentArticle = article ?? defaultPublicHomepageData.latestNews[0];

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

  return (
    <section ref={sectionRef} id="actualites" className="section-pinned relative z-50 bg-[#0B0F17]">
      <div
        ref={imagePanelRef}
        className="relative h-[42vh] min-h-[250px] w-full lg:absolute lg:left-0 lg:top-0 lg:h-full lg:w-[56vw] lg:[clip-path:polygon(0_0,100%_0,85%_100%,0_100%)]"
      >
        <img src={currentArticle.coverUrl} alt={currentArticle.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0B0F17]/50" />
      </div>

      <div
        ref={accentStripeRef}
        className="absolute left-[54vw] top-0 hidden h-full w-[2.2vw] bg-accent lg:block lg:[clip-path:polygon(0_0,100%_0,50%_100%,0_100%)]"
      />

      <div className="relative z-10 bg-[#0B0F17] px-5 py-10 sm:px-8 lg:absolute lg:right-0 lg:top-0 lg:flex lg:h-full lg:w-[44vw] lg:items-center lg:px-0 lg:py-0">
        <div ref={contentRef} className="lg:px-[4vw]">
          <span className="mb-4 block font-mono text-xs font-bold uppercase tracking-widest text-accent">
            Actualites
          </span>

          <h2 className="mb-4 text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
            {currentArticle.title}
          </h2>

          <div className="mb-6 flex flex-wrap items-center gap-4 text-[#A9B3C2]">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-accent" />
              <span className="text-sm">{formatNewsDate(currentArticle.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-accent" />
              <span className="text-sm">{currentArticle.categoryLabel || 'Actualite'}</span>
            </div>
          </div>

          <p className="mb-8 max-w-md text-base leading-relaxed text-[#A9B3C2] lg:text-lg">
            {currentArticle.content || currentArticle.excerpt}
          </p>

          <a
            href="#contact"
            className="inline-flex items-center gap-2 font-semibold text-accent transition-all duration-300 hover:gap-4"
          >
            Nous contacter
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Actualites;
