'use client';

import { useEffect, useState } from 'react';
import { isMuted, toggleMuted, subscribeMuted } from '@/app/lib/audioSettings';

export default function MuteToggle() {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(isMuted());
    return subscribeMuted(() => setMuted(isMuted()));
  }, []);

  return (
    <button
      onClick={() => setMuted(toggleMuted())}
      aria-label={muted ? 'Unmute' : 'Mute'}
      title={muted ? 'Unmute' : 'Mute'}
      className="w-10 h-10 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 transition text-lg"
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
