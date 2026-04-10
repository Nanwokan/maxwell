import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Loader2, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createEmptyPillar, createEmptySchedule, createEmptyStat } from '@/admin/admin.helpers';
import type { CtaForm, PillarItem, ScheduleItem, StatItem } from '@/admin/admin.types';

export function LoadingState() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center rounded-[2rem] border border-white/10 bg-[#101928]">
      <div className="flex items-center gap-3 text-[#D7FF3B]">
        <Loader2 className="h-5 w-5 animate-spin" />
        Chargement du back-office...
      </div>
    </div>
  );
}

export function FeatureTile({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D7FF3B]/10 text-[#D7FF3B]">
        <Icon className="h-5 w-5" />
      </div>
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm text-[#8C97AB]">{description}</p>
    </div>
  );
}

export function Surface({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#101928] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
      <div className="mb-6 flex flex-col gap-3 border-b border-white/10 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="mt-1 text-sm text-[#8C97AB]">{subtitle}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  compact = false,
}: {
  label: string;
  value: number;
  detail: string;
  icon: LucideIcon;
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-[1.75rem] border border-white/10 bg-[#101928] ${
        compact ? 'p-4' : 'p-5'
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-[#8C97AB]">{label}</p>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D7FF3B]/10 text-[#D7FF3B]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-3xl font-black tracking-tight text-white">{value}</p>
      <p className="mt-2 text-sm text-[#8C97AB]">{detail}</p>
    </div>
  );
}

export function ListRow({
  title,
  subtitle,
  body,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#121D2A] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-white">{title}</p>
          <p className="mt-1 text-sm text-[#8C97AB]">{subtitle}</p>
        </div>
        {actionLabel && onAction ? (
          <Button
            type="button"
            variant="outline"
            className="rounded-xl border-white/10 bg-transparent text-white hover:bg-white/5"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        ) : null}
      </div>
      {body ? <p className="mt-3 text-sm leading-6 text-[#D8DCE4]">{body}</p> : null}
    </div>
  );
}

export function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: 'success' | 'muted';
}) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
        tone === 'success'
          ? 'bg-emerald-400/15 text-emerald-200'
          : 'bg-white/10 text-[#B6BECC]'
      }`}
    >
      {label}
    </span>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-[#121D2A]/50 p-6 text-center">
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm text-[#8C97AB]">{description}</p>
    </div>
  );
}

export function LabeledField({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ''}`}>
      <span className="mb-2 block text-sm font-medium text-[#CFD5DE]">{label}</span>
      {children}
    </label>
  );
}

export function CtaEditor({
  title,
  value,
  onChange,
}: {
  title: string;
  value: CtaForm;
  onChange: (value: CtaForm) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#121D2A] p-4">
      <p className="mb-4 font-semibold text-white">{title}</p>
      <div className="space-y-4">
        <LabeledField label="Label">
          <Input
            value={value.label}
            onChange={(event) => onChange({ ...value, label: event.target.value })}
            className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
          />
        </LabeledField>
        <LabeledField label="Cible">
          <Input
            value={value.target}
            onChange={(event) => onChange({ ...value, target: event.target.value })}
            className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
          />
        </LabeledField>
      </div>
    </div>
  );
}

export function ContentBlockEditor({
  title,
  description,
  value,
  onChange,
  listEditor,
}: {
  title: string;
  description: string;
  value: {
    eyebrow: string;
    title: string;
    body: string;
    imageUrl: string;
    cta: CtaForm;
  };
  onChange: (value: {
    eyebrow: string;
    title: string;
    body: string;
    imageUrl: string;
    cta: CtaForm;
  }) => void;
  listEditor: ReactNode;
}) {
  return (
    <Surface title={title} subtitle={description}>
      <div className="grid gap-5 md:grid-cols-2">
        <LabeledField label="Eyebrow">
          <Input
            value={value.eyebrow}
            onChange={(event) => onChange({ ...value, eyebrow: event.target.value })}
            className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
          />
        </LabeledField>
        <LabeledField label="Image URL">
          <Input
            value={value.imageUrl}
            onChange={(event) => onChange({ ...value, imageUrl: event.target.value })}
            className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
          />
        </LabeledField>
        <LabeledField label="Titre" className="md:col-span-2">
          <Input
            value={value.title}
            onChange={(event) => onChange({ ...value, title: event.target.value })}
            className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
          />
        </LabeledField>
        <LabeledField label="Texte" className="md:col-span-2">
          <Textarea
            value={value.body}
            onChange={(event) => onChange({ ...value, body: event.target.value })}
            className="min-h-32 rounded-xl border-white/10 bg-[#141d2b] text-white"
          />
        </LabeledField>
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <CtaEditor title="CTA" value={value.cta} onChange={(cta) => onChange({ ...value, cta })} />
        {listEditor}
      </div>
    </Surface>
  );
}

