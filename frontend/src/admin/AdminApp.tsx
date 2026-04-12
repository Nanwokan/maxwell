import {
  startTransition,
  useDeferredValue,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  ArrowLeft,
  Bell,
  ClipboardList,
  Eye,
  EyeOff,
  Globe,
  Images,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Mail,
  Newspaper,
  RefreshCcw,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { toast, Toaster } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  buildHomepagePayload,
  buildNewsPayload,
  buildSettingsPayload,
  contactStatusLabels,
  contactStatuses,
  createEmptyNewsForm,
  createWhatsAppLink,
  extractId,
  formatDate,
  matchesRegistrationSearch,
  normalizeHomepage,
  normalizeNewsForm,
  normalizeSettings,
  persistSession,
  registrationStatusLabels,
  registrationStatuses,
  safeSessionRead,
  sectionLabels,
  selectClassName,
} from '@/admin/admin.helpers';
import type {
  AdminSession,
  AdminUser,
  ApiItemResponse,
  ApiItemsResponse,
  Category,
  ContactMessage,
  GalleryItem,
  HomepageForm,
  ForgotPasswordResponse,
  LoginResponse,
  NewsForm,
  NewsItem,
  Partner,
  Registration,
  RegistrationFilter,
  ResetPasswordResponse,
  VerifyResetCodeResponse,
  SectionKey,
  SiteSettings,
  StaffMember,
} from '@/admin/admin.types';
import {
  FeatureTile,
  LabeledField,
  LoadingState,
} from '@/admin/admin-ui';
import { HomepageSection } from '@/admin/sections/HomepageSection';
import { InboxSection } from '@/admin/sections/InboxSection';
import { MessagesSection } from '@/admin/sections/MessagesSection';
import { NewsSection } from '@/admin/sections/NewsSection';
import { OverviewSection } from '@/admin/sections/OverviewSection';
import { RegistrationsSection } from '@/admin/sections/RegistrationsSection';
import { SettingsSection } from '@/admin/sections/SettingsSection';
import { navigateToPublicRoute } from '../lib/app-route';
import {
  ApiError,
  deleteJson,
  getJson,
  patchJson,
  postJson,
  API_BASE_URL,
  setApiAuthToken,
} from '../lib/api';

const sidebarSections: Array<{ key: SectionKey; label: string; icon: typeof LayoutDashboard }> = [
  { key: 'overview', label: 'Tableau de bord', icon: LayoutDashboard },
  { key: 'settings', label: 'Paramètres du site', icon: Settings },
  { key: 'homepage', label: "Page d'accueil", icon: Globe },
  { key: 'news', label: 'Actualités', icon: Newspaper },
  { key: 'inbox', label: 'Boîte de réception', icon: Bell },
  { key: 'messages', label: 'Messages', icon: Mail },
  { key: 'registrations', label: 'Inscriptions', icon: ClipboardList },
];

