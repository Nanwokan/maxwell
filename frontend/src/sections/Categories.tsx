import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

import { getCategoryTheme } from '../lib/content-icons';
import {
  defaultPublicHomepageData,
  type PublicCategory,
} from '../lib/public-content';

gsap.registerPlugin(ScrollTrigger);

type CategoriesProps = {
  categories?: PublicCategory[];
};

const Categories = ({ categories = defaultPublicHomepageData.categories }: CategoriesProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

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
          headlineRef.current,
          { y: '-10vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0
        );

        const cards = cardsContainerRef.current?.children || [];
        scrollTl.fromTo(
          cards,
          { x: '60vw', rotate: 6, opacity: 0 },
          { x: 0, rotate: 0, opacity: 1, stagger: 0.02, ease: 'none' },
          0.1
        );

        scrollTl.fromTo(
          headlineRef.current,
          { y: 0, opacity: 1 },
          { y: '-6vh', opacity: 0, ease: 'power2.in' },
          0.7
        );

        scrollTl.fromTo(
          cards,
          { x: 0, opacity: 1 },
          { x: '-30vw', opacity: 0, stagger: 0.01, ease: 'power2.in' },
          0.7
        );
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="categories"
      className="section-pinned relative z-30 flex flex-col justify-start bg-[#0B0F17] py-16 lg:justify-center lg:py-0"
    >
      <div ref={headlineRef} className="mb-8 px-5 sm:px-8 lg:px-[8vw]">
        <span className="mb-4 block font-mono text-xs font-bold uppercase tracking-widest text-accent">
          Catégories
        </span>
        <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
          TROUVE TA CATÉGORIE
        </h2>
      </div>

      <div
        ref={cardsContainerRef}
        className="scrollbar-hide flex gap-4 overflow-x-auto px-5 pb-2 sm:gap-6 sm:px-8 lg:px-[8vw] lg:pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => (
          <div
            key={category._id ?? category.code}
            className="hover-lift group h-[340px] w-[250px] flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-[#121A26] sm:h-[380px] sm:w-[280px] lg:h-[420px] lg:w-[320px]"
          >
            <div
              className={`relative flex h-1/2 items-center justify-center overflow-hidden bg-gradient-to-br ${getCategoryTheme(category.themeKey)}`}
            >
              <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-20" />
              <span className="relative z-10 text-5xl font-extrabold text-white sm:text-6xl lg:text-7xl">
                {category.title}
              </span>
            </div>

            <div className="flex h-1/2 flex-col justify-between p-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-accent">
                  {category.ageLabel}
                </span>
                <p className="mt-2 text-base text-white sm:text-lg">{category.description}</p>
              </div>
              <a
                href="#inscription"
                className="flex items-center gap-2 text-[#A9B3C2] transition-colors group-hover:text-accent"
              >
                En savoir plus
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
            </div>

            <div className="h-1 bg-accent/60 transition-colors group-hover:bg-accent" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
