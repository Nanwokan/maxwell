import type { Dispatch, SetStateAction } from 'react';
import { Archive, CheckCheck, Mail, MessageCircle, Phone, Save, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState, LabeledField, Surface } from '@/admin/admin-ui';
import type { Registration, RegistrationFilter } from '@/admin/admin.types';

type RegistrationSummary = {
  all: number;
  new: number;
  validated: number;
  rejected: number;
  archived: number;
};

type RegistrationsSectionProps = {
  registrationSummary: RegistrationSummary;
  registrationFilter: RegistrationFilter;
  setRegistrationFilter: Dispatch<SetStateAction<RegistrationFilter>>;
  registrationSearch: string;
  setRegistrationSearch: Dispatch<SetStateAction<string>>;
  filteredRegistrations: Registration[];
  selectedRegistrationId: string | null;
  setSelectedRegistrationId: Dispatch<SetStateAction<string | null>>;
  selectedRegistration: Registration | null;
  registrationNotesDraft: string;
  setRegistrationNotesDraft: Dispatch<SetStateAction<string>>;
  hasRegistrationNotesChanges: boolean;
  isSavingRegistrationNotes: boolean;
  registrationStatuses: Registration['status'][];
  registrationStatusLabels: Record<Registration['status'], string>;
  selectClassName: string;
  extractId: (item: Registration) => string;
  formatDate: (value?: string | null) => string;
  createWhatsAppLink: (phone: string) => string | null;
  onUpdateRegistrationStatus: (id: string, status: Registration['status']) => void;
  onSaveRegistrationNotes: () => void;
};

