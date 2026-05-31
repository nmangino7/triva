import { Question, CategoryMeta, DifficultyFilter } from '@/app/types';
import { QUESTIONS_PER_GAME } from '@/app/lib/constants';
import { finance } from '@/app/data/finance';
import { general } from '@/app/data/general';
import { entertainment } from '@/app/data/entertainment';
import { sports } from '@/app/data/sports';
import { science } from '@/app/data/science';
import { popculture } from '@/app/data/popculture';
import { food } from '@/app/data/food';

interface CategoryEntry extends CategoryMeta {
  questions: Question[];
}

export const CATEGORIES: CategoryEntry[] = [
  { id: 'finance', label: 'Finance', emoji: '💰', color: 'from-emerald-400 to-green-600', blurb: 'IRAs, annuities & advisor know-how', questions: finance },
  { id: 'general', label: 'General Knowledge', emoji: '🧠', color: 'from-sky-400 to-blue-600', blurb: 'A bit of everything', questions: general },
  { id: 'entertainment', label: 'Entertainment', emoji: '🎬', color: 'from-pink-400 to-rose-600', blurb: 'Movies, TV & music', questions: entertainment },
  { id: 'sports', label: 'Sports', emoji: '⚽', color: 'from-orange-400 to-red-600', blurb: 'Games, athletes & records', questions: sports },
  { id: 'science', label: 'Science / History / Geo', emoji: '🔬', color: 'from-violet-400 to-purple-600', blurb: 'The world, past & present', questions: science },
  { id: 'popculture', label: 'Pop Culture', emoji: '🌟', color: 'from-fuchsia-400 to-pink-600', blurb: 'Brands, gaming, internet & more', questions: popculture },
  { id: 'food', label: 'Food & Drink', emoji: '🍔', color: 'from-amber-400 to-orange-600', blurb: 'Cuisines, cooking & drinks', questions: food },
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

// How many questions a given category+difficulty would yield this game.
export function availableCount(categoryId: string, filter: DifficultyFilter): number {
  const pool = getCategory(categoryId)?.questions ?? [];
  const filtered = filter === 'all' ? pool : pool.filter((q) => q.difficulty === filter);
  return Math.min(QUESTIONS_PER_GAME, filtered.length || pool.length);
}

// Pick a shuffled set of questions for a game, honoring the difficulty filter.
// Falls back to the full pool if a difficulty subset is too small.
export function pickQuestions(categoryId: string, filter: DifficultyFilter): Question[] {
  const pool = getCategory(categoryId)?.questions ?? [];
  const filtered = filter === 'all' ? pool : pool.filter((q) => q.difficulty === filter);
  const base = filtered.length >= QUESTIONS_PER_GAME ? filtered : filtered.length > 0 ? filtered : pool;
  return shuffle(base).slice(0, QUESTIONS_PER_GAME);
}
