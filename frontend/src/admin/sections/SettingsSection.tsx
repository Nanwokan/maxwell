import type { Dispatch, SetStateAction } from 'react';
import { Loader2, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LabeledField, Surface } from '@/admin/admin-ui';
import type { SiteSettings } from '@/admin/admin.types';

type SettingsSectionProps = {
  settingsForm: SiteSettings;
  setSettingsForm: Dispatch<SetStateAction<SiteSettings>>;
  isSavingSettings: boolean;
  onSaveSettings: () => void;
};

export function SettingsSection({
  settingsForm,
  setSettingsForm,
  isSavingSettings,
  onSaveSettings,
}: SettingsSectionProps) {
  return (
    <Surface
      title="Parametres du site"
      subtitle="Coordonnees, saison, reseaux et informations globales"
      action={
        <Button
          type="button"
          className="rounded-xl bg-[#D7FF3B] text-[#091018] hover:bg-[#e3ff72]"
          onClick={onSaveSettings}
          disabled={isSavingSettings}
        >
          {isSavingSettings ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sauvegarde...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Enregistrer
            </>
          )}
        </Button>
      }
    >
      <div className="grid gap-5 md:grid-cols-2">
        <LabeledField label="Nom du club">
          <Input
            value={settingsForm.clubName}
            onChange={(event) =>
              setSettingsForm((current) => ({ ...current, clubName: event.target.value }))
            }
            className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
          />
        </LabeledField>
        <LabeledField label="Nom court">
          <Input
            value={settingsForm.clubShortName}
            onChange={(event) =>
              setSettingsForm((current) => ({
                ...current,
                clubShortName: event.target.value,
              }))
            }
            className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
          />
        </LabeledField>
        <LabeledField label="Baseline" className="md:col-span-2">
          <Textarea
            value={settingsForm.tagline}
            onChange={(event) =>
              setSettingsForm((current) => ({ ...current, tagline: event.target.value }))
            }
            className="min-h-24 rounded-xl border-white/10 bg-[#141d2b] text-white"
          />
        </LabeledField>
        <LabeledField label="Saison">
          <Input
            value={settingsForm.seasonLabel}
            onChange={(event) =>
              setSettingsForm((current) => ({
                ...current,
                seasonLabel: event.target.value,
              }))
            }
            className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
          />
        </LabeledField>
        <LabeledField label="Pays">
          <Input
            value={settingsForm.country}
            onChange={(event) =>
              setSettingsForm((current) => ({ ...current, country: event.target.value }))
            }
            className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
          />
        </LabeledField>
        <LabeledField label="Adresse" className="md:col-span-2">
          <Textarea
            value={settingsForm.address}
            onChange={(event) =>
              setSettingsForm((current) => ({ ...current, address: event.target.value }))
            }
            className="min-h-20 rounded-xl border-white/10 bg-[#141d2b] text-white"
          />
        </LabeledField>
        <LabeledField label="Ville">
          <Input
            value={settingsForm.city}
            onChange={(event) =>
              setSettingsForm((current) => ({ ...current, city: event.target.value }))
            }
            className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
          />
        </LabeledField>
        <LabeledField label="Telephone principal">
          <Input
            value={settingsForm.phonePrimary}
            onChange={(event) =>
              setSettingsForm((current) => ({
                ...current,
                phonePrimary: event.target.value,
              }))
            }
            className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
          />
        </LabeledField>
        <LabeledField label="Telephone secondaire">
          <Input
            value={settingsForm.phoneSecondary}
            onChange={(event) =>
              setSettingsForm((current) => ({
                ...current,
                phoneSecondary: event.target.value,
              }))
            }
            className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
          />
        </LabeledField>
        <LabeledField label="WhatsApp">
          <Input
            value={settingsForm.whatsappPhone}
            onChange={(event) =>
              setSettingsForm((current) => ({
                ...current,
                whatsappPhone: event.target.value,
              }))
            }
            className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
          />
        </LabeledField>
        <LabeledField label="Email">
          <Input
            type="email"
            value={settingsForm.email}
            onChange={(event) =>
              setSettingsForm((current) => ({ ...current, email: event.target.value }))
            }
            className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
          />
        </LabeledField>
        <LabeledField label="Facebook">
          <Input
            value={settingsForm.facebookUrl}
            onChange={(event) =>
              setSettingsForm((current) => ({
                ...current,
                facebookUrl: event.target.value,
              }))
            }
            className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
          />
        </LabeledField>
        <LabeledField label="TikTok">
          <Input
            value={settingsForm.tiktokUrl}
            onChange={(event) =>
              setSettingsForm((current) => ({
                ...current,
                tiktokUrl: event.target.value,
              }))
            }
            className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
          />
        </LabeledField>
        <LabeledField label="Lien Google Maps" className="md:col-span-2">
          <Input
            value={settingsForm.mapEmbedUrl}
            onChange={(event) =>
              setSettingsForm((current) => ({
                ...current,
                mapEmbedUrl: event.target.value,
              }))
            }
            className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
          />
        </LabeledField>
      </div>
    </Surface>
  );
}