export function RegistrationsSection({
  registrationSummary,
  registrationFilter,
  setRegistrationFilter,
  registrationSearch,
  setRegistrationSearch,
  filteredRegistrations,
  selectedRegistrationId,
  setSelectedRegistrationId,
  selectedRegistration,
  registrationNotesDraft,
  setRegistrationNotesDraft,
  hasRegistrationNotesChanges,
  isSavingRegistrationNotes,
  registrationStatuses,
  registrationStatusLabels,
  selectClassName,
  extractId,
  formatDate,
  createWhatsAppLink,
  onUpdateRegistrationStatus,
  onSaveRegistrationNotes,
}: RegistrationsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {([
          ['all', 'Tous', registrationSummary.all],
          ['new', 'A traiter', registrationSummary.new],
          ['validated', 'Valides', registrationSummary.validated],
          ['rejected', 'Refuses', registrationSummary.rejected],
          ['archived', 'Archives', registrationSummary.archived],
        ] as const).map(([value, label, count]) => {
          const isActive = registrationFilter === value;

          return (
            <button
              key={value}
              type="button"
              onClick={() => setRegistrationFilter(value)}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                isActive
                  ? 'border-[#D7FF3B]/50 bg-[#D7FF3B]/10 text-white'
                  : 'border-white/10 bg-[#121D2A] text-[#D2D7E0] hover:bg-[#162131]'
              }`}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[#8C97AB]">{label}</p>
              <p className="mt-2 text-2xl font-black text-white">{count}</p>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,1fr)]">
        <Surface title="Pre-inscriptions" subtitle="Suivi des demandes d'essai">
          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
              <LabeledField label="Rechercher une inscription">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6F7A8E]" />
                  <Input
                    value={registrationSearch}
                    onChange={(event) => setRegistrationSearch(event.target.value)}
                    placeholder="Nom enfant, parent, email, telephone, ville..."
                    className="h-11 rounded-xl border-white/10 bg-[#141d2b] pl-10 text-white"
                  />
                </div>
              </LabeledField>

              <LabeledField label="Statut affiche">
                <select
                  value={registrationFilter}
                  onChange={(event) => setRegistrationFilter(event.target.value as RegistrationFilter)}
                  className={selectClassName}
                >
                  <option value="all">Tous les statuts</option>
                  {registrationStatuses.map((status) => (
                    <option key={status} value={status}>
                      {registrationStatusLabels[status]}
                    </option>
                  ))}
                </select>
              </LabeledField>
            </div>

            {filteredRegistrations.length > 0 ? (
              filteredRegistrations.map((item) => {
                const registrationId = extractId(item);
                const isSelected = registrationId === selectedRegistrationId;

                return (
                  <div
                    key={registrationId}
                    onClick={() => setSelectedRegistrationId(registrationId)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedRegistrationId(registrationId);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? 'border-[#D7FF3B]/45 bg-[#162131]'
                        : 'border-white/10 bg-[#101928] hover:bg-[#131E2D]'
                    }`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-1">
                        <p className="font-semibold text-white">
                          {item.childName} · {item.categoryCode}
                        </p>
                        <p className="text-sm text-[#8C97AB]">
                          {item.parentName} · {item.parentPhone}
                        </p>
                      </div>
                      <select
                        value={item.status}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) =>
                          onUpdateRegistrationStatus(registrationId, event.target.value as Registration['status'])
                        }
                        className={`${selectClassName} max-w-[180px]`}
                      >
                        {registrationStatuses.map((status) => (
                          <option key={status} value={status}>
                            {registrationStatusLabels[status]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState
                title="Aucune inscription pour ce filtre"
                description="Change le statut ou la recherche pour afficher d'autres demandes."
              />
            )}
          </div>
        </Surface>

        <div className="rounded-[1.75rem] border border-white/10 bg-[#0F1724] p-5">
          {selectedRegistration ? (
            <>
              <div className="border-b border-white/10 pb-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-[#D7FF3B]">Dossier inscription</p>
                    <h4 className="mt-2 text-2xl font-black text-white">{selectedRegistration.childName}</h4>
                    <p className="mt-1 text-sm text-[#8C97AB]">
                      {selectedRegistration.categoryCode} · {selectedRegistration.childAge} ans
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#D7FF3B]">
                    {registrationStatusLabels[selectedRegistration.status]}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    className="rounded-xl bg-[#D7FF3B] text-[#091018] hover:bg-[#e3ff72]"
                    onClick={() => onUpdateRegistrationStatus(extractId(selectedRegistration), 'validated')}
                    disabled={selectedRegistration.status === 'validated'}
                  >
                    <CheckCheck className="h-4 w-4" />
                    Valider
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl border-white/10 bg-transparent text-white hover:bg-white/5"
                    onClick={() => onUpdateRegistrationStatus(extractId(selectedRegistration), 'rejected')}
                    disabled={selectedRegistration.status === 'rejected'}
                  >
                    Refuser
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl border-white/10 bg-transparent text-white hover:bg-white/5"
                    onClick={() => onUpdateRegistrationStatus(extractId(selectedRegistration), 'archived')}
                    disabled={selectedRegistration.status === 'archived'}
                  >
                    <Archive className="h-4 w-4" />
                    Archiver
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl border-white/10 bg-transparent text-white hover:bg-white/5"
                    onClick={() => onUpdateRegistrationStatus(extractId(selectedRegistration), 'new')}
                    disabled={selectedRegistration.status === 'new'}
                  >
                    Remettre a traiter
                  </Button>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[#111C2A] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#6F7A8E]">Parent</p>
                  <p className="mt-2 font-semibold text-white">{selectedRegistration.parentName}</p>
                  <p className="mt-1 text-sm text-[#8C97AB]">{selectedRegistration.parentEmail}</p>
                  <p className="mt-1 text-sm text-[#8C97AB]">{selectedRegistration.parentPhone}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#111C2A] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#6F7A8E]">Logistique</p>
                  <p className="mt-2 font-semibold text-white">
                    {selectedRegistration.city || 'Ville non renseignee'}
                  </p>
                  <p className="mt-1 text-sm text-[#8C97AB]">Recu le {formatDate(selectedRegistration.createdAt)}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={`tel:${selectedRegistration.parentPhone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/5"
                >
                  <Phone className="h-4 w-4" />
                  Appeler
                </a>
                <a
                  href={`mailto:${selectedRegistration.parentEmail}?subject=${encodeURIComponent(`Pre-inscription ${selectedRegistration.childName}`)}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/5"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </a>
                {createWhatsAppLink(selectedRegistration.parentPhone) ? (
                  <a
                    href={createWhatsAppLink(selectedRegistration.parentPhone) ?? '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/5"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                ) : null}
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-[#111C2A] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[#6F7A8E]">Message du parent</p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#D8DCE4]">
                  {selectedRegistration.message || 'Aucun message ajoute a la demande.'}
                </p>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-[#111C2A] p-4">
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#6F7A8E]">Notes internes</p>
                    <p className="mt-1 text-sm text-[#8C97AB]">Notes visibles uniquement dans le cockpit.</p>
                  </div>
                  <Button
                    type="button"
                    className="rounded-xl bg-[#D7FF3B] text-[#091018] hover:bg-[#e3ff72]"
                    onClick={onSaveRegistrationNotes}
                    disabled={!hasRegistrationNotesChanges || isSavingRegistrationNotes}
                  >
                    <Save className="h-4 w-4" />
                    {isSavingRegistrationNotes ? 'Enregistrement...' : 'Enregistrer'}
                  </Button>
                </div>
                <Textarea
                  value={registrationNotesDraft}
                  onChange={(event) => setRegistrationNotesDraft(event.target.value)}
                  className="min-h-32 rounded-xl border-white/10 bg-[#141d2b] text-white"
                  placeholder="Ex: parent rappelle mardi, essai a confirmer, dossier a completer..."
                />
              </div>
            </>
          ) : (
            <EmptyState
              title="Selectionne une pre-inscription"
              description="Choisis une demande dans la liste pour afficher le dossier complet et agir dessus."
            />
          )}
        </div>
      </div>
    </div>
  );
}

