import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
  defaultPublicHomepageData,
  type PublicPartner,
} from '../lib/public-content';
import { sanitizeExternalUrl } from '../lib/safe-link';

gsap.registerPlugin(ScrollTrigger);

type PartenairesProps = {
  partners?: PublicPartner[];
};

const Partenaires = ({ partners = defaultPublicHomepageData.partners }: PartenairesProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
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
    <section ref={sectionRef} id="partenaires" className="relative z-80 bg-[#0B0F17] py-20 lg:py-32">
      <div className="px-5 sm:px-8 lg:px-[8vw]">
        <div ref={headerRef} className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <span className="mb-4 block font-mono text-xs font-bold uppercase tracking-widest text-accent">
            Soutiens
          </span>
          <h2 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            NOS PARTENAIRES
          </h2>
          <p className="text-[#A9B3C2]">
            Ils nous accompagnent au quotidien pour offrir la meilleure experience a nos joueurs.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {partners.map((partner) => {
            const content = (
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 transition-colors group-hover:bg-accent/20">
                  {partner.logoUrl ? (
                    <img src={partner.logoUrl} alt={partner.name} className="h-10 w-10 object-contain" />
                  ) : (
                    <span className="text-2xl font-bold text-accent">{partner.initials || partner.name.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <span className="text-sm text-[#A9B3C2] transition-colors group-hover:text-white">
                  {partner.name}
                </span>
              </div>
            );

          if (partner.websiteUrl) {
            const safeWebsiteUrl = sanitizeExternalUrl(partner.websiteUrl);

            if (!safeWebsiteUrl) {
              return (
                <div
                  key={partner._id ?? partner.name}
                  className="group flex items-center justify-center rounded-xl bg-[#121A26] p-8 hover-lift"
                >
                  {content}
                </div>
              );
            }

            return (
              <a
                key={partner._id ?? partner.name}
                href={safeWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center rounded-xl bg-[#121A26] p-8 hover-lift"
                >
                  {content}
                </a>
              );
            }

            return (
              <div
                key={partner._id ?? partner.name}
                className="group flex items-center justify-center rounded-xl bg-[#121A26] p-8 hover-lift"
              >
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Partenaires;
