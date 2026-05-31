// Shared game constants

export const POINTS_PER_CORRECT = 10;

// Each game draws this many questions at random from the category's pool.
export const QUESTIONS_PER_GAME = 20;

// Seconds players have to buzz in before the answer auto-reveals.
export const QUESTION_SECONDS = 20;

// Speed bonus: a correct tap also earns up to this many extra points,
// scaled by how much time was left. Set to 0 to disable.
export const SPEED_BONUS_MAX = 5;

// Play a tick sound in the final N seconds of the countdown.
export const COUNTDOWN_TICK_SECONDS = 5;

// Channel naming. Pusher presence channels must be prefixed "presence-".
export const CHANNEL_PREFIX = 'presence-trivia-';

// Unambiguous room-code alphabet (no I, O, 0, 1, L).
export const ROOM_CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const ROOM_CODE_LENGTH = 4;

// Allow players to join a game that has already started (as score-0 latecomers).
export const ALLOW_LATE_JOIN = true;

// Pusher event names
export const EVENT_STATE = 'game:state';
export const EVENT_BUZZ = 'player:buzz';
export const EVENT_ANSWER = 'player:answer';

// Player avatar choices
export const AVATAR_COLORS = ['rose', 'amber', 'emerald', 'sky', 'violet', 'pink', 'orange', 'teal'];
export const AVATAR_EMOJIS = ['🦊', '🐼', '🐶', '🐱', '🦁', '🐸', '🐵', '🦄', '🐯', '🐮', '🐧', '🦉', '🐙', '🦋', '🐢', '🦖'];

// Tailwind classes per avatar color key (kept static so Tailwind keeps them).
export const AVATAR_COLOR_CLASS: Record<string, string> = {
  rose: 'bg-rose-500',
  amber: 'bg-amber-500',
  emerald: 'bg-emerald-500',
  sky: 'bg-sky-500',
  violet: 'bg-violet-500',
  pink: 'bg-pink-500',
  orange: 'bg-orange-500',
  teal: 'bg-teal-500',
};

// localStorage keys
export const LS_PLAYER_NAME = 'trivia-name';
export const LS_PLAYER_AVATAR = 'trivia-avatar';
export const LS_MUTE = 'trivia-muted';
export const LS_SEEN_HELP = 'trivia-seen-help';
