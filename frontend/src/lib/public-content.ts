export type PublicLegalLink = {
  label: string;
  url: string;
  sortOrder: number;
};

export type PublicSiteSettings = {
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
  legalLinks: PublicLegalLink[];
};

export type PublicCta = {
  label: string;
  target: string;
};

export type PublicStatItem = {
  label: string;
  value: string;
  iconKey: string;
  sortOrder: number;
};

export type PublicPillarItem = {
  label: string;
  description: string;
  iconKey: string;
  sortOrder: number;
};

export type PublicScheduleItem = {
  timeLabel: string;
  activity: string;
  sortOrder: number;
};

export type PublicHomepageContent = {
  hero: {
    eyebrow: string;
    titleMain: string;
    titleAccent: string;
    subtitle: string;
    seasonLabel: string;
    backgroundImageUrl: string;
    ctaPrimary: PublicCta;
    ctaSecondary: PublicCta;
  };
  center: {
    eyebrow: string;
    title: string;
    body: string;
    imageUrl: string;
    cta: PublicCta;
    stats: PublicStatItem[];
  };
  development: {
    eyebrow: string;
    title: string;
    body: string;
    imageUrl: string;
    cta: PublicCta;
    pillars: PublicPillarItem[];
  };
  playerProfile: {
    eyebrow: string;
    title: string;
    body: string;
    imageUrl: string;
    cta: PublicCta;
    stats: PublicStatItem[];
  };
  trainingDay: {
    eyebrow: string;
    title: string;
    body: string;
    imageUrl: string;
    cta: PublicCta;
    schedule: PublicScheduleItem[];
  };
};

export type PublicCategory = {
  _id?: string;
  code: string;
  title: string;
  ageLabel: string;
  description: string;
  themeKey: string;
  sortOrder: number;
};

export type PublicNewsItem = {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverUrl: string;
  categoryLabel: string;
  tags: string[];
  publishedAt: string | null;
};

export type PublicStaffMember = {
  _id?: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  sortOrder: number;
};

export type PublicGalleryItem = {
  _id?: string;
  title: string;
  imageUrl: string;
  galleryCategory: 'matchs' | 'entrainement' | 'evenements';
  displaySize: 'small' | 'medium' | 'large';
  sortOrder: number;
  isFeatured: boolean;
};

export type PublicPartner = {
  _id?: string;
  name: string;
  initials: string;
  logoUrl: string;
  websiteUrl: string;
  sortOrder: number;
};

export type PublicHomepageData = {
  settings: PublicSiteSettings;
  homepage: PublicHomepageContent;
  categories: PublicCategory[];
  latestNews: PublicNewsItem[];
  staff: PublicStaffMember[];
  gallery: PublicGalleryItem[];
  partners: PublicPartner[];
};

export type PublicHomepageResponse = {
  item?: Partial<PublicHomepageData> | null;
};

const defaultLegalLinks: PublicLegalLink[] = [
  { label: 'Mentions légales', url: './legal/mentions-legales.html', sortOrder: 0 },
  { label: 'Politique de confidentialité', url: './legal/politique-confidentialite.html', sortOrder: 1 },
  { label: 'Crédits', url: './legal/credits.html', sortOrder: 2 },
];

const defaultCta = (label = '', target = ''): PublicCta => ({ label, target });

