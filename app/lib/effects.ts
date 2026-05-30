'use client';

import confetti from 'canvas-confetti';

// Celebratory burst — used when an answer is correct.
export function celebrate() {
  try {
    const fire = (particleRatio: number, opts: confetti.Options) => {
      confetti({
        origin: { y: 0.7 },
        spread: 70,
        startVelocity: 45,
        particleCount: Math.floor(180 * particleRatio),
        ...opts,
      });
    };
    fire(0.25, { spread: 30, startVelocity: 55 });
    fire(0.35, { spread: 60 });
    fire(0.25, { spread: 100, decay: 0.91, scalar: 0.9 });
    fire(0.15, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  } catch {
    /* confetti unavailable */
  }
}

// Short haptic tap on supported devices (mobile players).
export function buzzHaptic() {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(40);
    }
  } catch {
    /* no haptics */
  }
}
