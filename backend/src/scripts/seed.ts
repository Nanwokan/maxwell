import 'dotenv/config';

import { connectToDatabase, disconnectFromDatabase } from '../config/database';
import { hashPassword } from '../lib/password';
import { AdminUserModel } from '../models/AdminUser';
import { CategoryModel } from '../models/Category';
import { GalleryItemModel } from '../models/GalleryItem';
import { HomepageContentModel } from '../models/HomepageContent';
import { NewsPostModel } from '../models/NewsPost';
import { PartnerModel } from '../models/Partner';
import { SiteSettingsModel } from '../models/SiteSettings';
import { StaffMemberModel } from '../models/StaffMember';

const siteSettingsSeed = {
  singletonKey: 'main',
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
  legalLinks: [
    { label: 'Mentions légales', url: './legal/mentions-legales.html', sortOrder: 0 },
    { label: 'Politique de confidentialité', url: './legal/politique-confidentialite.html', sortOrder: 1 },
    { label: 'Crédits', url: './legal/credits.html', sortOrder: 2 },
  ],
};

const homepageContentSeed = {
  singletonKey: 'main',
  hero: {
    eyebrow: 'Centre de Formation',
    titleMain: 'MAXWELL',
    titleAccent: 'FAE',
    subtitle: 'Discipline. Honneur. Rigueur. Une académie moderne pour les talents de demain.',
    seasonLabel: 'SAISON 2025-2026',
    backgroundImageUrl: '/images/hero-bg.jpg',
    ctaPrimary: {
      label: "Rejoindre l'académie",
      target: '#inscription',
    },
    ctaSecondary: {
      label: 'Découvrir le centre',
      target: '#le-centre',
    },
  },
  center: {
    eyebrow: 'Le Centre',
    title: 'UN TERRAIN DE JEU PROFESSIONNEL',
    body:
      "Nos installations comprennent un terrain en herbe synthétique homologué, des vestiaires modernes et un espace d'analyse vidéo pour le suivi de chaque joueur.",
    imageUrl: '/images/centre-installations.jpg',
    cta: {
      label: 'Voir les installations',
      target: '#galerie',
    },
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
    cta: {
      label: 'Découvrir la méthode',
      target: '#competences',
    },
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
    cta: {
      label: 'Demander la fiche complète',
      target: '#contact',
    },
    stats: [
      { label: 'Vitesse', value: '86', iconKey: 'zap', sortOrder: 0 },
      { label: 'Passe', value: '91', iconKey: 'target', sortOrder: 1 },
      { label: 'Finition', value: '84', iconKey: 'activity', sortOrder: 2 },
    ],
  },
  trainingDay: {
    eyebrow: 'Immersion',
    title: "JOURNÉE D'ENTRAÎNEMENT",
    body: 'Viens passer une journée avec nous : échauffement, séance technique et match en fin de matinée.',
    imageUrl: '/images/journee-entrainement.jpg',
    cta: {
      label: 'Réserver ma place',
      target: '#contact',
    },
    schedule: [
      { timeLabel: '08:30', activity: 'Accueil', sortOrder: 0 },
      { timeLabel: '09:00', activity: 'Échauffement', sortOrder: 1 },
      { timeLabel: '10:00', activity: 'Travail technique', sortOrder: 2 },
      { timeLabel: '11:30', activity: 'Match', sortOrder: 3 },
    ],
  },
};

const categoriesSeed = [
  {
    code: 'U7',
    title: 'U7',
    ageLabel: '6-7 ans',
    description: 'Débuter avec le plaisir du jeu',
    themeKey: 'emerald',
    sortOrder: 0,
    isActive: true,
  },
  {
    code: 'U9',
    title: 'U9',
    ageLabel: '8-9 ans',
    description: 'Coordination et technique de base',
    themeKey: 'blue',
    sortOrder: 1,
    isActive: true,
  },
  {
    code: 'U12',
    title: 'U12',
    ageLabel: '10-12 ans',
    description: 'Tactique et collectif',
    themeKey: 'violet',
    sortOrder: 2,
    isActive: true,
  },
  {
    code: 'U15',
    title: 'U15',
    ageLabel: '13-15 ans',
    description: 'Performance et exigence',
    themeKey: 'amber',
    sortOrder: 3,
    isActive: true,
  },
  {
    code: 'U17',
    title: 'U17',
    ageLabel: '16-17 ans',
    description: 'Préparation haut niveau',
    themeKey: 'rose',
    sortOrder: 4,
    isActive: true,
  },
];

const newsSeed = [
  {
    title: 'COUPE RÉGIONALE : LES U15 EN FINALE',
    slug: 'coupe-regionale-les-u15-en-finale',
    excerpt: "Les U15 disputeront la finale régionale ce samedi au stade municipal.",
    content:
      "Après une demi-finale maîtrisée, nos U15 affronteront l'Étoile Sportive ce samedi au stade municipal. Entrée gratuite pour les supporters. Le staff invite les familles, partenaires et sympathisants à venir encourager les joueurs pour ce grand rendez-vous de la saison.",
    coverUrl: '/images/actualites-match.jpg',
    categoryLabel: 'Competition',
    tags: ['u15', 'competition', 'finale'],
    status: 'published',
    publishedAt: new Date('2026-01-24T09:00:00.000Z'),
  },
];

