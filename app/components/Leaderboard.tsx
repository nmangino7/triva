'use client';

import { PublicPlayer } from '@/app/types';

interface Props {
  players: PublicPlayer[];
  myId?: string;
  podium?: boolean;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export default function Leaderboard({ players, myId, podium }: Props) {
  if (players.length === 0) {
    return <p className="text-center text-white/70">No players yet…</p>;
  }
  return (
    <div className="space-y-2">
      {players.map((p, i) => (
        <div
          key={p.id}
          className={`flex items-center justify-between rounded-xl px-4 py-3 font-semibold transition ${
            p.id === myId
              ? 'bg-yellow-300 text-black'
              : i === 0 && podium
              ? 'bg-white text-gray-900'
              : 'bg-white/15 text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl w-7 text-center">{podium && MEDALS[i] ? MEDALS[i] : i + 1}</span>
            <span className="truncate max-w-[10rem]">{p.name}{p.id === myId ? ' (you)' : ''}</span>
          </div>
          <span className="text-xl font-bold tabular-nums">{p.score}</span>
        </div>
      ))}
    </div>
  );
}