export function StatListEditor({
  title,
  items,
  onChange,
}: {
  title: string;
  items: StatItem[];
  onChange: (items: StatItem[]) => void;
}) {
  function updateItem(index: number, patch: Partial<StatItem>) {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#121D2A] p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="font-semibold text-white">{title}</p>
        <Button
          type="button"
          variant="outline"
          className="rounded-xl border-white/10 bg-transparent text-white hover:bg-white/5"
          onClick={() => onChange([...items, createEmptyStat()])}
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={`${item.label}-${index}`} className="rounded-2xl border border-white/10 p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-[#CFD5DE]">Stat #{index + 1}</p>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
                className="text-sm text-red-300 transition hover:text-red-200"
              >
                Supprimer
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <LabeledField label="Label">
                <Input
                  value={item.label}
                  onChange={(event) => updateItem(index, { label: event.target.value })}
                  className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
                />
              </LabeledField>
              <LabeledField label="Valeur">
                <Input
                  value={item.value}
                  onChange={(event) => updateItem(index, { value: event.target.value })}
                  className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
                />
              </LabeledField>
              <LabeledField label="Icon key">
                <Input
                  value={item.iconKey}
                  onChange={(event) => updateItem(index, { iconKey: event.target.value })}
                  className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
                />
              </LabeledField>
              <LabeledField label="Ordre">
                <Input
                  type="number"
                  value={item.sortOrder}
                  onChange={(event) =>
                    updateItem(index, {
                      sortOrder: Number.parseInt(event.target.value || '0', 10) || 0,
                    })
                  }
                  className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
                />
              </LabeledField>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PillarListEditor({
  title,
  items,
  onChange,
}: {
  title: string;
  items: PillarItem[];
  onChange: (items: PillarItem[]) => void;
}) {
  function updateItem(index: number, patch: Partial<PillarItem>) {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#121D2A] p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="font-semibold text-white">{title}</p>
        <Button
          type="button"
          variant="outline"
          className="rounded-xl border-white/10 bg-transparent text-white hover:bg-white/5"
          onClick={() => onChange([...items, createEmptyPillar()])}
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={`${item.label}-${index}`} className="rounded-2xl border border-white/10 p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-[#CFD5DE]">Pilier #{index + 1}</p>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
                className="text-sm text-red-300 transition hover:text-red-200"
              >
                Supprimer
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <LabeledField label="Label">
                <Input
                  value={item.label}
                  onChange={(event) => updateItem(index, { label: event.target.value })}
                  className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
                />
              </LabeledField>
              <LabeledField label="Icon key">
                <Input
                  value={item.iconKey}
                  onChange={(event) => updateItem(index, { iconKey: event.target.value })}
                  className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
                />
              </LabeledField>
              <LabeledField label="Description" className="md:col-span-2">
                <Textarea
                  value={item.description}
                  onChange={(event) => updateItem(index, { description: event.target.value })}
                  className="min-h-24 rounded-xl border-white/10 bg-[#141d2b] text-white"
                />
              </LabeledField>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ScheduleListEditor({
  title,
  items,
  onChange,
}: {
  title: string;
  items: ScheduleItem[];
  onChange: (items: ScheduleItem[]) => void;
}) {
  function updateItem(index: number, patch: Partial<ScheduleItem>) {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#121D2A] p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="font-semibold text-white">{title}</p>
        <Button
          type="button"
          variant="outline"
          className="rounded-xl border-white/10 bg-transparent text-white hover:bg-white/5"
          onClick={() => onChange([...items, createEmptySchedule()])}
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={`${item.timeLabel}-${index}`} className="rounded-2xl border border-white/10 p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-[#CFD5DE]">Creneau #{index + 1}</p>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
                className="text-sm text-red-300 transition hover:text-red-200"
              >
                Supprimer
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <LabeledField label="Horaire">
                <Input
                  value={item.timeLabel}
                  onChange={(event) => updateItem(index, { timeLabel: event.target.value })}
                  className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
                />
              </LabeledField>
              <LabeledField label="Activite">
                <Input
                  value={item.activity}
                  onChange={(event) => updateItem(index, { activity: event.target.value })}
                  className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
                />
              </LabeledField>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
