import type { LucideIcon } from 'lucide-react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { EmptyState, ListRow, MetricCard, Surface } from '@/admin/admin-ui';
import type { NewsItem } from '@/admin/admin.types';

type Metric = {
  label: string;
  value: number;
  detail: string;
  icon: LucideIcon;
};

type CollectionMetric = {
  label: string;
  value: number;
  icon: LucideIcon;
};

type OverviewSectionProps = {
  metrics: Metric[];
  newsItems: NewsItem[];
  contentCollections: CollectionMetric[];
  onCreateNews: () => void;
  onEditNews: (item: NewsItem) => void;
  extractId: (item: NewsItem) => string;
  formatDate: (value?: string | null) => string;
};

export function OverviewSection({
  metrics,
  newsItems,
  contentCollections,
  onCreateNews,
  onEditNews,
  extractId,
  formatDate,
}: OverviewSectionProps) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            detail={metric.detail}
            icon={metric.icon}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Surface
          title="Dernieres actualites"
          subtitle="Pilotage editorial"
          action={
            <Button
              type="button"
              className="rounded-xl bg-[#D7FF3B] text-[#091018] hover:bg-[#e3ff72]"
              onClick={onCreateNews}
            >
              <Plus className="h-4 w-4" />
              Nouvelle actu
            </Button>
          }
        >
          <div className="space-y-3">
            {newsItems.slice(0, 4).map((item) => (
              <ListRow
                key={extractId(item)}
                title={item.title}
                subtitle={`${item.status} · ${formatDate(item.publishedAt ?? item.createdAt)}`}
                actionLabel="Modifier"
                onAction={() => onEditNews(item)}
              />
            ))}
            {newsItems.length === 0 && (
              <EmptyState
                title="Aucune actualite"
                description="Commence par creer votre premier article dans le back-office."
              />
            )}
          </div>
        </Surface>

        <Surface title="Collections" subtitle="Ce qui est deja pilote par l'API">
          <div className="grid gap-3 sm:grid-cols-2">
            {contentCollections.map((collection) => (
              <MetricCard
                key={collection.label}
                label={collection.label}
                value={collection.value}
                detail="Collections seedees"
                icon={collection.icon}
                compact
              />
            ))}
          </div>
        </Surface>
      </div>
    </>
  );
}

