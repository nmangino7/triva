import { ROOM_CODE_ALPHABET, ROOM_CODE_LENGTH, CHANNEL_PREFIX } from './constants';

// Generate a short, unambiguous room code using crypto randomness.
export function generateRoomCode(length = ROOM_CODE_LENGTH): string {
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  let code = '';
  for (let i = 0; i < length; i++) {
    code += ROOM_CODE_ALPHABET[bytes[i] % ROOM_CODE_ALPHABET.length];
  }
  return code;
}

// Map a room code to its Pusher presence channel name.
export function channelName(code: string): string {
  return `${CHANNEL_PREFIX}${code.toUpperCase()}`;
}

// Normalize user-typed codes (uppercase, strip non-alphabet chars).
export function normalizeCode(input: string): string {
  return input
    .toUpperCase()
    .split('')
    .filter((c) => ROOM_CODE_ALPHABET.includes(c))
    .join('')
    .slice(0, ROOM_CODE_LENGTH);
}