const staffSeed = [
  { name: 'Karim Bensaid', role: 'Directeur technique', imageUrl: '/images/coach-1.jpg', sortOrder: 0, isActive: true },
  { name: 'Léa Morel', role: 'Responsable U9-U12', imageUrl: '/images/coach-2.jpg', sortOrder: 1, isActive: true },
  { name: 'Samir Taleb', role: 'Préparateur physique', imageUrl: '/images/coach-3.jpg', sortOrder: 2, isActive: true },
  { name: 'Inès Durand', role: 'Analyste vidéo', imageUrl: '/images/coach-4.jpg', sortOrder: 3, isActive: true },
  { name: 'Tom Girard', role: 'Responsable U15-U17', imageUrl: '/images/coach-5.jpg', sortOrder: 4, isActive: true },
  { name: 'Nina Okafor', role: 'Responsable médicale', imageUrl: '/images/coach-6.jpg', sortOrder: 5, isActive: true },
];

const gallerySeed = [
  { title: 'Arrêt décisif', imageUrl: '/images/galerie-1.jpg', galleryCategory: 'matchs', displaySize: 'large', sortOrder: 0, isFeatured: true, isActive: true },
  { title: 'Célébration', imageUrl: '/images/galerie-2.jpg', galleryCategory: 'evenements', displaySize: 'medium', sortOrder: 1, isFeatured: false, isActive: true },
  { title: 'Séance technique', imageUrl: '/images/galerie-3.jpg', galleryCategory: 'entrainement', displaySize: 'small', sortOrder: 2, isFeatured: false, isActive: true },
  { title: 'Tir au but', imageUrl: '/images/galerie-4.jpg', galleryCategory: 'matchs', displaySize: 'medium', sortOrder: 3, isFeatured: false, isActive: true },
  { title: 'Remise des trophées', imageUrl: '/images/galerie-5.jpg', galleryCategory: 'evenements', displaySize: 'large', sortOrder: 4, isFeatured: true, isActive: true },
  { title: 'Échauffement', imageUrl: '/images/galerie-6.jpg', galleryCategory: 'entrainement', displaySize: 'small', sortOrder: 5, isFeatured: false, isActive: true },
];

const partnersSeed = [
  { name: 'Nike', initials: 'NK', sortOrder: 0, isActive: true },
  { name: 'Adidas', initials: 'AD', sortOrder: 1, isActive: true },
  { name: 'Puma', initials: 'PM', sortOrder: 2, isActive: true },
  { name: 'Decathlon', initials: 'DC', sortOrder: 3, isActive: true },
  { name: 'Orange', initials: 'OR', sortOrder: 4, isActive: true },
  { name: 'Canal+', initials: 'C+', sortOrder: 5, isActive: true },
  { name: 'Total', initials: 'TT', sortOrder: 6, isActive: true },
  { name: 'Société Générale', initials: 'SG', sortOrder: 7, isActive: true },
];

function assertDestructiveSeedAllowed(): void {
  const resetRequested = process.env.SEED_RESET_CONTENT === 'true';
  if (!resetRequested) {
    throw new Error(
      'This seed script resets collections. Set SEED_RESET_CONTENT=true to run it intentionally.'
    );
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const productionOverride = process.env.ALLOW_DESTRUCTIVE_SEED === 'true';
  if (isProduction && !productionOverride) {
    throw new Error(
      'Refusing destructive seed in production without ALLOW_DESTRUCTIVE_SEED=true.'
    );
  }
}

async function seedAdminUser(): Promise<void> {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD?.trim();

  if (!email || !password) {
    console.log('[seed] skipping admin user creation (missing SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD)');
    return;
  }

  if (password.length < 12) {
    throw new Error('SEED_ADMIN_PASSWORD must be at least 12 characters long');
  }

  const passwordHash = await hashPassword(password);
  const existing = await AdminUserModel.findOne({ email });

  if (existing) {
    existing.passwordHash = passwordHash;
    existing.role = 'super_admin';
    existing.isActive = true;
    await existing.save();
    console.log(`[seed] updated admin user ${email}`);
    return;
  }

  await AdminUserModel.create({
    email,
    passwordHash,
    role: 'super_admin',
    isActive: true,
  });

  console.log(`[seed] created admin user ${email}`);
}

async function seedContent(): Promise<void> {
  assertDestructiveSeedAllowed();

  await SiteSettingsModel.findOneAndUpdate(
    { singletonKey: 'main' },
    siteSettingsSeed,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await HomepageContentModel.findOneAndUpdate(
    { singletonKey: 'main' },
    homepageContentSeed,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await CategoryModel.deleteMany({});
  await CategoryModel.insertMany(categoriesSeed);

  await NewsPostModel.deleteMany({});
  await NewsPostModel.insertMany(newsSeed);

  await StaffMemberModel.deleteMany({});
  await StaffMemberModel.insertMany(staffSeed);

  await GalleryItemModel.deleteMany({});
  await GalleryItemModel.insertMany(gallerySeed);

  await PartnerModel.deleteMany({});
  await PartnerModel.insertMany(partnersSeed);

  console.log('[seed] content seeded successfully');
}

async function main(): Promise<void> {
  await connectToDatabase();
  await seedAdminUser();
  await seedContent();
}

void main()
  .then(async () => {
    await disconnectFromDatabase();
    console.log('[seed] done');
  })
  .catch(async (error) => {
    console.error('[seed] failed', error);
    await disconnectFromDatabase();
    process.exit(1);
  });

