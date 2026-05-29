export interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Player {
  id: string;
  name: string;
  score: number;
  buzzed: boolean;
}

export type GameState = 'setup' | 'playing' | 'buzzed' | 'answered' | 'finished';
