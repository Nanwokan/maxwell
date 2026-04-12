import type {
  AdminSession,
  ContactMessage,
  CtaForm,
  EntityWithId,
  HomepageForm,
  NewsForm,
  NewsItem,
  PillarItem,
  Registration,
  ScheduleItem,
  SectionKey,
  SiteSettings,
  StatItem,
} from '@/admin/admin.types';

const SESSION_STORAGE_KEY = 'maxwell-admin-session';

export const sectionLabels: Record<SectionKey, string> = {
  overview: "Vue d'ensemble",
  settings: 'Paramètres du site',
  homepage: "Contenu de la page d'accueil",
  news: 'Actualités',
  inbox: 'Boîte de réception',
  messages: 'Messages',
  registrations: 'Inscriptions',
};

export const contactStatuses: ContactMessage['status'][] = ['new', 'read', 'replied', 'archived'];
export const contactStatusLabels: Record<ContactMessage['status'], string> = {
  new: 'Nouveau',
  read: 'Lu',
  replied: 'Répondu',
  archived: 'Archivé',
};

export const registrationStatuses: Registration['status'][] = [
  'new',
  'validated',
  'rejected',
  'archived',
];

export const registrationStatusLabels: Record<Registration['status'], string> = {
  new: 'Nouveau',
  validated: 'Validé',
  rejected: 'Refusé',
  archived: 'Archivé',
};

export const selectClassName =
  'h-10 w-full rounded-xl border border-white/10 bg-[#141d2b] px-3 text-sm text-white outline-none transition focus:border-[#FF8A1F]';

export function extractId(entity: EntityWithId): string {
  if (typeof entity.id === 'string' && entity.id.length > 0) {
    return entity.id;
  }

  if (typeof entity._id === 'string' && entity._id.length > 0) {
    return entity._id;
  }

  if (entity._id && typeof entity._id === 'object' && 'toString' in entity._id) {
    return entity._id.toString();
  }

  return '';
}

export function safeSessionRead(): AdminSession | null {
  try {
    const rawSession = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!rawSession) {
      return null;
    }

    const parsed = JSON.parse(rawSession) as AdminSession;
    if (!parsed.user) {
      return null;
    }

    const normalizedToken =
      typeof parsed.token === 'string' && parsed.token.trim().length > 0
        ? parsed.token.trim()
        : undefined;

    return {
      ...parsed,
      token: normalizedToken,
    };
  } catch {
    return null;
  }
}

