import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, X } from 'lucide-react';

import {
  defaultPublicHomepageData,
  type PublicGalleryItem,
} from '../lib/public-content';
import { sanitizeExternalUrl } from '../lib/safe-link';

gsap.registerPlugin(ScrollTrigger);

type FilterType = 'tout' | 'matchs' | 'entrainement' | 'evenements';

type GalerieProps = {
  initialItems?: PublicGalleryItem[];
  facebookUrl?: string;
};

const Galerie = ({
  initialItems = defaultPublicHomepageData.gallery,
  facebookUrl = defaultPublicHomepageData.settings.facebookUrl,
}: GalerieProps) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('tout');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filters: { label: string; value: FilterType }[] = [
    { label: 'Tout', value: 'tout' },
    { label: 'Matchs', value: 'matchs' },
    { label: 'Entraînement', value: 'entrainement' },
    { label: 'Événements', value: 'evenements' },
  ];

  const filteredImages =
    activeFilter === 'tout'
      ? initialItems
      : initialItems.filter((image) => image.galleryCategory === activeFilter);
  const safeFacebookUrl = sanitizeExternalUrl(facebookUrl);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      const items = gridRef.current?.children || [];
      gsap.fromTo(
        items,
        { y: '10vh', scale: 0.96, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="galerie" className="relative z-70 bg-[#121A26] py-20 lg:py-32">
      <div className="px-5 sm:px-8 lg:px-[8vw]">
        <div
          ref={headerRef}
          className="mb-12 flex flex-col gap-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <span className="mb-4 block font-mono text-xs font-bold uppercase tracking-widest text-accent">
              Médias
            </span>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              GALERIE
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter.value
                    ? 'bg-accent text-[#0B0F17]'
                    : 'bg-[#0B0F17] text-[#A9B3C2] hover:text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div ref={gridRef} className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {filteredImages.map((image) => (
            <div
              key={image._id ?? `${image.title}-${image.imageUrl}`}
              onClick={() => setSelectedImage(image.imageUrl)}
              className={`group relative cursor-pointer overflow-hidden rounded-xl ${
                image.displaySize === 'large'
                  ? 'col-span-2 row-span-2 aspect-square'
                  : image.displaySize === 'medium'
                    ? 'col-span-1 row-span-1 aspect-[4/3]'
                    : 'aspect-square'
              }`}
            >
              <img
                src={image.imageUrl}
                alt={image.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#0B0F17]/80 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="font-semibold text-white">{image.title}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          {safeFacebookUrl ? (
            <a
              href={safeFacebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold text-accent transition-all duration-300 hover:gap-4"
            >
              Voir plus de contenus
              <ArrowRight size={18} />
            </a>
          ) : null}
        </div>
      </div>

      {selectedImage ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B0F17]/95 p-8"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white transition-colors hover:text-accent"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          <img
            src={selectedImage}
            alt="Galerie"
            className="max-h-[90vh] max-w-full rounded-lg object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </section>
  );
};

export default Galerie;
