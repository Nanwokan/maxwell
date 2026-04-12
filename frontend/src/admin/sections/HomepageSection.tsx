import type { Dispatch, SetStateAction } from 'react';
import { Loader2, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  ContentBlockEditor,
  CtaEditor,
  LabeledField,
  PillarListEditor,
  ScheduleListEditor,
  StatListEditor,
  Surface,
} from '@/admin/admin-ui';
import type { HomepageForm } from '@/admin/admin.types';

type HomepageSectionProps = {
  homepageForm: HomepageForm;
  setHomepageForm: Dispatch<SetStateAction<HomepageForm>>;
  isSavingHomepage: boolean;
  onSaveHomepage: () => void;
};

export function HomepageSection({
  homepageForm,
  setHomepageForm,
  isSavingHomepage,
  onSaveHomepage,
}: HomepageSectionProps) {
  return (
    <div className="space-y-6">
      <Surface
        title="Bannière principale"
        subtitle="Contenu principal au-dessus de la ligne de flottaison"
        action={
          <Button
            type="button"
            className="rounded-xl bg-[#FF8A1F] text-[#091018] hover:bg-[#FF9F45]"
            onClick={onSaveHomepage}
            disabled={isSavingHomepage}
          >
            {isSavingHomepage ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Enregistrer la page d'accueil
              </>
            )}
          </Button>
        }
      >
        <div className="grid gap-5 md:grid-cols-2">
          <LabeledField label="Surtitre">
            <Input
              value={homepageForm.hero.eyebrow}
              onChange={(event) =>
                setHomepageForm((current) => ({
                  ...current,
                  hero: { ...current.hero, eyebrow: event.target.value },
                }))
              }
              className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
            />
          </LabeledField>
          <LabeledField label="Saison">
            <Input
              value={homepageForm.hero.seasonLabel}
              onChange={(event) =>
                setHomepageForm((current) => ({
                  ...current,
                  hero: { ...current.hero, seasonLabel: event.target.value },
                }))
              }
              className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
            />
          </LabeledField>
          <LabeledField label="Titre principal">
            <Input
              value={homepageForm.hero.titleMain}
              onChange={(event) =>
                setHomepageForm((current) => ({
                  ...current,
                  hero: { ...current.hero, titleMain: event.target.value },
                }))
              }
              className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
            />
          </LabeledField>
          <LabeledField label="Titre accent">
            <Input
              value={homepageForm.hero.titleAccent}
              onChange={(event) =>
                setHomepageForm((current) => ({
                  ...current,
                  hero: { ...current.hero, titleAccent: event.target.value },
                }))
              }
              className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
            />
          </LabeledField>
          <LabeledField label="Sous-titre" className="md:col-span-2">
            <Textarea
              value={homepageForm.hero.subtitle}
              onChange={(event) =>
                setHomepageForm((current) => ({
                  ...current,
                  hero: { ...current.hero, subtitle: event.target.value },
                }))
              }
              className="min-h-28 rounded-xl border-white/10 bg-[#141d2b] text-white"
            />
          </LabeledField>
          <LabeledField label="Image de fond" className="md:col-span-2">
            <Input
              value={homepageForm.hero.backgroundImageUrl}
              onChange={(event) =>
                setHomepageForm((current) => ({
                  ...current,
                  hero: { ...current.hero, backgroundImageUrl: event.target.value },
                }))
              }
              className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
            />
          </LabeledField>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <CtaEditor
            title="CTA principal"
            value={homepageForm.hero.ctaPrimary}
            onChange={(value) =>
              setHomepageForm((current) => ({
                ...current,
                hero: { ...current.hero, ctaPrimary: value },
              }))
            }
          />
          <CtaEditor
            title="CTA secondaire"
            value={homepageForm.hero.ctaSecondary}
            onChange={(value) =>
              setHomepageForm((current) => ({
                ...current,
                hero: { ...current.hero, ctaSecondary: value },
              }))
            }
          />
        </div>
      </Surface>

        <ContentBlockEditor
          title="Section Le Centre"
          description="Texte, image et stats de la section présentation"
        value={homepageForm.center}
        onChange={(nextValue) =>
          setHomepageForm((current) => ({
            ...current,
            center: { ...current.center, ...nextValue },
          }))
        }
        listEditor={
          <StatListEditor
            title="Stats"
            items={homepageForm.center.stats}
            onChange={(items) =>
              setHomepageForm((current) => ({
                ...current,
                center: { ...current.center, stats: items },
              }))
            }
          />
        }
      />

      <ContentBlockEditor
        title="Projet de développement"
        description="Narration principale et piliers"
        value={homepageForm.development}
        onChange={(nextValue) =>
          setHomepageForm((current) => ({
            ...current,
            development: { ...current.development, ...nextValue },
          }))
        }
        listEditor={
          <PillarListEditor
            title="Piliers"
            items={homepageForm.development.pillars}
            onChange={(items) =>
              setHomepageForm((current) => ({
                ...current,
                development: { ...current.development, pillars: items },
              }))
            }
          />
        }
      />

      <ContentBlockEditor
        title="Profil du mois / compétences"
        description="Texte et stats du bloc compétence"
        value={homepageForm.playerProfile}
        onChange={(nextValue) =>
          setHomepageForm((current) => ({
            ...current,
            playerProfile: { ...current.playerProfile, ...nextValue },
          }))
        }
        listEditor={
          <StatListEditor
            title="Stats compétence"
            items={homepageForm.playerProfile.stats}
            onChange={(items) =>
              setHomepageForm((current) => ({
                ...current,
                playerProfile: { ...current.playerProfile, stats: items },
              }))
            }
          />
        }
      />

      <ContentBlockEditor
        title="Journée d'entraînement"
        description="Texte principal et planning"
        value={homepageForm.trainingDay}
        onChange={(nextValue) =>
          setHomepageForm((current) => ({
            ...current,
            trainingDay: { ...current.trainingDay, ...nextValue },
          }))
        }
        listEditor={
          <ScheduleListEditor
            title="Planning"
            items={homepageForm.trainingDay.schedule}
            onChange={(items) =>
              setHomepageForm((current) => ({
                ...current,
                trainingDay: { ...current.trainingDay, schedule: items },
              }))
            }
          />
        }
      />
    </div>
  );
}



