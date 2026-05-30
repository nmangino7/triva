import { Question, CategoryMeta } from '@/app/types';
import { finance } from '@/app/data/finance';
import { general } from '@/app/data/general';
import { entertainment } from '@/app/data/entertainment';
import { sports } from '@/app/data/sports';
import { science } from '@/app/data/science';

interface CategoryEntry extends CategoryMeta {
  questions: Question[];
}

export const CATEGORIES: CategoryEntry[] = [
  { id: 'finance', label: 'Finance', emoji: '💰', color: 'from-emerald-400 to-green-600', blurb: 'IRAs, annuities & advisor know-how', questions: finance },
  { id: 'general', label: 'General Knowledge', emoji: '🧠', color: 'from-sky-400 to-blue-600', blurb: 'A bit of everything', questions: general },
  { id: 'entertainment', label: 'Entertainment', emoji: '🎬', color: 'from-pink-400 to-rose-600', blurb: 'Movies, TV & music', questions: entertainment },
  { id: 'sports', label: 'Sports', emoji: '⚽', color: 'from-orange-400 to-red-600', blurb: 'Games, athletes & records', questions: sports },
  { id: 'science', label: 'Science / History / Geo', emoji: '🔬', color: 'from-violet-400 to-purple-600', blurb: 'The world, past & present', questions: science },
];

export function getCategory(id: string): CategoryEntry | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

// Fisher–Yates shuffle, returns a new array.
export function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    const j = buf[0] % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
