'use client';

import { useEffect } from 'react';
import { PublicPlayer } from '@/app/types';
import Leaderboard from '@/app/components/Leaderboard';
import Avatar from '@/app/components/Avatar';
import { celebrate } from '@/app/lib/effects';
import { playPodium } from '@/app/lib/sound';

interface Props {
  players: PublicPlayer[];
  onPlayAgain: () => void;
}

// Podium order on the stand: 2nd, 1st, 3rd
const PODIUM_SLOTS = [
  { rank: 2, h: 'h-24', delay: '0ms', medal: '🥈' },
  { rank: 1, h: 'h-36', delay: '300ms', medal: '🥇' },
  { rank: 3, h: 'h-16', delay: '600ms', medal: '🥉' },
];

export default function HostResults({ players, onPlayAgain }: Props) {
  const top3 = players.slice(0, 3);

  useEffect(() => {
    playPodium();
    celebrate();
    const t = setTimeout(celebrate, 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      <h2 className="text-5xl font-black text-white drop-shadow animate-pop-in">🏆 Game Over!</h2>

      {/* Podium */}
      <div className="flex items-end justify-center gap-3 sm:gap-5">
        {PODIUM_SLOTS.map((slot) => {
          const p = top3[slot.rank - 1];
          if (!p) return <div key={slot.rank} className="w-20" />;
          return (
            <div key={slot.rank} className="flex flex-col items-center animate-pop-in" style={{ animationDelay: slot.delay }}>
              <div className="text-3xl mb-1">{slot.medal}</div>
              <Avatar avatar={p.avatar} size="lg" ring />
              <div className="text-white font-bold mt-1 max-w-[6rem] truncate">{p.name}</div>
              <div className="text-yellow-300 font-black text-xl">{p.score}</div>
              <div className={`${slot.h} w-20 sm:w-24 mt-2 rounded-t-xl bg-white/20 flex items-start justify-center pt-2 text-white font-black text-2xl`}>
                {slot.rank}
              </div>
            </div>
          );
        })}
      </div>

      {players.length > 3 && (
        <div className="bg-white/10 rounded-3xl p-6 text-left">
          <Leaderboard players={players} podium />
        </div>
      )}

      <button
        onClick={onPlayAgain}
        className="px-10 py-4 rounded-2xl bg-yellow-300 text-black font-black text-xl shadow-xl hover:bg-yellow-200 hover:scale-105 active:scale-95 transition"
      >
        Play Again (same players)
      </button>
    </div>
  );
}
