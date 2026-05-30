'use client';

import { useState } from 'react';
import JoinForm from '@/app/components/player/JoinForm';
import PlayerGame from '@/app/components/player/PlayerGame';

export default function PlayPage() {
  const [joined, setJoined] = useState<{ code: string; name: string } | null>(null);

  // Allow deep-linking ?code=ABCD to prefill the join form.
  const initialCode =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('code') ?? '' : '';

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 p-6 flex flex-col justify-center">
      <div className="py-6 w-full">
        {joined ? (
          <PlayerGame code={joined.code} name={joined.name} />
        ) : (
          <JoinForm initialCode={initialCode} onJoin={(code, name) => setJoined({ code, name })} />
        )}
      </div>
    </main>
  );
}
