'use client';

import { LS_MUTE } from './constants';

// Simple muted flag backed by localStorage, with subscribers for UI sync.
const listeners = new Set<() => void>();

export function isMuted(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(LS_MUTE) === '1';
}

export function setMuted(muted: boolean) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LS_MUTE, muted ? '1' : '0');
  listeners.forEach((l) => l());
}

export function toggleMuted(): boolean {
  const next = !isMuted();
  setMuted(next);
  return next;
}

export function subscribeMuted(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
