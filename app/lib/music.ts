'use client';

import { getCtx } from './sound';
import { isMuted } from './audioSettings';

// Lightweight asset-free lobby music: a gentle looping arpeggio.
let timer: ReturnType<typeof setInterval> | null = null;
let playing = false;

const NOTES = [392, 523, 659, 784, 659, 523]; // G4 C5 E5 G5 E5 C5
let step = 0;

function tickNote() {
  if (isMuted()) return; // silently skip while muted, keep loop alive
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'triangle';
  osc.frequency.value = NOTES[step % NOTES.length];
  step++;
  const t = ctx.currentTime;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.06, t + 0.04); // quiet background
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
  osc.start(t);
  osc.stop(t + 0.45);
}

export function startLobbyMusic() {
  if (playing) return;
  playing = true;
  step = 0;
  tickNote();
  timer = setInterval(tickNote, 500);
}

export function stopLobbyMusic() {
  playing = false;
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
