export interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number; // host-only; never sent to players except current reveal index
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export type Role = 'host' | 'player';

export type GameMode = 'buzzer' | 'tap';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type DifficultyFilter = 'all' | Difficulty;

export interface Avatar {
  color: string; // palette key, e.g. 'rose'
  emoji: string;
}

export interface RoomMember {
  id: string; // presence user_id (uuid)
  name: string;
  role: Role;
  avatar?: Avatar;
}

export type GamePhase =
  | 'lobby'
  | 'question'
  | 'buzzed'
  | 'reveal'
  | 'leaderboard'
  | 'ended';

export interface PublicPlayer {
  id: string;
  name: string;
  score: number;
  avatar?: Avatar;
  delta?: number; // points gained on the most recent question (for score-pop)
}

// Player-safe broadcast payload. Deliberately omits the full question bank
// and the correct index (except the current one, only during 'reveal').
export interface GameStatePayload {
  phase: GamePhase;
  category: string;
  gameMode: GameMode;
  questionNumber: number;
  totalQuestions: number;
  question: {
    id: number;
    text: string;
    options: string[];
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
  } | null;
  buzzedPlayerId: string | null;
  buzzedPlayerName: string | null;
  revealCorrectIndex: number | null;
  lastAnswerCorrect: boolean | null;
  deadline: number | null; // epoch ms when answering closes; null if no active timer
  answeredCount: number; // tap mode: distinct players who answered this question
  playerCount: number; // denominator for "X / N answered"
  optionTally: number[] | null; // tap reveal only: counts per option (no correct index)
  players: PublicPlayer[];
}

export interface BuzzPayload {
  playerId: string;
  name: string;
  t: number; // display only, never used for arbitration
}

export interface AnswerPayload {
  playerId: string;
  selectedIndex: number;
  t: number;
}

// Host-only authoritative state (never serialized to players intact).
export interface HostGameState {
  code: string;
  category: string;
  gameMode: GameMode;
  difficultyFilter: DifficultyFilter;
  questions: Question[];
  index: number;
  phase: GamePhase;
  buzzedPlayerId: string | null;
  buzzedPlayerName: string | null;
  lastAnswerCorrect: boolean | null;
  deadline: number | null;
  answers: Record<string, { idx: number; ms: number }>; // tap mode, per question
  scores: Record<string, number>;
  deltas: Record<string, number>; // points gained last question
  streaks: Record<string, number>;
  members: RoomMember[];
}

export interface CategoryMeta {
  id: string;
  label: string;
  emoji: string;
  color: string; // tailwind gradient classes
  blurb: string;
}
