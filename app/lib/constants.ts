// Shared game constants

export const POINTS_PER_CORRECT = 10;

// Each game draws this many questions at random from the category's pool.
export const QUESTIONS_PER_GAME = 20;

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
