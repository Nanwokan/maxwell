export type AdminRole = 'super_admin' | 'admin' | 'editor';

export type SectionKey =
  | 'overview'
  | 'settings'
  | 'homepage'
  | 'news'
  | 'inbox'
  | 'messages'
  | 'registrations';

export type EntityWithId = {
  _id?: unknown;
  id?: unknown;
};

export type AdminUser = EntityWithId & {
  email: string;
  role: AdminRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string | null;
};

export type AdminSession = {
  user: AdminUser;
  token?: string;
};

export type LoginResponse = {
  user: AdminUser;
  token?: string;
};

export type ForgotPasswordResponse = {
  ok: boolean;
  message: string;
  resetCode?: string;
};

export type VerifyResetCodeResponse = {
  ok: boolean;
  message: string;
  resetSessionToken: string;
};

export type ResetPasswordResponse = {
  ok: boolean;
  message: string;
};

export type ApiItemResponse<TItem> = {
  item: TItem | null;
};

export type ApiItemsResponse<TItem> = {
  items: TItem[];
};

export type SiteSettings = {
  clubName: string;
  clubShortName: string;
  tagline: string;
  seasonLabel: string;
  address: string;
  city: string;
  country: string;
  phonePrimary: string;
  phoneSecondary: string;
  email: string;
  facebookUrl: string;
  tiktokUrl: string;
  whatsappPhone: string;
  mapEmbedUrl: string;
};

export type CtaForm = {
  label: string;
  target: string;
};

export type StatItem = {
  label: string;
  value: string;
  iconKey: string;
  sortOrder: number;
};

export type PillarItem = {
  label: string;
  description: string;
  iconKey: string;
  sortOrder: number;
};

export type ScheduleItem = {
  timeLabel: string;
  activity: string;
  sortOrder: number;
};

export type HomepageForm = {
  hero: {
    eyebrow: string;
    titleMain: string;
    titleAccent: string;
    subtitle: string;
    seasonLabel: string;
    backgroundImageUrl: string;
    ctaPrimary: CtaForm;
    ctaSecondary: CtaForm;
  };
  center: {
    eyebrow: string;
    title: string;
    body: string;
    imageUrl: string;
    cta: CtaForm;
    stats: StatItem[];
  };
  development: {
    eyebrow: string;
    title: string;
    body: string;
    imageUrl: string;
    cta: CtaForm;
    pillars: PillarItem[];
  };
  playerProfile: {
    eyebrow: string;
    title: string;
    body: string;
    imageUrl: string;
    cta: CtaForm;
    stats: StatItem[];
  };
  trainingDay: {
    eyebrow: string;
    title: string;
    body: string;
    imageUrl: string;
    cta: CtaForm;
    schedule: ScheduleItem[];
  };
};

export type Category = EntityWithId & {
  code: string;
  title: string;
  ageLabel: string;
  description: string;
  isActive: boolean;
};

export type NewsItem = EntityWithId & {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  coverUrl?: string;
  categoryLabel?: string;
  tags?: string[];
  status: 'draft' | 'published';
  publishedAt?: string | null;
  createdAt?: string;
};

export type StaffMember = EntityWithId & {
  name: string;
  role: string;
  isActive: boolean;
};

export type GalleryItem = EntityWithId & {
  title: string;
  galleryCategory: 'matchs' | 'entrainement' | 'evenements';
  isActive: boolean;
};

export type Partner = EntityWithId & {
  name: string;
  isActive: boolean;
};

export type ContactMessage = EntityWithId & {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt?: string;
};

export type Registration = EntityWithId & {
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  childName: string;
  childAge: number;
  categoryCode: string;
  city?: string;
  message?: string;
  internalNotes?: string;
  status: 'new' | 'validated' | 'rejected' | 'archived';
  createdAt?: string;
};

export type RegistrationFilter = 'all' | Registration['status'];

export type NewsForm = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverUrl: string;
  categoryLabel: string;
  tags: string;
  status: 'draft' | 'published';
};
