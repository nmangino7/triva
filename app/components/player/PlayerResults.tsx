'use client';

import { GameStatePayload } from '@/app/types';
import Leaderboard from '@/app/components/Leaderboard';

export default function PlayerResults({ state, myId }: { state: GameStatePayload; myId: string }) {
  const myRank = state.players.findIndex((p) => p.id === myId) + 1;
  return (
    <div className="max-w-md mx-auto text-center space-y-6">
      <h2 className="text-4xl font-black text-white drop-shadow">🏆 Final Scores</h2>
      {myRank > 0 && (
        <p className="text-xl text-yellow-300 font-bold">
          You finished #{myRank} of {state.players.length}!
        </p>
      )}
      <div className="bg-white/10 rounded-3xl p-6">
        <Leaderboard players={state.players} myId={myId} podium />
      </div>
      <p className="text-white/70">Waiting for the host to start another round…</p>
    </div>
  );
}