export const defaultPublicHomepageData: PublicHomepageData = {
  settings: {
    clubName: 'Association Sportive Maxwell Fae',
    clubShortName: 'MF',
    tagline: 'Discipline. Honneur. Rigueur.',
    seasonLabel: 'SAISON 2025-2026',
    address: 'Abidjan, Yopougon Sideci Lem',
    city: 'Abidjan',
    country: "Côte d'Ivoire",
    phonePrimary: '+225 27 22 35 04 05',
    phoneSecondary: '+225 01 00 29 05 05',
    email: 'associaitionsportivemaxwellfae@gmail.com',
    facebookUrl: 'https://www.facebook.com/share/19Vx6r8C2h/',
    tiktokUrl: 'https://www.tiktok.com/@association.sportive.mf',
    whatsappPhone: '2250100290505',
    mapEmbedUrl:
      "https://www.google.com/maps?q=Yopougon%20Sideci%20Lem%2C%20Abidjan%2C%20C%C3%B4te%20d%27Ivoire&output=embed",
    legalLinks: defaultLegalLinks,
  },
  homepage: {
    hero: {
      eyebrow: 'Centre de Formation',
      titleMain: 'MAXWELL',
      titleAccent: 'FAE',
      subtitle: 'Discipline. Honneur. Rigueur. Une académie moderne pour les talents de demain.',
      seasonLabel: 'SAISON 2025-2026',
      backgroundImageUrl: '/images/hero-bg.jpg',
      ctaPrimary: defaultCta("Rejoindre l'académie", '#inscription'),
      ctaSecondary: defaultCta('Découvrir le centre', '#le-centre'),
    },
    center: {
      eyebrow: 'Le Centre',
      title: 'UN TERRAIN DE JEU PROFESSIONNEL',
      body:
        "Nos installations comprennent un terrain en herbe synthétique homologué, des vestiaires modernes et un espace d'analyse vidéo pour le suivi de chaque joueur.",
      imageUrl: '/images/centre-installations.jpg',
      cta: defaultCta('Voir les installations', '#galerie'),
      stats: [
        { label: 'Terrains', value: '3', iconKey: 'map-pin', sortOrder: 0 },
        { label: 'Joueurs', value: '200+', iconKey: 'users', sortOrder: 1 },
        { label: 'Coachs', value: '12', iconKey: 'trophy', sortOrder: 2 },
      ],
    },
    development: {
      eyebrow: 'Projet',
      title: 'DÉVELOPPEMENT',
      body:
        'Notre méthode allie technique, tactique et mental. Chaque joueur suit un plan individuel avec des objectifs clairs sur la saison.',
      imageUrl: '/images/projet-developpement.jpg',
      cta: defaultCta('Découvrir la méthode', '#competences'),
      pillars: [
        { label: 'Technique', description: 'Maîtrise du ballon', iconKey: 'zap', sortOrder: 0 },
        { label: 'Tactique', description: 'Intelligence de jeu', iconKey: 'target', sortOrder: 1 },
        { label: 'Mental', description: 'Force intérieure', iconKey: 'brain', sortOrder: 2 },
      ],
    },
    playerProfile: {
      eyebrow: 'Compétences',
      title: 'PROFIL DU MOIS',
      body: 'Milieu offensif complet, vision du jeu, passe en profondeur et finition calme.',
      imageUrl: '/images/profil-joueur.jpg',
      cta: defaultCta('Demander la fiche complète', '#contact'),
      stats: [
        { label: 'Vitesse', value: '86', iconKey: 'zap', sortOrder: 0 },
        { label: 'Passe', value: '91', iconKey: 'target', sortOrder: 1 },
        { label: 'Finition', value: '84', iconKey: 'activity', sortOrder: 2 },
      ],
    },
    trainingDay: {
      eyebrow: 'Immersion',
      title: "JOURNÉE D'ENTRAÎNEMENT",
      body: "Viens passer une journée avec nous : échauffement, séance technique, match en fin de matinée.",
      imageUrl: '/images/journee-entrainement.jpg',
      cta: defaultCta('Réserver ma place', '#contact'),
      schedule: [
        { timeLabel: '08:30', activity: 'Accueil', sortOrder: 0 },
        { timeLabel: '09:00', activity: 'Échauffement', sortOrder: 1 },
        { timeLabel: '10:00', activity: 'Travail technique', sortOrder: 2 },
        { timeLabel: '11:30', activity: 'Match', sortOrder: 3 },
      ],
    },
  },
  categories: [
    { code: 'U7', title: 'U7', ageLabel: '6-7 ans', description: 'Débuter avec le plaisir du jeu', themeKey: 'emerald', sortOrder: 0 },
    { code: 'U9', title: 'U9', ageLabel: '8-9 ans', description: 'Coordination et technique de base', themeKey: 'blue', sortOrder: 1 },
    { code: 'U12', title: 'U12', ageLabel: '10-12 ans', description: 'Tactique et collectif', themeKey: 'violet', sortOrder: 2 },
    { code: 'U15', title: 'U15', ageLabel: '13-15 ans', description: 'Performance et exigence', themeKey: 'amber', sortOrder: 3 },
    { code: 'U17', title: 'U17', ageLabel: '16-17 ans', description: 'Préparation haut niveau', themeKey: 'rose', sortOrder: 4 },
  ],
  latestNews: [
    {
      title: 'COUPE RÉGIONALE : LES U15 EN FINALE',
      slug: 'coupe-regionale-les-u15-en-finale',
      excerpt: "Les U15 disputeront la finale régionale ce samedi au stade municipal.",
      content:
        "Après une demi-finale maîtrisée, nos U15 affronteront l'Etoile Sportive ce samedi au stade municipal. Entrée gratuite pour les supporters.",
      coverUrl: '/images/actualites-match.jpg',
      categoryLabel: 'Competition',
      tags: ['u15', 'competition', 'finale'],
      publishedAt: '2026-01-24T09:00:00.000Z',
    },
  ],
  staff: [
    { name: 'Karim Bensaid', role: 'Directeur technique', bio: '', imageUrl: '/images/coach-1.jpg', sortOrder: 0 },
    { name: 'Léa Morel', role: 'Responsable U9-U12', bio: '', imageUrl: '/images/coach-2.jpg', sortOrder: 1 },
    { name: 'Samir Taleb', role: 'Préparateur physique', bio: '', imageUrl: '/images/coach-3.jpg', sortOrder: 2 },
    { name: 'Inès Durand', role: 'Analyste video', bio: '', imageUrl: '/images/coach-4.jpg', sortOrder: 3 },
    { name: 'Tom Girard', role: 'Responsable U15-U17', bio: '', imageUrl: '/images/coach-5.jpg', sortOrder: 4 },
    { name: 'Nina Okafor', role: 'Responsable médicale', bio: '', imageUrl: '/images/coach-6.jpg', sortOrder: 5 },
  ],
  gallery: [
    { title: 'Arrêt décisif', imageUrl: '/images/galerie-1.jpg', galleryCategory: 'matchs', displaySize: 'large', sortOrder: 0, isFeatured: true },
    { title: 'Célébration', imageUrl: '/images/galerie-2.jpg', galleryCategory: 'evenements', displaySize: 'medium', sortOrder: 1, isFeatured: false },
    { title: 'Séance technique', imageUrl: '/images/galerie-3.jpg', galleryCategory: 'entrainement', displaySize: 'small', sortOrder: 2, isFeatured: false },
    { title: 'Tir au but', imageUrl: '/images/galerie-4.jpg', galleryCategory: 'matchs', displaySize: 'medium', sortOrder: 3, isFeatured: false },
    { title: 'Remise des trophées', imageUrl: '/images/galerie-5.jpg', galleryCategory: 'evenements', displaySize: 'large', sortOrder: 4, isFeatured: true },
    { title: 'Échauffement', imageUrl: '/images/galerie-6.jpg', galleryCategory: 'entrainement', displaySize: 'small', sortOrder: 5, isFeatured: false },
  ],
  partners: [
    { name: 'Nike', initials: 'NK', logoUrl: '', websiteUrl: '', sortOrder: 0 },
    { name: 'Adidas', initials: 'AD', logoUrl: '', websiteUrl: '', sortOrder: 1 },
    { name: 'Puma', initials: 'PM', logoUrl: '', websiteUrl: '', sortOrder: 2 },
    { name: 'Decathlon', initials: 'DC', logoUrl: '', websiteUrl: '', sortOrder: 3 },
    { name: 'Orange', initials: 'OR', logoUrl: '', websiteUrl: '', sortOrder: 4 },
    { name: 'Canal+', initials: 'C+', logoUrl: '', websiteUrl: '', sortOrder: 5 },
    { name: 'Total', initials: 'TT', logoUrl: '', websiteUrl: '', sortOrder: 6 },
    { name: 'Société Générale', initials: 'SG', logoUrl: '', websiteUrl: '', sortOrder: 7 },
  ],
};

