'use client';

import { PublicPlayer } from '@/app/types';
import Leaderboard from '@/app/components/Leaderboard';

interface Props {
  players: PublicPlayer[];
  onPlayAgain: () => void;
}

export default function HostResults({ players, onPlayAgain }: Props) {
  const winner = players[0];
  return (
    <div className="max-w-xl mx-auto text-center space-y-6">
      <h2 className="text-5xl font-black text-white drop-shadow">🏆 Game Over!</h2>
      {winner && (
        <p className="text-2xl text-yellow-300 font-bold">
          {winner.name} wins with {winner.score} points!
        </p>
      )}
      <div className="bg-white/10 rounded-3xl p-6">
        <Leaderboard players={players} podium />
      </div>
      <button
        onClick={onPlayAgain}
        className="px-10 py-4 rounded-2xl bg-yellow-300 text-black font-black text-xl shadow-xl hover:bg-yellow-200 active:scale-95 transition"
      >
        Play Again (same players)
      </button>
    </div>
  );
}
