export interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number; // host-only; never sent to players except current reveal index
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export type Role = 'host' | 'player';

export interface RoomMember {
  id: string; // presence user_id (uuid)
  name: string;
  role: Role;
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
}

// Player-safe broadcast payload. Deliberately omits the full question bank
// and the correct index (except the current one, only during 'reveal').
export interface GameStatePayload {
  phase: GamePhase;
  category: string;
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
  players: PublicPlayer[];
}

export interface BuzzPayload {
  playerId: string;
  name: string;
  t: number; // display only, never used for arbitration
}

// Host-only authoritative state (never serialized to players intact).
export interface HostGameState {
  code: string;
  category: string;
  questions: Question[];
  index: number;
  phase: GamePhase;
  buzzedPlayerId: string | null;
  buzzedPlayerName: string | null;
  lastAnswerCorrect: boolean | null;
  scores: Record<string, number>;
  members: RoomMember[];
}

export interface CategoryMeta {
  id: string;
  label: string;
  emoji: string;
  color: string; // tailwind gradient classes
  blurb: string;
}
