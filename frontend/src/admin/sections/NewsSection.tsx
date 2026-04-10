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
        title="Bibliotheque d'actualites"
        subtitle="Selectionne un article ou cree un nouveau brouillon"
        action={
          <Button
            type="button"
            className="rounded-xl bg-[#D7FF3B] text-[#091018] hover:bg-[#e3ff72]"
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
                    ? 'border-[#D7FF3B]/50 bg-[#D7FF3B]/10'
                    : 'border-white/10 bg-[#101928] hover:bg-[#162131]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
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
        title={editingNewsId === 'new' ? 'Nouvelle actualite' : "Edition de l'actualite"}
        subtitle="Titre, slug, statut, contenu et metadonnees"
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
              className="rounded-xl bg-[#D7FF3B] text-[#091018] hover:bg-[#e3ff72]"
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
            title="Selectionne un article"
            description="Choisis une actualite a gauche ou lance la creation d'un nouveau brouillon."
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
                <option value="draft">draft</option>
                <option value="published">published</option>
              </select>
            </LabeledField>
            <LabeledField label="Categorie">
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
            <LabeledField label="Cover URL" className="md:col-span-2">
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

