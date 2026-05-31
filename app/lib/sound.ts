'use client';

import { isMuted } from './audioSettings';

let sharedCtx: AudioContext | null = null;

// Exposed so the music loop can share one resumed AudioContext.
export function getCtx(): AudioContext | null {
  try {
    if (!sharedCtx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      sharedCtx = new Ctx();
    }
    // Resume if the browser suspended it (works once the page has had a user gesture).
    if (sharedCtx.state === 'suspended') sharedCtx.resume().catch(() => {});
    return sharedCtx;
  } catch {
    return null;
  }
}

// Short buzz beep via the Web Audio API (no asset files needed).
export function playBuzz(freq = 760) {
  if (isMuted()) return;
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'square';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
  osc.start();
  osc.stop(ctx.currentTime + 0.18);
}

// Play a sequence of notes (freq in Hz, each lasting `step` seconds).
function playSequence(freqs: number[], step = 0.13, type: OscillatorType = 'sine') {
  if (isMuted()) return;
  const ctx = getCtx();
  if (!ctx) return;
  freqs.forEach((f, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.value = f;
    const t = ctx.currentTime + i * step;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + step);
    osc.start(t);
    osc.stop(t + step);
  });
}

// Cheerful ascending chime — correct answer.
export function playCorrect() {
  playSequence([523, 659, 784, 1047], 0.12, 'triangle'); // C5 E5 G5 C6
}

// Soft descending tone — wrong / no points.
export function playWrong() {
  playSequence([392, 311], 0.18, 'sawtooth'); // G4 -> Eb4
}

// Neutral two-note reveal (e.g. time ran out / skipped).
export function playReveal() {
  playSequence([587, 880], 0.12, 'triangle'); // D5 A5
}

// Soft blip when a player taps an option.
export function playTap() {
  playSequence([660], 0.07, 'sine');
}

// Confirmation when an answer locks in.
export function playLockIn() {
  playSequence([523, 784], 0.08, 'triangle');
}

// Whoosh-ish rise for the standings screen.
export function playStandings() {
  playSequence([440, 554, 659], 0.09, 'sine');
}

// Fanfare for the final podium.
export function playPodium() {
  playSequence([523, 659, 784, 1047, 1319], 0.14, 'triangle');
}

// Single short tick for the final countdown seconds.
export function playTick() {
  if (isMuted()) return;
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.value = 1200;
  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
  osc.start();
  osc.stop(ctx.currentTime + 0.06);
}
