import type { Dispatch, SetStateAction } from 'react';
import { CheckCheck, ClipboardList, Mail, MessageCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { EmptyState, ListRow, MetricCard, Surface } from '@/admin/admin-ui';
import type { ContactMessage, Registration, SectionKey } from '@/admin/admin.types';

type ContactSummary = {
  all: number;
  new: number;
  read: number;
  replied: number;
  archived: number;
};

type RegistrationSummary = {
  all: number;
  new: number;
  validated: number;
  rejected: number;
  archived: number;
};

type InboxSectionProps = {
  contactSummary: ContactSummary;
  registrationSummary: RegistrationSummary;
  pendingContactMessages: ContactMessage[];
  pendingRegistrations: Registration[];
  setActiveSection: Dispatch<SetStateAction<SectionKey>>;
  setSelectedRegistrationId: Dispatch<SetStateAction<string | null>>;
  extractId: (item: ContactMessage | Registration) => string;
  formatDate: (value?: string | null) => string;
};

export function InboxSection({
  contactSummary,
  registrationSummary,
  pendingContactMessages,
  pendingRegistrations,
  setActiveSection,
  setSelectedRegistrationId,
  extractId,
  formatDate,
}: InboxSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Nouveaux messages"
          value={contactSummary.new}
          detail={`${contactSummary.all} messages au total`}
          icon={Mail}
          compact
        />
        <MetricCard
          label="Demandes a traiter"
          value={registrationSummary.new}
          detail={`${registrationSummary.all} inscriptions au total`}
          icon={ClipboardList}
          compact
        />
        <MetricCard
          label="Messages replies"
          value={contactSummary.replied}
          detail={`${contactSummary.archived} archives`}
          icon={MessageCircle}
          compact
        />
        <MetricCard
          label="Inscriptions validees"
          value={registrationSummary.validated}
          detail={`${registrationSummary.archived} archivees`}
          icon={CheckCheck}
          compact
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Surface
          title="Notifications messages"
          subtitle="Inbox garde les alertes recentes et renvoie vers la page Messages."
          action={
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-white/10 bg-transparent text-white hover:bg-white/5"
              onClick={() => setActiveSection('messages')}
            >
              Ouvrir Messages
            </Button>
          }
        >
          <div className="space-y-4">
            {pendingContactMessages.length > 0 ? (
              pendingContactMessages.map((item) => (
                <ListRow
                  key={extractId(item)}
                  title={`${item.name} · ${item.subject}`}
                  subtitle={`${item.email}${item.phone ? ` · ${item.phone}` : ''} · ${formatDate(item.createdAt)}`}
                  body={item.message}
                  actionLabel="Traiter"
                  onAction={() => setActiveSection('messages')}
                />
              ))
            ) : (
              <EmptyState
                title="Aucun nouveau message"
                description="La page Messages reste disponible pour consulter l'historique complet."
              />
            )}
          </div>
        </Surface>

        <Surface
          title="Notifications inscriptions"
          subtitle="Inbox garde les nouvelles demandes et renvoie vers la page Inscriptions."
          action={
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-white/10 bg-transparent text-white hover:bg-white/5"
              onClick={() => setActiveSection('registrations')}
            >
              Ouvrir Inscriptions
            </Button>
          }
        >
          <div className="space-y-4">
            {pendingRegistrations.length > 0 ? (
              pendingRegistrations.map((item) => (
                <ListRow
                  key={extractId(item)}
                  title={`${item.childName} · ${item.categoryCode}`}
                  subtitle={`${item.parentName} · ${item.parentPhone} · ${formatDate(item.createdAt)}`}
                  body={item.message || 'Pas de message ajoute sur cette demande.'}
                  actionLabel="Ouvrir"
                  onAction={() => {
                    setSelectedRegistrationId(extractId(item));
                    setActiveSection('registrations');
                  }}
                />
              ))
            ) : (
              <EmptyState
                title="Aucune nouvelle pre-inscription"
                description="Les demandes deja traitees restent disponibles dans la page Inscriptions."
              />
            )}
          </div>
        </Surface>
      </div>
    </div>
  );
}

