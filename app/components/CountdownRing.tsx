'use client';

import { useEffect, useRef, useState } from 'react';
import { QUESTION_SECONDS, COUNTDOWN_TICK_SECONDS } from '@/app/lib/constants';
import { playTick } from '@/app/lib/sound';

// Smooth local countdown derived from a shared epoch-ms deadline.
export default function CountdownRing({ deadline }: { deadline: number }) {
  const [now, setNow] = useState(() => Date.now());
  const lastTick = useRef<number>(-1);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, []);

  const remainingMs = Math.max(0, deadline - now);
  const seconds = Math.ceil(remainingMs / 1000);

  // Tick once per second in the final stretch.
  useEffect(() => {
    if (seconds > 0 && seconds <= COUNTDOWN_TICK_SECONDS && seconds !== lastTick.current) {
      lastTick.current = seconds;
      playTick();
    }
  }, [seconds]);
  const fraction = Math.max(0, Math.min(1, remainingMs / (QUESTION_SECONDS * 1000)));

  const size = 76;
  const stroke = 7;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - fraction);

  const urgent = seconds <= 5;
  const color = urgent ? '#f87171' : '#fde047';

  return (
    <div className={`relative ${urgent ? 'animate-shake' : ''}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.2)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.1s linear, stroke 0.3s' }}
        />
      </svg>
      <span
        className={`absolute inset-0 flex items-center justify-center font-black text-2xl ${urgent ? 'text-red-300' : 'text-white'}`}
      >
        {seconds}
      </span>
    </div>
  );
}
