'use client';

import { useEffect } from 'react';
import { GameStatePayload } from '@/app/types';
import Leaderboard from '@/app/components/Leaderboard';
import { playStandings } from '@/app/lib/sound';

export default function PlayerStandings({ state, myId }: { state: GameStatePayload; myId: string }) {
  const myRank = state.players.findIndex((p) => p.id === myId) + 1;

  useEffect(() => {
    playStandings();
  }, []);

  return (
    <div className="max-w-md mx-auto text-center space-y-5">
      <h2 className="text-3xl font-black text-white drop-shadow animate-pop-in">Standings</h2>
      {myRank > 0 && (
        <p className="text-lg text-yellow-300 font-bold">
          You&apos;re #{myRank} of {state.players.length}
        </p>
      )}
      <div className="bg-white/10 rounded-3xl p-5">
        <Leaderboard players={state.players} myId={myId} showDelta />
      </div>
      <p className="text-white/70">Next question coming up…</p>
    </div>
  );
}
