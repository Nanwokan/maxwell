import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Check, FileText } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { postJson } from '../lib/api';
import {
  defaultPublicHomepageData,
  type PublicCategory,
} from '../lib/public-content';

gsap.registerPlugin(ScrollTrigger);

type InscriptionProps = {
  seasonLabel?: string;
  categories?: PublicCategory[];
};

type RegistrationResponse = {
  ok: boolean;
  id: string;
};

type RegistrationForm = {
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  childName: string;
  childAge: string;
  categoryCode: string;
  city: string;
  message: string;
};

function getAgeRangeLabel(categories: PublicCategory[]): string {
  const ages = categories
    .flatMap((category) => (category.ageLabel.match(/\d+/g) ?? []).map((value) => Number.parseInt(value, 10)))
    .filter((value) => Number.isFinite(value));

  if (ages.length === 0) {
    return '6 a 17 ans';
  }

  return `${Math.min(...ages)} a ${Math.max(...ages)} ans`;
}

function createInitialForm(categories: PublicCategory[]): RegistrationForm {
  return {
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    childName: '',
    childAge: '',
    categoryCode: categories[0]?.code ?? '',
    city: '',
    message: '',
  };
}

const steps = [
  'Remplis le formulaire en ligne',
  "Recois ta convocation d'essai",
  "Valide ton inscription",
];

