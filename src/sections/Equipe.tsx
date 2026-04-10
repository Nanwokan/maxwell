import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
  defaultPublicHomepageData,
  type PublicStaffMember,
} from '@/lib/public-content';

gsap.registerPlugin(ScrollTrigger);

type EquipeProps = {
  staff?: PublicStaffMember[];
};

const Equipe = ({ staff = defaultPublicHomepageData.staff }: EquipeProps) => {
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

      const cards = gridRef.current?.children || [];
      gsap.fromTo(
        cards,
        { y: '8vh', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
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
    <section ref={sectionRef} id="equipe" className="relative z-60 bg-[#0B0F17] py-20 lg:py-32">
      <div className="px-8 lg:px-[8vw]">
        <div ref={headerRef} className="mb-12 lg:mb-16">
          <span className="mb-4 block font-mono text-xs font-bold uppercase tracking-widest text-accent">
            Encadrement
          </span>
          <h2 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            COACHS & STAFF
          </h2>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {staff.map((member) => (
            <div
              key={member._id ?? `${member.name}-${member.role}`}
              className="group overflow-hidden rounded-2xl bg-[#121A26] hover-lift"
            >
              <div
                className="aspect-[3/4] overflow-hidden"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)' }}
              >
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-6">
                <h3 className="mb-1 text-xl font-bold text-white">{member.name}</h3>
                <p className="text-sm text-[#A9B3C2]">{member.role}</p>
                {member.bio ? <p className="mt-3 text-sm text-[#A9B3C2]">{member.bio}</p> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Equipe;
