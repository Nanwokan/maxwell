import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Brain,
  Clock3,
  MapPin,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  activity: Activity,
  brain: Brain,
  clock: Clock3,
  'clock-3': Clock3,
  'map-pin': MapPin,
  sparkles: Sparkles,
  target: Target,
  trophy: Trophy,
  users: Users,
  zap: Zap,
};

const categoryThemeMap: Record<string, string> = {
  amber: 'from-amber-500/20 to-amber-600/10',
  blue: 'from-blue-500/20 to-blue-600/10',
  emerald: 'from-emerald-500/20 to-emerald-600/10',
  rose: 'from-rose-500/20 to-rose-600/10',
  violet: 'from-violet-500/20 to-violet-600/10',
};

export function getContentIcon(iconKey: string | undefined, fallback: LucideIcon): LucideIcon {
  return iconMap[iconKey?.trim().toLowerCase() ?? ''] ?? fallback;
}

export function getCategoryTheme(themeKey: string | undefined): string {
  return categoryThemeMap[themeKey?.trim().toLowerCase() ?? ''] ?? 'from-slate-500/20 to-slate-600/10';
}