type PaginatedApiItemsResponse<TItem> = ApiItemsResponse<TItem> & {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type HandleApiErrorOptions = {
  treat401AsSessionExpired?: boolean;
};

export default function AdminApp() {
  const initialSession = safeSessionRead();
  const [session, setSession] = useState<AdminSession | null>(initialSession);
  const [activeSection, setActiveSection] = useState<SectionKey>('overview');
  const [isAuthenticating, setIsAuthenticating] = useState(Boolean(initialSession));
  const [isLoadingData, setIsLoadingData] = useState(Boolean(initialSession));
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [isLoginPasswordVisible, setIsLoginPasswordVisible] = useState(false);
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<'request' | 'verify' | 'reset'>(
    'request'
  );
  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [resetSessionToken, setResetSessionToken] = useState<string | null>(null);
  const [isResetPasswordVisible, setIsResetPasswordVisible] = useState(false);
  const [isSubmittingForgotPassword, setIsSubmittingForgotPassword] = useState(false);
  const [isSubmittingCodeVerification, setIsSubmittingCodeVerification] = useState(false);
  const [isSubmittingResetPassword, setIsSubmittingResetPassword] = useState(false);
  const [developmentResetCode, setDevelopmentResetCode] = useState<string | null>(null);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isSavingHomepage, setIsSavingHomepage] = useState(false);
  const [isSavingNews, setIsSavingNews] = useState(false);
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(() => normalizeSettings());
  const [homepageForm, setHomepageForm] = useState<HomepageForm>(() => normalizeHomepage());
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [staffItems, setStaffItems] = useState<StaffMember[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [editingNewsId, setEditingNewsId] = useState<string | 'new' | null>(null);
  const [newsForm, setNewsForm] = useState<NewsForm>(() => createEmptyNewsForm());
  const [registrationFilter, setRegistrationFilter] = useState<RegistrationFilter>('all');
  const [registrationSearch, setRegistrationSearch] = useState('');
  const deferredRegistrationSearch = useDeferredValue(registrationSearch.trim().toLowerCase());
  const [selectedRegistrationId, setSelectedRegistrationId] = useState<string | null>(null);
  const [registrationNotesDraft, setRegistrationNotesDraft] = useState('');
  const [isSavingRegistrationNotes, setIsSavingRegistrationNotes] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const hasSession = session !== null;

  const handleUnauthorized = useCallback(() => {
    persistSession(null);
    setSession(null);
    setIsAuthenticating(false);
    setIsLoadingData(false);
    toast.error('Votre session admin a expiré. Connectez-vous à nouveau.');
  }, []);

  const handleApiError = useCallback(
    (
      error: unknown,
      fallbackMessage: string,
      { treat401AsSessionExpired = true }: HandleApiErrorOptions = {}
    ) => {
      if (treat401AsSessionExpired && error instanceof ApiError && error.status === 401) {
        handleUnauthorized();
        return;
      }

      const message = error instanceof Error ? error.message : fallbackMessage;
      toast.error(message);
    },
    [handleUnauthorized]
  );

  useEffect(() => {
    setApiAuthToken(session?.token ?? null);
  }, [session?.token]);

  const loadAdminData = useCallback(
    async () => {
      setIsLoadingData(true);

      try {
        const fetchAllAdminItems = async <TItem,>(path: string): Promise<TItem[]> => {
          const pageSize = 100;
          let page = 1;
          const items: TItem[] = [];

          while (true) {
            const response = await getJson<PaginatedApiItemsResponse<TItem>>(
              `${path}?page=${page}&limit=${pageSize}`
            );
            items.push(...response.items);

            const totalPages = response.pagination?.totalPages ?? 1;
            if (page >= totalPages || page >= 50) {
              break;
            }

            page += 1;
          }

          return items;
        };

        const [
          meResponse,
          siteResponse,
          homepageResponse,
          newsResponse,
          categoriesResponse,
          staffResponse,
          galleryResponse,
          partnersResponse,
          contactResponse,
          registrationsResponse,
        ] = await Promise.all([
          getJson<{ user: AdminUser }>('/api/admin/me'),
          getJson<ApiItemResponse<SiteSettings>>('/api/admin/site-settings'),
          getJson<ApiItemResponse<HomepageForm>>('/api/admin/homepage'),
          getJson<ApiItemsResponse<NewsItem>>('/api/admin/news'),
          getJson<ApiItemsResponse<Category>>('/api/admin/categories'),
          getJson<ApiItemsResponse<StaffMember>>('/api/admin/staff'),
          getJson<ApiItemsResponse<GalleryItem>>('/api/admin/gallery'),
          getJson<ApiItemsResponse<Partner>>('/api/admin/partners'),
          fetchAllAdminItems<ContactMessage>('/api/admin/contact-messages'),
          fetchAllAdminItems<Registration>('/api/admin/registrations'),
        ]);

        setSession((currentSession) => {
          if (!currentSession) {
            return null;
          }

          const updatedSession = {
            ...currentSession,
            user: meResponse.user,
          };

          persistSession(updatedSession);
          return updatedSession;
        });
        setSettingsForm(normalizeSettings(siteResponse.item));
        setHomepageForm(normalizeHomepage(homepageResponse.item));
        setNewsItems(newsResponse.items);
        setCategories(categoriesResponse.items);
        setStaffItems(staffResponse.items);
        setGalleryItems(galleryResponse.items);
        setPartners(partnersResponse.items);
        setContactMessages(contactResponse);
        setRegistrations(registrationsResponse);
      } catch (error) {
        handleApiError(error, 'Impossible de charger les donnees admin.');
      } finally {
        setIsAuthenticating(false);
        setIsLoadingData(false);
      }
    },
    [handleApiError]
  );

  useEffect(() => {
    if (!hasSession) {
      setIsAuthenticating(false);
      setIsLoadingData(false);
      return;
    }

    void loadAdminData();
  }, [hasSession, loadAdminData]);

  const registrationSummary = useMemo(
    () => ({
      all: registrations.length,
      new: registrations.filter((item) => item.status === 'new').length,
      validated: registrations.filter((item) => item.status === 'validated').length,
      rejected: registrations.filter((item) => item.status === 'rejected').length,
      archived: registrations.filter((item) => item.status === 'archived').length,
    }),
    [registrations]
  );

  const contactSummary = useMemo(
    () => ({
      all: contactMessages.length,
      new: contactMessages.filter((item) => item.status === 'new').length,
      read: contactMessages.filter((item) => item.status === 'read').length,
      replied: contactMessages.filter((item) => item.status === 'replied').length,
      archived: contactMessages.filter((item) => item.status === 'archived').length,
    }),
    [contactMessages]
  );

  const pendingContactMessages = useMemo(
    () => contactMessages.filter((item) => item.status === 'new').slice(0, 4),
    [contactMessages]
  );

  const pendingRegistrations = useMemo(
    () => registrations.filter((item) => item.status === 'new').slice(0, 4),
    [registrations]
  );

  const filteredRegistrations = useMemo(
    () =>
      registrations.filter((item) => {
        const matchesStatus = registrationFilter === 'all' || item.status === registrationFilter;
        const matchesSearch =
          deferredRegistrationSearch.length === 0 ||
          matchesRegistrationSearch(item, deferredRegistrationSearch);

        return matchesStatus && matchesSearch;
      }),
    [deferredRegistrationSearch, registrationFilter, registrations]
  );

  useEffect(() => {
    if (filteredRegistrations.length === 0) {
      if (selectedRegistrationId !== null) {
        setSelectedRegistrationId(null);
      }

      return;
    }

    const hasSelectedRegistration = filteredRegistrations.some(
      (item) => extractId(item) === selectedRegistrationId
    );

    if (!hasSelectedRegistration) {
      setSelectedRegistrationId(extractId(filteredRegistrations[0]));
    }
  }, [filteredRegistrations, selectedRegistrationId]);

  const selectedRegistration = useMemo(
    () => filteredRegistrations.find((item) => extractId(item) === selectedRegistrationId) ?? null,
    [filteredRegistrations, selectedRegistrationId]
  );

  useEffect(() => {
    setRegistrationNotesDraft(selectedRegistration?.internalNotes ?? '');
  }, [selectedRegistration?.internalNotes, selectedRegistrationId]);

  const hasRegistrationNotesChanges =
    (selectedRegistration?.internalNotes ?? '') !== registrationNotesDraft.trim();

  const metrics = useMemo(
    () => [
      {
        label: 'Actualités',
        value: newsItems.length,
        detail: `${newsItems.filter((item) => item.status === 'published').length} publiées`,
        icon: Newspaper,
      },
      {
        label: 'Messages',
        value: contactMessages.length,
        detail: `${contactMessages.filter((item) => item.status === 'new').length} nouveaux`,
        icon: Mail,
      },
      {
        label: 'Inscriptions',
        value: registrations.length,
        detail: `${registrations.filter((item) => item.status === 'new').length} à traiter`,
        icon: ClipboardList,
      },
      {
        label: 'Médias galerie',
        value: galleryItems.length,
        detail: `${galleryItems.filter((item) => item.isActive).length} actifs`,
        icon: Images,
      },
    ],
    [contactMessages, galleryItems, newsItems, registrations]
  );

  async function handleLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmittingLogin(true);

    try {
      const response = await postJson<LoginResponse>('/api/admin/auth/login', {
        email: loginForm.email.trim(),
        password: loginForm.password,
      });

      const nextSession = {
        user: response.user,
        token: response.token,
      };

      persistSession(nextSession);
      setSession(nextSession);
      setActiveSection('overview');
      setLoginForm({ email: '', password: '' });
      setIsLoginPasswordVisible(false);
      toast.success('Connexion admin réussie.');
    } catch (error) {
      handleApiError(error, 'Connexion admin impossible.', {
        treat401AsSessionExpired: false,
      });
    } finally {
      setIsSubmittingLogin(false);
    }
  }

  async function handleForgotPasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmittingForgotPassword(true);

    try {
      const response = await postJson<ForgotPasswordResponse>('/api/admin/auth/forgot-password', {
        email: forgotPasswordForm.email.trim(),
      });

      setForgotPasswordStep('verify');
      setResetSessionToken(null);
      setDevelopmentResetCode(response.resetCode ?? null);
      if (response.resetCode) {
        setForgotPasswordForm((current) => ({ ...current, code: response.resetCode ?? '' }));
      }

      toast.success(response.message);
    } catch (error) {
      handleApiError(error, "Impossible d'initier la réinitialisation du mot de passe.", {
        treat401AsSessionExpired: false,
      });
    } finally {
      setIsSubmittingForgotPassword(false);
    }
  }

  async function handleVerifyResetCodeSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmittingCodeVerification(true);

    try {
      const response = await postJson<VerifyResetCodeResponse>('/api/admin/auth/verify-reset-code', {
        email: forgotPasswordForm.email.trim(),
        code: forgotPasswordForm.code.trim(),
      });

      setResetSessionToken(response.resetSessionToken);
      setForgotPasswordStep('reset');
      setDevelopmentResetCode(null);
      toast.success(response.message);
    } catch (error) {
      handleApiError(error, 'Impossible de vérifier le code.', {
        treat401AsSessionExpired: false,
      });
    } finally {
      setIsSubmittingCodeVerification(false);
    }
  }

  async function handleResetPasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!resetSessionToken) {
      toast.error('Vérifiez le code avant de définir un nouveau mot de passe.');
      return;
    }

    if (forgotPasswordForm.newPassword !== forgotPasswordForm.confirmPassword) {
      toast.error('La confirmation du mot de passe ne correspond pas.');
      return;
    }

    setIsSubmittingResetPassword(true);

    try {
      const response = await postJson<ResetPasswordResponse>('/api/admin/auth/reset-password', {
        resetSessionToken,
        password: forgotPasswordForm.newPassword,
      });

      setLoginForm({ email: forgotPasswordForm.email.trim(), password: '' });
      setForgotPasswordForm((current) => ({
        ...current,
        code: '',
        newPassword: '',
        confirmPassword: '',
      }));
      setResetSessionToken(null);
      setDevelopmentResetCode(null);
      setForgotPasswordStep('request');
      setIsResetPasswordVisible(false);
      setIsForgotPasswordMode(false);
      toast.success(response.message);
    } catch (error) {
      handleApiError(error, 'Impossible de réinitialiser le mot de passe.', {
        treat401AsSessionExpired: false,
      });
    } finally {
      setIsSubmittingResetPassword(false);
    }
  }

  async function refreshData() {
    if (!session) {
      return;
    }

    await loadAdminData();
    toast.success('Données admin rechargées.');
  }

  async function handleLogout() {
    try {
      await postJson('/api/admin/auth/logout', {});
    } catch {
      // Best effort: local cleanup still guarantees UI logout.
    }

    persistSession(null);
    setSession(null);
    setActiveSection('overview');
    setEditingNewsId(null);
    setNewsForm(createEmptyNewsForm());
    toast.success('Session admin déconnectée.');
  }

  function handleReturnToSite() {
    navigateToPublicRoute();
  }

  function handleSectionSelect(nextSection: SectionKey) {
    startTransition(() => setActiveSection(nextSection));
    setIsMobileSidebarOpen(false);
  }

  async function saveSettings() {
    if (!session) {
      return;
    }

    setIsSavingSettings(true);

    try {
      const response = await patchJson<ApiItemResponse<SiteSettings>>(
        '/api/admin/site-settings',
        buildSettingsPayload(settingsForm)
      );

      setSettingsForm(normalizeSettings(response.item));
      toast.success('Paramètres du site enregistrés.');
    } catch (error) {
      handleApiError(error, "Impossible d'enregistrer les paramètres du site.");
    } finally {
      setIsSavingSettings(false);
    }
  }

  async function saveHomepage() {
    if (!session) {
      return;
    }

    setIsSavingHomepage(true);

    try {
      const response = await patchJson<ApiItemResponse<HomepageForm>>(
        '/api/admin/homepage',
        buildHomepagePayload(homepageForm)
      );

      setHomepageForm(normalizeHomepage(response.item));
      toast.success("Contenu de la page d'accueil mis à jour.");
    } catch (error) {
      handleApiError(error, "Impossible d'enregistrer la page d'accueil.");
    } finally {
      setIsSavingHomepage(false);
    }
  }

  function startCreatingNews() {
    setEditingNewsId('new');
    setNewsForm(createEmptyNewsForm());
  }

  function startEditingNews(item: NewsItem) {
    setEditingNewsId(extractId(item));
    setNewsForm(normalizeNewsForm(item));
  }

  async function saveNews() {
    if (!session) {
      return;
    }

    setIsSavingNews(true);

    try {
      const payload = buildNewsPayload(newsForm);

      if (editingNewsId === 'new') {
        const response = await postJson<{ item: NewsItem }>('/api/admin/news', payload);

        setNewsItems((currentItems) => [response.item, ...currentItems]);
        setEditingNewsId(extractId(response.item));
        toast.success('Actualité créée.');
        return;
      }

      if (!editingNewsId) {
        toast.error('Choisissez ou créez une actualité à modifier.');
        return;
      }

      const response = await patchJson<{ item: NewsItem }>(
        `/api/admin/news/${editingNewsId}`,
        payload
      );

      setNewsItems((currentItems) =>
        currentItems.map((item) => (extractId(item) === editingNewsId ? response.item : item))
      );
      toast.success('Actualité mise à jour.');
    } catch (error) {
      handleApiError(error, "Impossible d'enregistrer l'actualité.");
    } finally {
      setIsSavingNews(false);
    }
  }

  async function deleteNewsItem(newsId: string) {
    if (!session) {
      return;
    }

    if (!window.confirm('Supprimer cette actualité ?')) {
      return;
    }

    try {
      await deleteJson<{ ok: true }>(`/api/admin/news/${newsId}`);
      setNewsItems((currentItems) => currentItems.filter((item) => extractId(item) !== newsId));

      if (editingNewsId === newsId) {
        setEditingNewsId(null);
        setNewsForm(createEmptyNewsForm());
      }

      toast.success('Actualité supprimée.');
    } catch (error) {
      handleApiError(error, "Impossible de supprimer l'actualité.");
    }
  }

  async function updateContactStatus(messageId: string, status: ContactMessage['status']) {
    if (!session) {
      return;
    }

    try {
      const response = await patchJson<{ item: ContactMessage }>(
        `/api/admin/contact-messages/${messageId}`,
        { status }
      );

      setContactMessages((currentItems) =>
        currentItems.map((item) => (extractId(item) === messageId ? response.item : item))
      );
      toast.success('Statut du message mis a jour.');
    } catch (error) {
      handleApiError(error, 'Impossible de mettre a jour le message.');
    }
  }

  async function updateRegistrationStatus(registrationId: string, status: Registration['status']) {
    if (!session) {
      return;
    }

    try {
      const response = await patchJson<{ item: Registration }>(
        `/api/admin/registrations/${registrationId}`,
        { status }
      );

      setRegistrations((currentItems) =>
        currentItems.map((item) => (extractId(item) === registrationId ? response.item : item))
      );
      toast.success('Statut de l inscription mis a jour.');
    } catch (error) {
      handleApiError(error, 'Impossible de mettre a jour l inscription.');
    }
  }

  async function saveRegistrationNotes() {
    if (!session || !selectedRegistrationId) {
      return;
    }

    setIsSavingRegistrationNotes(true);

    try {
      const response = await patchJson<{ item: Registration }>(
        `/api/admin/registrations/${selectedRegistrationId}`,
        { internalNotes: registrationNotesDraft.trim() }
      );

      setRegistrations((currentItems) =>
        currentItems.map((item) =>
          extractId(item) === selectedRegistrationId ? response.item : item
        )
      );
      toast.success('Notes internes enregistrees.');
    } catch (error) {
      handleApiError(error, 'Impossible denregistrer les notes internes.');
    } finally {
      setIsSavingRegistrationNotes(false);
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#071018] text-white">
        <div className="relative isolate overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,138,31,0.2),transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(45,78,255,0.2),transparent_40%)]" />
          <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-10 px-6 py-12 lg:flex-row md:items-center lg:px-10">
            <div className="max-w-xl space-y-6 hidden md:block">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-2xl border-white/10 bg-transparent text-white hover:bg-white/5"
                onClick={handleReturnToSite}
              >
                <ArrowLeft className="h-4 w-4" />
                Retour au site
              </Button>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FF8A1F]/25 bg-[#FF8A1F]/10 px-4 py-2 text-sm text-[#FF8A1F] ml-4">
                <ShieldCheck className="h-4 w-4" />
                Maxwell Back-Office
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                  Administre le site, le contenu et la boîte de réception depuis un seul cockpit.
                </h1>
                <p className="max-w-lg text-base leading-7 text-[#A9B3C2]">
                  La connexion admin a été validée côté backend. Cette première interface vous
                  permet déjà de modifier les paramètres du site, la page d'accueil, les actualités
                  et le traitement des messages.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <FeatureTile
                  icon={Globe}
                  title="Contenu"
                  description="Page d'accueil et réglages publics."
                />
                <FeatureTile
                  icon={Newspaper}
                  title="Éditorial"
                  description="Création et mise à jour des actus."
                />
                <FeatureTile
                  icon={Bell}
                  title="Boîte de réception"
                  description="Suivi des messages et inscriptions."
                />
              </div>
            </div>
            <Button
                type="button"
                variant="outline"
                className="h-11 rounded-2xl md:hidden border-white/10 bg-transparent text-white hover:bg-white/5"
                onClick={handleReturnToSite}
              >
                <ArrowLeft className="h-4 w-4" />
                Retour au site
            </Button>
            <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#101928]/85 p-8 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur">
              <div className="mb-8 space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#FF8A1F]">
                  Connexion admin
                </p>
                <h2 className="text-2xl font-bold text-white">Accès sécurisé</h2>
                <p className="text-sm text-[#8A95A8]">
                  Point d'accès API actif sur <span className="font-mono text-[#FF8A1F]">{API_BASE_URL}</span>
                </p>
              </div>

              {isForgotPasswordMode ? (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-white/10 bg-[#111b29] p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-[#FF8A1F]">
                      Réinitialisation en 3 étapes
                    </p>
                    <p className="mt-2 text-xs text-[#8A95A8]">
                      1. Email admin 2. Vérification du code 3. Nouveau mot de passe
                    </p>
                  </div>

                  {forgotPasswordStep === 'request' ? (
                    <form className="space-y-4" onSubmit={handleForgotPasswordSubmit}>
                      <LabeledField label="Étape 1 - Email admin">
                        <Input
                          type="email"
                          value={forgotPasswordForm.email}
                          onChange={(event) =>
                            setForgotPasswordForm((current) => ({
                              ...current,
                              email: event.target.value,
                            }))
                          }
                          placeholder="admin@maxwell.com"
                          className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white placeholder:text-[#6D7788]"
                          required
                        />
                      </LabeledField>
                      <Button
                        type="submit"
                        size="lg"
                        className="h-11 w-full rounded-xl bg-[#FF8A1F] text-[#091018] hover:bg-[#FF9F45]"
                        disabled={isSubmittingForgotPassword}
                      >
                        {isSubmittingForgotPassword ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Envoi...
                          </>
                        ) : (
                          'Envoyer le code'
                        )}
                      </Button>
                    </form>
                  ) : null}

                  {forgotPasswordStep === 'verify' ? (
                    <form
                      className="space-y-4 rounded-2xl border border-white/10 bg-[#111b29] p-4"
                      onSubmit={handleVerifyResetCodeSubmit}
                    >
                      <p className="text-xs uppercase tracking-[0.16em] text-[#FF8A1F]">
                        Étape 2 - Vérification du code
                      </p>
                      <p className="text-xs text-[#8A95A8]">
                        Saisissez le code à 6 chiffres reçu par email.
                      </p>
                      {developmentResetCode ? (
                        <p className="rounded-lg border border-[#FF8A1F]/30 bg-[#FF8A1F]/10 px-3 py-2 text-xs text-[#FFBE84]">
                          Mode développement: code rempli automatiquement.
                        </p>
                      ) : null}
                      <LabeledField label="Code à 6 chiffres">
                        <Input
                          type="text"
                          value={forgotPasswordForm.code}
                          onChange={(event) =>
                            setForgotPasswordForm((current) => ({
                              ...current,
                              code: event.target.value.replace(/\D/g, '').slice(0, 6),
                            }))
                          }
                          placeholder="Ex: 123456"
                          className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white placeholder:text-[#6D7788]"
                          inputMode="numeric"
                          pattern="[0-9]{6}"
                          maxLength={6}
                          required
                        />
                      </LabeledField>
                      <Button
                        type="submit"
                        size="lg"
                        className="h-11 w-full rounded-xl bg-[#FF8A1F] text-[#091018] hover:bg-[#FF9F45]"
                        disabled={isSubmittingCodeVerification}
                      >
                        {isSubmittingCodeVerification ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Vérification...
                          </>
                        ) : (
                          'Vérifier le code'
                        )}
                      </Button>
                    </form>
                  ) : null}

                  {forgotPasswordStep === 'reset' ? (
                    <form
                      className="space-y-4 rounded-2xl border border-white/10 bg-[#111b29] p-4"
                      onSubmit={handleResetPasswordSubmit}
                    >
                      <p className="text-xs uppercase tracking-[0.16em] text-[#FF8A1F]">
                        Étape 3 - Nouveau mot de passe
                      </p>
                      <p className="text-xs text-[#8A95A8]">
                        Le code est vérifié. Vous pouvez définir le nouveau mot de passe.
                      </p>
                      <LabeledField label="Nouveau mot de passe">
                        <div className="relative">
                          <Input
                            type={isResetPasswordVisible ? 'text' : 'password'}
                            value={forgotPasswordForm.newPassword}
                            onChange={(event) =>
                              setForgotPasswordForm((current) => ({
                                ...current,
                                newPassword: event.target.value,
                              }))
                            }
                            placeholder="Minimum 12 caractères"
                            className="h-11 rounded-xl border-white/10 bg-[#141d2b] pr-11 text-white placeholder:text-[#6D7788]"
                            minLength={12}
                            required
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#8A95A8] transition hover:text-white"
                            onClick={() => setIsResetPasswordVisible((current) => !current)}
                            aria-label={
                              isResetPasswordVisible
                                ? 'Masquer le nouveau mot de passe'
                                : 'Afficher le nouveau mot de passe'
                            }
                          >
                            {isResetPasswordVisible ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </LabeledField>
                      <LabeledField label="Confirmer le mot de passe">
                        <div className="relative">
                          <Input
                            type={isResetPasswordVisible ? 'text' : 'password'}
                            value={forgotPasswordForm.confirmPassword}
                            onChange={(event) =>
                              setForgotPasswordForm((current) => ({
                                ...current,
                                confirmPassword: event.target.value,
                              }))
                            }
                            placeholder="Retapez le nouveau mot de passe"
                            className="h-11 rounded-xl border-white/10 bg-[#141d2b] pr-11 text-white placeholder:text-[#6D7788]"
                            minLength={12}
                            required
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#8A95A8] transition hover:text-white"
                            onClick={() => setIsResetPasswordVisible((current) => !current)}
                            aria-label={
                              isResetPasswordVisible
                                ? 'Masquer la confirmation du mot de passe'
                                : 'Afficher la confirmation du mot de passe'
                            }
                          >
                            {isResetPasswordVisible ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </LabeledField>
                      {forgotPasswordForm.confirmPassword.length > 0 &&
                      forgotPasswordForm.newPassword !== forgotPasswordForm.confirmPassword ? (
                        <p className="text-xs text-[#FFBE84]">
                          Les deux mots de passe ne correspondent pas.
                        </p>
                      ) : null}
                      <Button
                        type="submit"
                        size="lg"
                        className="h-11 w-full rounded-xl bg-[#FF8A1F] text-[#091018] hover:bg-[#FF9F45]"
                        disabled={
                          isSubmittingResetPassword ||
                          forgotPasswordForm.newPassword !== forgotPasswordForm.confirmPassword
                        }
                      >
                        {isSubmittingResetPassword ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Réinitialisation...
                          </>
                        ) : (
                          'Valider le nouveau mot de passe'
                        )}
                      </Button>
                    </form>
                  ) : null}

                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full rounded-xl border-white/10 bg-transparent text-white hover:bg-white/5"
                    onClick={() => {
                      setIsForgotPasswordMode(false);
                      setForgotPasswordStep('request');
                      setResetSessionToken(null);
                      setDevelopmentResetCode(null);
                      setIsResetPasswordVisible(false);
                      setForgotPasswordForm({
                        email: '',
                        code: '',
                        newPassword: '',
                        confirmPassword: '',
                      });
                    }}
                  >
                    Retour à la connexion
                  </Button>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleLoginSubmit}>
                  <LabeledField label="Email admin">
                    <Input
                      type="email"
                      value={loginForm.email}
                      onChange={(event) =>
                        setLoginForm((current) => ({ ...current, email: event.target.value }))
                      }
                      placeholder="admin@maxwell.com"
                      className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white placeholder:text-[#6D7788]"
                      required
                    />
                  </LabeledField>
                  <LabeledField label="Mot de passe">
                    <div className="relative">
                      <Input
                        type={isLoginPasswordVisible ? 'text' : 'password'}
                        value={loginForm.password}
                        onChange={(event) =>
                          setLoginForm((current) => ({ ...current, password: event.target.value }))
                        }
                        placeholder="Votre mot de passe admin"
                        className="h-11 rounded-xl border-white/10 bg-[#141d2b] pr-11 text-white placeholder:text-[#6D7788]"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#8A95A8] transition hover:text-white"
                        onClick={() => setIsLoginPasswordVisible((current) => !current)}
                        aria-label={
                          isLoginPasswordVisible
                            ? 'Masquer le mot de passe'
                            : 'Afficher le mot de passe'
                        }
                      >
                        {isLoginPasswordVisible ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </LabeledField>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-xs font-medium text-[#A9B3C2] transition hover:text-[#FFBE84]"
                      onClick={() => {
                        setIsForgotPasswordMode(true);
                        setForgotPasswordStep('request');
                        setResetSessionToken(null);
                        setDevelopmentResetCode(null);
                        setForgotPasswordForm((current) => ({
                          ...current,
                          email: current.email.trim() || loginForm.email.trim(),
                          code: '',
                          newPassword: '',
                          confirmPassword: '',
                        }));
                      }}
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="h-11 w-full rounded-xl bg-[#FF8A1F] text-[#091018] hover:bg-[#FF9F45]"
                    disabled={isSubmittingLogin}
                  >
                    {isSubmittingLogin ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Connexion...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4" />
                        Se connecter
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
        <Toaster richColors position="top-right" />
      </div>
    );
  }

  const authenticatedUser = session.user;

  const contentCollections = [
    { label: 'Catégories', value: categories.length, icon: Globe },
    { label: 'Équipe', value: staffItems.length, icon: Users },
    { label: 'Galerie', value: galleryItems.length, icon: Images },
    { label: 'Partenaires', value: partners.length, icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-[#08111A] text-white">
      <div className="min-h-screen lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
        <aside className="hidden border-b border-white/10 bg-[#0E1723] px-4 py-5 sm:px-5 sm:py-6 lg:sticky lg:top-0 lg:block lg:h-screen lg:self-start lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#FF8A1F]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#FF8A1F]">
                <ShieldCheck className="h-4 w-4" />
                Admin
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white">Maxwell</h1>
                <p className="text-sm text-[#8C97AB]">Back-office v1</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#121D2A] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FF8A1F]/15 text-[#FF8A1F]">
                  <UserRound className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">{authenticatedUser.email}</p>
                  <p className="text-sm capitalize text-[#8C97AB]">{authenticatedUser.role}</p>
                  <p className="mt-1 text-xs text-[#6F7A8E]">
                    Dernière connexion: {formatDate(authenticatedUser.lastLoginAt)}
                  </p>
                </div>
              </div>
            </div>

            <nav className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
              {sidebarSections.map(({ key, label, icon: Icon }) => {
                const isActive = activeSection === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSectionSelect(key)}
                    className={`flex min-w-fit shrink-0 snap-start items-center gap-3 whitespace-nowrap rounded-2xl px-3 py-2.5 text-left text-xs font-semibold transition sm:px-4 sm:py-3 sm:text-sm ${
                      isActive
                        ? 'bg-[#FF8A1F] text-[#091018]'
                        : 'bg-[#121D2A] text-[#D2D7E0] hover:bg-[#182434]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                );
              })}
            </nav>

            <Button
              type="button"
              variant="outline"
              className="h-11 w-full rounded-2xl border-white/10 bg-transparent text-white hover:bg-white/5"
              onClick={() => {
                setIsMobileSidebarOpen(false);
                void handleLogout();
              }}
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </aside>

        <div className="sticky top-0 z-[450] border-b border-white/10 bg-[#0E1723]/95 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between px-4 py-3 sm:px-5">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF8A1F]">
                Admin
              </p>
              <p className="truncate text-sm font-semibold text-white">{sectionLabels[activeSection]}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-10 rounded-xl border-white/10 bg-transparent p-0 text-white hover:bg-white/5"
              onClick={() => setIsMobileSidebarOpen((current) => !current)}
              aria-label={isMobileSidebarOpen ? 'Fermer le menu admin' : 'Ouvrir le menu admin'}
            >
              {isMobileSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div
          className={`fixed inset-0 z-[470] transition lg:hidden ${
            isMobileSidebarOpen ? 'visible' : 'invisible'
          }`}
        >
          <button
            type="button"
            className={`absolute inset-0 bg-black/60 transition-opacity ${
              isMobileSidebarOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-label="Fermer le panneau admin"
          />

          <aside
            className={`absolute inset-y-0 left-0 w-[88vw] max-w-sm overflow-y-auto border-r border-white/10 bg-[#0E1723] p-4 shadow-2xl transition-transform duration-300 ${
              isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="space-y-5">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#FF8A1F]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#FF8A1F]">
                  <ShieldCheck className="h-4 w-4" />
                  Admin
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-white">Maxwell</h1>
                  <p className="text-sm text-[#8C97AB]">Back-office v1</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#121D2A] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FF8A1F]/15 text-[#FF8A1F]">
                    <UserRound className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{authenticatedUser.email}</p>
                    <p className="text-sm capitalize text-[#8C97AB]">{authenticatedUser.role}</p>
                    <p className="mt-1 text-xs text-[#6F7A8E]">
                      Dernière connexion: {formatDate(authenticatedUser.lastLoginAt)}
                    </p>
                  </div>
                </div>
              </div>

              <nav className="space-y-2">
                {sidebarSections.map(({ key, label, icon: Icon }) => {
                  const isActive = activeSection === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleSectionSelect(key)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                        isActive
                          ? 'bg-[#FF8A1F] text-[#091018]'
                          : 'bg-[#121D2A] text-[#D2D7E0] hover:bg-[#182434]'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  );
                })}
              </nav>

              <Button
                type="button"
                variant="outline"
                className="h-11 w-full rounded-2xl border-white/10 bg-transparent text-white hover:bg-white/5"
                onClick={() => {
                  setIsMobileSidebarOpen(false);
                  void handleLogout();
                }}
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </aside>
        </div>

        <main className="px-4 py-5 sm:px-8 sm:py-6 lg:px-10">
          <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#FF8A1F]">Cockpit</p>
              <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                {sectionLabels[activeSection]}
              </h2>
              <p className="mt-1 text-sm text-[#8C97AB]">
                API: <span className="break-all font-mono text-[#FF8A1F]">{API_BASE_URL}</span>
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full rounded-2xl border-white/10 bg-transparent text-white hover:bg-white/5 sm:w-auto"
                onClick={handleReturnToSite}
              >
                <ArrowLeft className="h-4 w-4" />
                Retour au site
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full rounded-2xl border-white/10 bg-transparent text-white hover:bg-white/5 sm:w-auto"
                onClick={() => void refreshData()}
                disabled={isLoadingData || isAuthenticating}
              >
                <RefreshCcw className={`h-4 w-4 ${isLoadingData ? 'animate-spin' : ''}`} />
                Recharger
              </Button>
            </div>
          </div>

          {isAuthenticating || isLoadingData ? (
            <LoadingState />
          ) : (
            <div className="space-y-8">
              {activeSection === 'overview' && (
                <OverviewSection
                  metrics={metrics}
                  newsItems={newsItems}
                  contentCollections={contentCollections}
                  onCreateNews={() => {
                    setActiveSection('news');
                    startCreatingNews();
                  }}
                  onEditNews={(item) => {
                    setActiveSection('news');
                    startEditingNews(item);
                  }}
                  extractId={extractId}
                  formatDate={formatDate}
                />
              )}

              {activeSection === 'settings' && (
                <SettingsSection
                  settingsForm={settingsForm}
                  setSettingsForm={setSettingsForm}
                  isSavingSettings={isSavingSettings}
                  onSaveSettings={() => void saveSettings()}
                />
              )}

              {activeSection === 'homepage' && (
                <HomepageSection
                  homepageForm={homepageForm}
                  setHomepageForm={setHomepageForm}
                  isSavingHomepage={isSavingHomepage}
                  onSaveHomepage={() => void saveHomepage()}
                />
              )}

              {activeSection === 'news' && (
                <NewsSection
                  newsItems={newsItems}
                  editingNewsId={editingNewsId}
                  newsForm={newsForm}
                  setNewsForm={setNewsForm}
                  isSavingNews={isSavingNews}
                  selectClassName={selectClassName}
                  onStartCreatingNews={startCreatingNews}
                  onStartEditingNews={startEditingNews}
                  onDeleteNewsItem={(id) => void deleteNewsItem(id)}
                  onSaveNews={() => void saveNews()}
                  extractId={extractId}
                />
              )}

              {activeSection === 'inbox' && (
                <InboxSection
                  contactSummary={contactSummary}
                  registrationSummary={registrationSummary}
                  pendingContactMessages={pendingContactMessages}
                  pendingRegistrations={pendingRegistrations}
                  setActiveSection={setActiveSection}
                  setSelectedRegistrationId={setSelectedRegistrationId}
                  extractId={extractId}
                  formatDate={formatDate}
                />
              )}

              {activeSection === 'messages' && (
                <MessagesSection
                  contactSummary={contactSummary}
                  contactMessages={contactMessages}
                  contactStatuses={contactStatuses}
                  contactStatusLabels={contactStatusLabels}
                  selectClassName={selectClassName}
                  extractId={extractId}
                  formatDate={formatDate}
                  onUpdateContactStatus={(id, status) => void updateContactStatus(id, status)}
                />
              )}

              {activeSection === 'registrations' && (
                <RegistrationsSection
                  registrationSummary={registrationSummary}
                  registrationFilter={registrationFilter}
                  setRegistrationFilter={setRegistrationFilter}
                  registrationSearch={registrationSearch}
                  setRegistrationSearch={setRegistrationSearch}
                  filteredRegistrations={filteredRegistrations}
                  selectedRegistrationId={selectedRegistrationId}
                  setSelectedRegistrationId={setSelectedRegistrationId}
                  selectedRegistration={selectedRegistration}
                  registrationNotesDraft={registrationNotesDraft}
                  setRegistrationNotesDraft={setRegistrationNotesDraft}
                  hasRegistrationNotesChanges={hasRegistrationNotesChanges}
                  isSavingRegistrationNotes={isSavingRegistrationNotes}
                  registrationStatuses={registrationStatuses}
                  registrationStatusLabels={registrationStatusLabels}
                  selectClassName={selectClassName}
                  extractId={extractId}
                  formatDate={formatDate}
                  createWhatsAppLink={createWhatsAppLink}
                  onUpdateRegistrationStatus={(id, status) => void updateRegistrationStatus(id, status)}
                  onSaveRegistrationNotes={() => void saveRegistrationNotes()}
                />
              )}
            </div>
          )}
        </main>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}