function normalizeCta(cta?: Partial<PublicCta> | null, fallback?: PublicCta): PublicCta {
  return {
    label: cta?.label ?? fallback?.label ?? '',
    target: cta?.target ?? fallback?.target ?? '',
  };
}

function normalizeLegalLinks(links?: PublicLegalLink[] | null): PublicLegalLink[] {
  return (links ?? defaultPublicHomepageData.settings.legalLinks).map((link, index) => ({
    label: link.label ?? defaultLegalLinks[index]?.label ?? '',
    url: link.url ?? defaultLegalLinks[index]?.url ?? '',
    sortOrder: typeof link.sortOrder === 'number' ? link.sortOrder : index,
  }));
}

export function normalizePublicHomepageData(raw?: Partial<PublicHomepageData> | null): PublicHomepageData {
  const homepage: Partial<PublicHomepageContent> = raw?.homepage ?? {};
  const hero: Partial<PublicHomepageContent['hero']> = homepage.hero ?? {};
  const center: Partial<PublicHomepageContent['center']> = homepage.center ?? {};
  const development: Partial<PublicHomepageContent['development']> = homepage.development ?? {};
  const playerProfile: Partial<PublicHomepageContent['playerProfile']> = homepage.playerProfile ?? {};
  const trainingDay: Partial<PublicHomepageContent['trainingDay']> = homepage.trainingDay ?? {};

  return {
    settings: {
      ...defaultPublicHomepageData.settings,
      ...(raw?.settings ?? {}),
      legalLinks: normalizeLegalLinks(raw?.settings?.legalLinks),
    },
    homepage: {
      hero: {
        ...defaultPublicHomepageData.homepage.hero,
        ...hero,
        ctaPrimary: normalizeCta(hero.ctaPrimary, defaultPublicHomepageData.homepage.hero.ctaPrimary),
        ctaSecondary: normalizeCta(hero.ctaSecondary, defaultPublicHomepageData.homepage.hero.ctaSecondary),
      },
      center: {
        ...defaultPublicHomepageData.homepage.center,
        ...center,
        cta: normalizeCta(center.cta, defaultPublicHomepageData.homepage.center.cta),
        stats: (center.stats ?? defaultPublicHomepageData.homepage.center.stats).map((item: PublicStatItem, index: number) => ({
          ...defaultPublicHomepageData.homepage.center.stats[index % defaultPublicHomepageData.homepage.center.stats.length],
          ...item,
        })),
      },
      development: {
        ...defaultPublicHomepageData.homepage.development,
        ...development,
        cta: normalizeCta(development.cta, defaultPublicHomepageData.homepage.development.cta),
        pillars: (development.pillars ?? defaultPublicHomepageData.homepage.development.pillars).map((item: PublicPillarItem, index: number) => ({
          ...defaultPublicHomepageData.homepage.development.pillars[index % defaultPublicHomepageData.homepage.development.pillars.length],
          ...item,
        })),
      },
      playerProfile: {
        ...defaultPublicHomepageData.homepage.playerProfile,
        ...playerProfile,
        cta: normalizeCta(playerProfile.cta, defaultPublicHomepageData.homepage.playerProfile.cta),
        stats: (playerProfile.stats ?? defaultPublicHomepageData.homepage.playerProfile.stats).map((item: PublicStatItem, index: number) => ({
          ...defaultPublicHomepageData.homepage.playerProfile.stats[index % defaultPublicHomepageData.homepage.playerProfile.stats.length],
          ...item,
        })),
      },
      trainingDay: {
        ...defaultPublicHomepageData.homepage.trainingDay,
        ...trainingDay,
        cta: normalizeCta(trainingDay.cta, defaultPublicHomepageData.homepage.trainingDay.cta),
        schedule: (trainingDay.schedule ?? defaultPublicHomepageData.homepage.trainingDay.schedule).map((item: PublicScheduleItem, index: number) => ({
          ...defaultPublicHomepageData.homepage.trainingDay.schedule[index % defaultPublicHomepageData.homepage.trainingDay.schedule.length],
          ...item,
        })),
      },
    },
    categories: (raw?.categories ?? defaultPublicHomepageData.categories).map((item, index) => ({
      ...defaultPublicHomepageData.categories[index % defaultPublicHomepageData.categories.length],
      ...item,
    })),
    latestNews: (raw?.latestNews ?? defaultPublicHomepageData.latestNews).map((item, index) => ({
      ...defaultPublicHomepageData.latestNews[index % defaultPublicHomepageData.latestNews.length],
      ...item,
      tags: item.tags ?? defaultPublicHomepageData.latestNews[index % defaultPublicHomepageData.latestNews.length].tags,
      publishedAt: item.publishedAt ?? defaultPublicHomepageData.latestNews[index % defaultPublicHomepageData.latestNews.length].publishedAt,
    })),
    staff: (raw?.staff ?? defaultPublicHomepageData.staff).map((item, index) => ({
      ...defaultPublicHomepageData.staff[index % defaultPublicHomepageData.staff.length],
      ...item,
    })),
    gallery: (raw?.gallery ?? defaultPublicHomepageData.gallery).map((item, index) => ({
      ...defaultPublicHomepageData.gallery[index % defaultPublicHomepageData.gallery.length],
      ...item,
    })),
    partners: (raw?.partners ?? defaultPublicHomepageData.partners).map((item, index) => ({
      ...defaultPublicHomepageData.partners[index % defaultPublicHomepageData.partners.length],
      ...item,
    })),
  };
}


