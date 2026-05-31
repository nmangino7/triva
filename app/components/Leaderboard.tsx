'use client';

import { PublicPlayer } from '@/app/types';
import Avatar from './Avatar';

interface Props {
  players: PublicPlayer[];
  myId?: string;
  podium?: boolean;
  showDelta?: boolean;
}

const MEDALS = ['🥇', '🥈', '🥉'];

export default function Leaderboard({ players, myId, podium, showDelta }: Props) {
  if (players.length === 0) {
    return <p className="text-center text-white/70">No players yet…</p>;
  }
  return (
    <div className="space-y-2">
      {players.map((p, i) => (
        <div
          key={p.id}
          style={{ animationDelay: `${i * 60}ms` }}
          className={`animate-fade-in-up flex items-center justify-between rounded-xl px-4 py-3 font-semibold transition ${
            p.id === myId
              ? 'bg-yellow-300 text-black'
              : i === 0 && podium
              ? 'bg-white text-gray-900'
              : 'bg-white/15 text-white'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xl w-7 text-center shrink-0">{podium && MEDALS[i] ? MEDALS[i] : i + 1}</span>
            <Avatar avatar={p.avatar} size="sm" />
            <span className="truncate">{p.name}{p.id === myId ? ' (you)' : ''}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {showDelta && p.delta ? (
              <span className="animate-score-pop text-emerald-300 font-bold text-sm">+{p.delta}</span>
            ) : null}
            <span className="text-xl font-bold tabular-nums">{p.score}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
