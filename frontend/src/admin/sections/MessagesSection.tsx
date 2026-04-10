import { Archive, Bell, Mail, MessageCircle } from 'lucide-react';

import { EmptyState, MetricCard, Surface } from '@/admin/admin-ui';
import type { ContactMessage } from '@/admin/admin.types';

type ContactSummary = {
  all: number;
  new: number;
  read: number;
  replied: number;
  archived: number;
};

type MessagesSectionProps = {
  contactSummary: ContactSummary;
  contactMessages: ContactMessage[];
  contactStatuses: ContactMessage['status'][];
  contactStatusLabels: Record<ContactMessage['status'], string>;
  selectClassName: string;
  extractId: (item: ContactMessage) => string;
  formatDate: (value?: string | null) => string;
  onUpdateContactStatus: (id: string, status: ContactMessage['status']) => void;
};

export function MessagesSection({
  contactSummary,
  contactMessages,
  contactStatuses,
  contactStatusLabels,
  selectClassName,
  extractId,
  formatDate,
  onUpdateContactStatus,
}: MessagesSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Tous les messages"
          value={contactSummary.all}
          detail={`${contactSummary.new} nouveaux`}
          icon={Mail}
          compact
        />
        <MetricCard
          label="Messages lus"
          value={contactSummary.read}
          detail="Deja consultes"
          icon={Bell}
          compact
        />
        <MetricCard
          label="Messages replies"
          value={contactSummary.replied}
          detail="Suivi engage"
          icon={MessageCircle}
          compact
        />
        <MetricCard
          label="Archives"
          value={contactSummary.archived}
          detail="Classement termine"
          icon={Archive}
          compact
        />
      </div>

      <Surface title="Messages de contact" subtitle="Traitement de l'inbox publique">
        <div className="space-y-4">
          {contactMessages.length > 0 ? (
            contactMessages.map((item) => {
              const messageId = extractId(item);

              return (
                <div key={messageId} className="rounded-2xl border border-white/10 bg-[#101928] p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <p className="font-semibold text-white">
                        {item.name} · {item.subject}
                      </p>
                      <p className="text-sm text-[#8C97AB]">
                        {item.email}
                        {item.phone ? ` · ${item.phone}` : ''}
                      </p>
                      <p className="text-xs text-[#6F7A8E]">{formatDate(item.createdAt)}</p>
                    </div>
                    <select
                      value={item.status}
                      onChange={(event) =>
                        onUpdateContactStatus(messageId, event.target.value as ContactMessage['status'])
                      }
                      className={`${selectClassName} max-w-[180px]`}
                    >
                      {contactStatuses.map((status) => (
                        <option key={status} value={status}>
                          {contactStatusLabels[status]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-[#D8DCE4]">{item.message}</p>
                </div>
              );
            })
          ) : (
            <EmptyState
              title="Aucun message de contact"
              description="Les nouveaux messages envoyes depuis le site apparaitront ici."
            />
          )}
        </div>
      </Surface>
    </div>
  );
}

