import type { Dispatch, SetStateAction } from 'react';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState, LabeledField, StatusPill, Surface } from '@/admin/admin-ui';
import type { NewsForm, NewsItem } from '@/admin/admin.types';

type NewsSectionProps = {
  newsItems: NewsItem[];
  editingNewsId: string | 'new' | null;
  newsForm: NewsForm;
  setNewsForm: Dispatch<SetStateAction<NewsForm>>;
  isSavingNews: boolean;
  selectClassName: string;
  onStartCreatingNews: () => void;
  onStartEditingNews: (item: NewsItem) => void;
  onDeleteNewsItem: (id: string) => void;
  onSaveNews: () => void;
  extractId: (item: NewsItem) => string;
};

export function NewsSection({
  newsItems,
  editingNewsId,
  newsForm,
  setNewsForm,
  isSavingNews,
  selectClassName,
  onStartCreatingNews,
  onStartEditingNews,
  onDeleteNewsItem,
  onSaveNews,
  extractId,
}: NewsSectionProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <Surface
        title="Bibliothèque d'actualités"
        subtitle="Sélectionne un article ou crée un nouveau brouillon"
        action={
          <Button
            type="button"
            className="rounded-xl bg-[#FF8A1F] text-[#091018] hover:bg-[#FF9F45]"
            onClick={onStartCreatingNews}
          >
            <Plus className="h-4 w-4" />
            Nouvelle actu
          </Button>
        }
      >
        <div className="space-y-3">
          {newsItems.map((item) => {
            const newsId = extractId(item);
            const isActive = editingNewsId === newsId;

            return (
              <button
                key={newsId}
                type="button"
                onClick={() => onStartEditingNews(item)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  isActive
                    ? 'border-[#FF8A1F]/50 bg-[#FF8A1F]/10'
                    : 'border-white/10 bg-[#101928] hover:bg-[#162131]'
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-[#8C97AB]">{item.slug}</p>
                  </div>
                  <StatusPill label={item.status} tone={item.status === 'published' ? 'success' : 'muted'} />
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-[#A9B3C2]">
                  {item.excerpt || 'Aucun extrait pour le moment.'}
                </p>
              </button>
            );
          })}
        </div>
      </Surface>

      <Surface
        title={editingNewsId === 'new' ? 'Nouvelle actualité' : "Édition de l'actualité"}
        subtitle="Titre, slug, statut, contenu et métadonnées"
        action={
          <div className="flex flex-wrap gap-3">
            {editingNewsId && editingNewsId !== 'new' && (
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-red-400/30 bg-transparent text-red-200 hover:bg-red-500/10"
                onClick={() => onDeleteNewsItem(editingNewsId)}
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </Button>
            )}
            <Button
              type="button"
              className="rounded-xl bg-[#FF8A1F] text-[#091018] hover:bg-[#FF9F45]"
              onClick={onSaveNews}
              disabled={isSavingNews}
            >
              {isSavingNews ? (
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
          </div>
        }
      >
        {!editingNewsId ? (
          <EmptyState
            title="Sélectionne un article"
            description="Choisis une actualité à gauche ou lance la création d'un nouveau brouillon."
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            <LabeledField label="Titre" className="md:col-span-2">
              <Input
                value={newsForm.title}
                onChange={(event) => setNewsForm((current) => ({ ...current, title: event.target.value }))}
                className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
              />
            </LabeledField>
            <LabeledField label="Slug">
              <Input
                value={newsForm.slug}
                onChange={(event) => setNewsForm((current) => ({ ...current, slug: event.target.value }))}
                className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
              />
            </LabeledField>
            <LabeledField label="Statut">
              <select
                value={newsForm.status}
                onChange={(event) =>
                  setNewsForm((current) => ({
                    ...current,
                    status: event.target.value as NewsForm['status'],
                  }))
                }
                className={selectClassName}
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </LabeledField>
            <LabeledField label="Catégorie">
              <Input
                value={newsForm.categoryLabel}
                onChange={(event) =>
                  setNewsForm((current) => ({
                    ...current,
                    categoryLabel: event.target.value,
                  }))
                }
                className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
              />
            </LabeledField>
            <LabeledField label="Tags">
              <Input
                value={newsForm.tags}
                onChange={(event) => setNewsForm((current) => ({ ...current, tags: event.target.value }))}
                className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
              />
            </LabeledField>
            <LabeledField label="URL de couverture" className="md:col-span-2">
              <Input
                value={newsForm.coverUrl}
                onChange={(event) =>
                  setNewsForm((current) => ({
                    ...current,
                    coverUrl: event.target.value,
                  }))
                }
                className="h-11 rounded-xl border-white/10 bg-[#141d2b] text-white"
              />
            </LabeledField>
            <LabeledField label="Extrait" className="md:col-span-2">
              <Textarea
                value={newsForm.excerpt}
                onChange={(event) =>
                  setNewsForm((current) => ({
                    ...current,
                    excerpt: event.target.value,
                  }))
                }
                className="min-h-28 rounded-xl border-white/10 bg-[#141d2b] text-white"
              />
            </LabeledField>
            <LabeledField label="Contenu" className="md:col-span-2">
              <Textarea
                value={newsForm.content}
                onChange={(event) =>
                  setNewsForm((current) => ({
                    ...current,
                    content: event.target.value,
                  }))
                }
                className="min-h-48 rounded-xl border-white/10 bg-[#141d2b] text-white"
              />
            </LabeledField>
          </div>
        )}
      </Surface>
    </div>
  );
}



