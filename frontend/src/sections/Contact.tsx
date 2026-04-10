import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Facebook, Mail, MapPin, Music2, Phone, Send } from 'lucide-react';
import { toast } from 'sonner';

import { postJson } from '../lib/api';
import {
  defaultPublicHomepageData,
  type PublicSiteSettings,
} from '../lib/public-content';
import { sanitizeEmbedUrl, sanitizeExternalUrl } from '../lib/safe-link';

gsap.registerPlugin(ScrollTrigger);

type ContactResponse = {
  ok: boolean;
  id: string;
};

type ContactProps = {
  settings?: PublicSiteSettings;
};

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

const Contact = ({ settings = defaultPublicHomepageData.settings }: ContactProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const facebookUrl = sanitizeExternalUrl(settings.facebookUrl);
  const tiktokUrl = sanitizeExternalUrl(settings.tiktokUrl);
  const safeMapEmbedUrl = sanitizeEmbedUrl(
    settings.mapEmbedUrl,
    defaultPublicHomepageData.settings.mapEmbedUrl
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await postJson<ContactResponse>('/api/public/contact', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        subject: formData.subject,
        message: formData.message,
      });

      toast.success('Message envoye avec succes. Nous vous contacterons bientot.');
      setFormData(initialFormData);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Impossible d'envoyer le message pour le moment.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        formRef.current,
        { y: '8vh', opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        mapRef.current,
        { x: '6vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: mapRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="relative z-[120] bg-[#0B0F17] py-20 lg:py-32">
      <div className="px-5 sm:px-8 lg:px-[8vw]">
        <div className="mb-12 lg:mb-16">
          <span className="mb-4 block font-mono text-xs font-bold uppercase tracking-widest text-accent">
            Contact
          </span>
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            ECRIS-NOUS
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div ref={formRef}>
            <div className="mb-8 space-y-4">
              <div className="flex items-center gap-4 text-[#A9B3C2]">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <MapPin className="text-accent" size={20} />
                </div>
                <span>
                  {settings.address}
                  {settings.city ? `, ${settings.city}` : ''}
                </span>
              </div>
              <div className="flex items-center gap-4 text-[#A9B3C2]">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <Mail className="text-accent" size={20} />
                </div>
                <span>{settings.email}</span>
              </div>
              <div className="flex items-center gap-4 text-[#A9B3C2]">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <Phone className="text-accent" size={20} />
                </div>
                <span>
                  {settings.phonePrimary}
                  {settings.phoneSecondary ? ` / ${settings.phoneSecondary}` : ''}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nom complet"
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                className="input-dark w-full"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                className="input-dark w-full"
                required
              />
              <input
                type="tel"
                placeholder="Telephone"
                value={formData.phone}
                onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                className="input-dark w-full"
              />
              <input
                type="text"
                placeholder="Sujet"
                value={formData.subject}
                onChange={(event) => setFormData({ ...formData, subject: event.target.value })}
                className="input-dark w-full"
                required
              />
              <textarea
                placeholder="Message"
                value={formData.message}
                onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                className="input-dark h-32 w-full resize-none"
                required
              />
              <button
                type="submit"
                className="btn-primary flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                <Send size={18} />
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
              </button>
            </form>

            <div className="mt-8 flex gap-4">
              {facebookUrl ? (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#121A26] text-[#A9B3C2] transition-colors hover:bg-accent/10 hover:text-accent"
                >
                  <Facebook size={24} />
                </a>
              ) : null}
              {tiktokUrl ? (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#121A26] text-[#A9B3C2] transition-colors hover:bg-accent/10 hover:text-accent"
                >
                  <Music2 size={24} />
                </a>
              ) : null}
            </div>
          </div>

          <div ref={mapRef} className="h-[400px] lg:h-auto">
            <div className="h-full rounded-2xl bg-[#121A26] p-4">
              <iframe
                src={safeMapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '12px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
