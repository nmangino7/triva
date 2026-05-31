'use client';

import { useEffect, useState } from 'react';
import JoinForm from '@/app/components/player/JoinForm';
import PlayerGame from '@/app/components/player/PlayerGame';
import MuteToggle from '@/app/components/MuteToggle';
import { Avatar } from '@/app/types';

export default function PlayPage() {
  const [joined, setJoined] = useState<{ code: string; name: string; avatar: Avatar } | null>(null);
  const [initialCode, setInitialCode] = useState('');

  // Read ?code=ABCD after mount so SSR and first client render match.
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get('code');
    if (c) setInitialCode(c);
  }, []);

  return (
    <main className="animated-bg min-h-screen bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 p-6 flex flex-col justify-center">
      <div className="fixed top-4 right-4 z-50">
        <MuteToggle />
      </div>
      <div className="py-6 w-full">
        {joined ? (
          <PlayerGame code={joined.code} name={joined.name} avatar={joined.avatar} />
        ) : (
          <JoinForm initialCode={initialCode} onJoin={(code, name, avatar) => setJoined({ code, name, avatar })} />
        )}
      </div>
    </main>
  );
}