const Inscription = ({
  seasonLabel = defaultPublicHomepageData.settings.seasonLabel,
  categories = defaultPublicHomepageData.categories,
}: InscriptionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const imagePanelRef = useRef<HTMLDivElement>(null);
  const accentStripeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<RegistrationForm>(() => createInitialForm(categories));

  useEffect(() => {
    setFormData((current) => {
      if (current.categoryCode || categories.length === 0) {
        return current;
      }

      return { ...current, categoryCode: categories[0].code };
    });
  }, [categories]);

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
        stepsRef.current?.children || [],
        { y: '4vh', opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.02, ease: 'none' },
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
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await postJson<RegistrationResponse>('/api/public/registrations', {
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        parentEmail: formData.parentEmail,
        childName: formData.childName,
        childAge: Number.parseInt(formData.childAge, 10),
        categoryCode: formData.categoryCode,
        city: formData.city || undefined,
        message: formData.message || undefined,
      });

      toast.success("Pre-inscription envoyee. Nous revenons vers vous rapidement.");
      setFormData(createInitialForm(categories));
      setIsDialogOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Impossible d'envoyer la pre-inscription.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section ref={sectionRef} id="inscription" className="section-pinned relative z-40 bg-[#0B0F17]">
      <div className="absolute top-0 left-0 flex h-full w-[44vw] items-center bg-[#0B0F17]">
        <div ref={contentRef} className="px-8 lg:px-[6vw]">
          <span className="mb-4 block font-mono text-xs font-bold uppercase tracking-widest text-accent">
            Inscription
          </span>

          <h2 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            REJOINS L'AVENTURE
          </h2>

          <p className="mb-8 max-w-md text-base leading-relaxed text-[#A9B3C2] lg:text-lg">
            {seasonLabel} - ouverte aux joueurs de {getAgeRangeLabel(categories)}. Essai gratuit
            possible sur demande.
          </p>

          <div ref={stepsRef} className="mb-8 space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent/10">
                  <Check className="text-accent" size={16} />
                </div>
                <span className="text-white">{step}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary flex h-auto items-center justify-center gap-2 px-6 py-3 text-base text-[#0B0F17]">
                  Pre-inscription
                  <ArrowRight size={18} />
                </Button>
              </DialogTrigger>

              <DialogContent className="max-h-[calc(100vh-2rem)] max-w-2xl gap-0 overflow-hidden rounded-[1.5rem] border-white/10 bg-[#0F1724] p-0 text-white shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
                <div className="border-b border-white/10 px-6 py-5 lg:px-8">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-extrabold tracking-tight text-white">
                      Pre-inscription en ligne
                    </DialogTitle>
                    <DialogDescription className="text-sm text-[#8FA0B7]">
                      Renseigne les informations du parent et du joueur. La demande arrivera
                      directement dans l’inbox admin.
                    </DialogDescription>
                  </DialogHeader>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="flex-1 space-y-5 overflow-y-auto px-6 py-6 lg:px-8"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-[#D6DEEA]">
                        Parent / responsable
                      </span>
                      <input
                        type="text"
                        value={formData.parentName}
                        onChange={(event) =>
                          setFormData((current) => ({ ...current, parentName: event.target.value }))
                        }
                        className="input-dark w-full"
                        placeholder="Nom du parent"
                        required
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-[#D6DEEA]">
                        Telephone
                      </span>
                      <input
                        type="tel"
                        value={formData.parentPhone}
                        onChange={(event) =>
                          setFormData((current) => ({ ...current, parentPhone: event.target.value }))
                        }
                        className="input-dark w-full"
                        placeholder="+225 ..."
                        required
                      />
                    </label>

                    <label className="block md:col-span-2">
                      <span className="mb-2 block text-sm font-medium text-[#D6DEEA]">
                        Email
                      </span>
                      <input
                        type="email"
                        value={formData.parentEmail}
                        onChange={(event) =>
                          setFormData((current) => ({ ...current, parentEmail: event.target.value }))
                        }
                        className="input-dark w-full"
                        placeholder="parent@email.com"
                        required
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-[#D6DEEA]">
                        Nom du joueur
                      </span>
                      <input
                        type="text"
                        value={formData.childName}
                        onChange={(event) =>
                          setFormData((current) => ({ ...current, childName: event.target.value }))
                        }
                        className="input-dark w-full"
                        placeholder="Nom de l'enfant"
                        required
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-[#D6DEEA]">
                        Age
                      </span>
                      <input
                        type="number"
                        min={4}
                        max={19}
                        value={formData.childAge}
                        onChange={(event) =>
                          setFormData((current) => ({ ...current, childAge: event.target.value }))
                        }
                        className="input-dark w-full"
                        placeholder="12"
                        required
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-[#D6DEEA]">
                        Categorie
                      </span>
                      <select
                        value={formData.categoryCode}
                        onChange={(event) =>
                          setFormData((current) => ({ ...current, categoryCode: event.target.value }))
                        }
                        className="input-dark w-full"
                        required
                      >
                        {categories.map((category) => (
                          <option
                            key={category._id ?? category.code}
                            value={category.code}
                            className="bg-[#121A26] text-white"
                          >
                            {category.title} · {category.ageLabel}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-[#D6DEEA]">
                        Ville
                      </span>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(event) =>
                          setFormData((current) => ({ ...current, city: event.target.value }))
                        }
                        className="input-dark w-full"
                        placeholder="Abidjan"
                      />
                    </label>

                    <label className="block md:col-span-2">
                      <span className="mb-2 block text-sm font-medium text-[#D6DEEA]">
                        Message
                      </span>
                      <textarea
                        value={formData.message}
                        onChange={(event) =>
                          setFormData((current) => ({ ...current, message: event.target.value }))
                        }
                        className="input-dark h-28 w-full resize-none"
                        placeholder="Precisions utiles, disponibilites, questions..."
                      />
                    </label>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-white/10 bg-transparent text-white hover:bg-white/5"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Fermer
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#D7FF3B] text-[#0B0F17] hover:bg-[#e8ff7b]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Envoi en cours...' : 'Envoyer la pre-inscription'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <a
              href="#contact"
              className="flex items-center justify-center gap-2 text-[#A9B3C2] transition-colors hover:text-accent"
            >
              <FileText size={18} />
              Demander la fiche medicale
            </a>
          </div>
        </div>
      </div>

      <div
        ref={accentStripeRef}
        className="absolute top-0 left-[42vw] h-full w-[2.2vw] bg-accent"
        style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 0 100%)' }}
      />

      <div
        ref={imagePanelRef}
        className="absolute top-0 right-0 h-full w-[56vw]"
        style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)' }}
      >
        <img
          src="/images/inscription-joueur.jpg"
          alt="Inscription"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0B0F17]/50" />
      </div>
    </section>
  );
};

export default Inscription;