export function persistSession(session: AdminSession | null): void {
  if (!session) {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function createEmptyStat(): StatItem {
  return { label: '', value: '', iconKey: '', sortOrder: 0 };
}

export function createEmptyPillar(): PillarItem {
  return { label: '', description: '', iconKey: '', sortOrder: 0 };
}

export function createEmptySchedule(): ScheduleItem {
  return { timeLabel: '', activity: '', sortOrder: 0 };
}

export function createEmptyNewsForm(): NewsForm {
  return {
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverUrl: '',
    categoryLabel: '',
    tags: '',
    status: 'draft',
  };
}

export function normalizeSettings(settings?: Partial<SiteSettings> | null): SiteSettings {
  return {
    clubName: settings?.clubName ?? '',
    clubShortName: settings?.clubShortName ?? '',
    tagline: settings?.tagline ?? '',
    seasonLabel: settings?.seasonLabel ?? '',
    address: settings?.address ?? '',
    city: settings?.city ?? '',
    country: settings?.country ?? '',
    phonePrimary: settings?.phonePrimary ?? '',
    phoneSecondary: settings?.phoneSecondary ?? '',
    email: settings?.email ?? '',
    facebookUrl: settings?.facebookUrl ?? '',
    tiktokUrl: settings?.tiktokUrl ?? '',
    whatsappPhone: settings?.whatsappPhone ?? '',
    mapEmbedUrl: settings?.mapEmbedUrl ?? '',
  };
}

export function normalizeCta(cta?: Partial<CtaForm> | null): CtaForm {
  return {
    label: cta?.label ?? '',
    target: cta?.target ?? '',
  };
}

export function normalizeStat(item?: Partial<StatItem> | null): StatItem {
  return {
    label: item?.label ?? '',
    value: item?.value ?? '',
    iconKey: item?.iconKey ?? '',
    sortOrder: typeof item?.sortOrder === 'number' ? item.sortOrder : 0,
  };
}

export function normalizePillar(item?: Partial<PillarItem> | null): PillarItem {
  return {
    label: item?.label ?? '',
    description: item?.description ?? '',
    iconKey: item?.iconKey ?? '',
    sortOrder: typeof item?.sortOrder === 'number' ? item.sortOrder : 0,
  };
}

export function normalizeSchedule(item?: Partial<ScheduleItem> | null): ScheduleItem {
  return {
    timeLabel: item?.timeLabel ?? '',
    activity: item?.activity ?? '',
    sortOrder: typeof item?.sortOrder === 'number' ? item.sortOrder : 0,
  };
}

export function normalizeHomepage(content?: Partial<HomepageForm> | null): HomepageForm {
  return {
    hero: {
      eyebrow: content?.hero?.eyebrow ?? '',
      titleMain: content?.hero?.titleMain ?? '',
      titleAccent: content?.hero?.titleAccent ?? '',
      subtitle: content?.hero?.subtitle ?? '',
      seasonLabel: content?.hero?.seasonLabel ?? '',
      backgroundImageUrl: content?.hero?.backgroundImageUrl ?? '',
      ctaPrimary: normalizeCta(content?.hero?.ctaPrimary),
      ctaSecondary: normalizeCta(content?.hero?.ctaSecondary),
    },
    center: {
      eyebrow: content?.center?.eyebrow ?? '',
      title: content?.center?.title ?? '',
      body: content?.center?.body ?? '',
      imageUrl: content?.center?.imageUrl ?? '',
      cta: normalizeCta(content?.center?.cta),
      stats: (content?.center?.stats ?? []).map((item) => normalizeStat(item)),
    },
    development: {
      eyebrow: content?.development?.eyebrow ?? '',
      title: content?.development?.title ?? '',
      body: content?.development?.body ?? '',
      imageUrl: content?.development?.imageUrl ?? '',
      cta: normalizeCta(content?.development?.cta),
      pillars: (content?.development?.pillars ?? []).map((item) => normalizePillar(item)),
    },
    playerProfile: {
      eyebrow: content?.playerProfile?.eyebrow ?? '',
      title: content?.playerProfile?.title ?? '',
      body: content?.playerProfile?.body ?? '',
      imageUrl: content?.playerProfile?.imageUrl ?? '',
      cta: normalizeCta(content?.playerProfile?.cta),
      stats: (content?.playerProfile?.stats ?? []).map((item) => normalizeStat(item)),
    },
    trainingDay: {
      eyebrow: content?.trainingDay?.eyebrow ?? '',
      title: content?.trainingDay?.title ?? '',
      body: content?.trainingDay?.body ?? '',
      imageUrl: content?.trainingDay?.imageUrl ?? '',
      cta: normalizeCta(content?.trainingDay?.cta),
      schedule: (content?.trainingDay?.schedule ?? []).map((item) => normalizeSchedule(item)),
    },
  };
}

export function normalizeNewsForm(item?: Partial<NewsItem> | null): NewsForm {
  return {
    title: item?.title ?? '',
    slug: item?.slug ?? '',
    excerpt: item?.excerpt ?? '',
    content: item?.content ?? '',
    coverUrl: item?.coverUrl ?? '',
    categoryLabel: item?.categoryLabel ?? '',
    tags: (item?.tags ?? []).join(', '),
    status: item?.status ?? 'draft',
  };
}

function optionalTrimmed(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function buildSettingsPayload(form: SiteSettings) {
  return {
    clubName: form.clubName.trim(),
    clubShortName: form.clubShortName.trim(),
    tagline: form.tagline.trim(),
    seasonLabel: form.seasonLabel.trim(),
    address: form.address.trim(),
    city: form.city.trim(),
    country: form.country.trim(),
    phonePrimary: form.phonePrimary.trim(),
    phoneSecondary: form.phoneSecondary.trim(),
    email: form.email.trim(),
    facebookUrl: form.facebookUrl.trim(),
    tiktokUrl: form.tiktokUrl.trim(),
    whatsappPhone: form.whatsappPhone.trim(),
    mapEmbedUrl: form.mapEmbedUrl.trim(),
  };
}

export function buildHomepagePayload(form: HomepageForm) {
  return {
    hero: {
      eyebrow: form.hero.eyebrow.trim(),
      titleMain: form.hero.titleMain.trim(),
      titleAccent: form.hero.titleAccent.trim(),
      subtitle: form.hero.subtitle.trim(),
      seasonLabel: form.hero.seasonLabel.trim(),
      backgroundImageUrl: form.hero.backgroundImageUrl.trim(),
      ctaPrimary: {
        label: form.hero.ctaPrimary.label.trim(),
        target: form.hero.ctaPrimary.target.trim(),
      },
      ctaSecondary: {
        label: form.hero.ctaSecondary.label.trim(),
        target: form.hero.ctaSecondary.target.trim(),
      },
    },
    center: {
      eyebrow: form.center.eyebrow.trim(),
      title: form.center.title.trim(),
      body: form.center.body.trim(),
      imageUrl: form.center.imageUrl.trim(),
      cta: {
        label: form.center.cta.label.trim(),
        target: form.center.cta.target.trim(),
      },
      stats: form.center.stats
        .map((item) => ({
          label: item.label.trim(),
          value: item.value.trim(),
          iconKey: item.iconKey.trim(),
          sortOrder: item.sortOrder,
        }))
        .filter((item) => item.label.length > 0 && item.value.length > 0),
    },
    development: {
      eyebrow: form.development.eyebrow.trim(),
      title: form.development.title.trim(),
      body: form.development.body.trim(),
      imageUrl: form.development.imageUrl.trim(),
      cta: {
        label: form.development.cta.label.trim(),
        target: form.development.cta.target.trim(),
      },
      pillars: form.development.pillars
        .map((item) => ({
          label: item.label.trim(),
          description: item.description.trim(),
          iconKey: item.iconKey.trim(),
          sortOrder: item.sortOrder,
        }))
        .filter((item) => item.label.length > 0 && item.description.length > 0),
    },
    playerProfile: {
      eyebrow: form.playerProfile.eyebrow.trim(),
      title: form.playerProfile.title.trim(),
      body: form.playerProfile.body.trim(),
      imageUrl: form.playerProfile.imageUrl.trim(),
      cta: {
        label: form.playerProfile.cta.label.trim(),
        target: form.playerProfile.cta.target.trim(),
      },
      stats: form.playerProfile.stats
        .map((item) => ({
          label: item.label.trim(),
          value: item.value.trim(),
          iconKey: item.iconKey.trim(),
          sortOrder: item.sortOrder,
        }))
        .filter((item) => item.label.length > 0 && item.value.length > 0),
    },
    trainingDay: {
      eyebrow: form.trainingDay.eyebrow.trim(),
      title: form.trainingDay.title.trim(),
      body: form.trainingDay.body.trim(),
      imageUrl: form.trainingDay.imageUrl.trim(),
      cta: {
        label: form.trainingDay.cta.label.trim(),
        target: form.trainingDay.cta.target.trim(),
      },
      schedule: form.trainingDay.schedule
        .map((item) => ({
          timeLabel: item.timeLabel.trim(),
          activity: item.activity.trim(),
          sortOrder: item.sortOrder,
        }))
        .filter((item) => item.timeLabel.length > 0 && item.activity.length > 0),
    },
  };
}

export function buildNewsPayload(form: NewsForm) {
  return {
    title: form.title.trim(),
    slug: form.slug.trim().toLowerCase(),
    excerpt: optionalTrimmed(form.excerpt),
    content: optionalTrimmed(form.content),
    coverUrl: optionalTrimmed(form.coverUrl),
    categoryLabel: optionalTrimmed(form.categoryLabel),
    tags: form.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
    status: form.status,
  };
}

export function formatDate(value?: string | null): string {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function matchesRegistrationSearch(item: Registration, query: string): boolean {
  const haystack = [
    item.childName,
    item.parentName,
    item.parentEmail,
    item.parentPhone,
    item.categoryCode,
    item.city ?? '',
    item.message ?? '',
    item.internalNotes ?? '',
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(query);
}

export function createWhatsAppLink(phone: string): string | null {
  const digits = phone.replace(/\D/g, '');
  if (!digits) {
    return null;
  }

  return `https://wa.me/${digits.startsWith('00') ? digits.slice(2) : digits}`;
}


