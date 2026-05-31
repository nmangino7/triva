'use client';

import { useState } from 'react';
import { HostGameState, PublicPlayer, GameMode, DifficultyFilter } from '@/app/types';
import RoomCodeBadge from '@/app/components/RoomCodeBadge';
import Roster from '@/app/components/Roster';
import QrJoin from '@/app/components/QrJoin';
import { getCategory, availableCount } from '@/app/lib/categories';

interface Props {
  state: HostGameState;
  players: PublicPlayer[];
  onStart: (opts: { gameMode: GameMode; difficultyFilter: DifficultyFilter }) => void;
}

const MODES: { key: GameMode; label: string; hint: string }[] = [
  { key: 'buzzer', label: '🔔 Buzzer', hint: 'Race to buzz, answer out loud, host scores' },
  { key: 'tap', label: '📱 Tap to Answer', hint: 'Everyone taps on their phone — auto-scored' },
];
const DIFFS: { key: DifficultyFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'easy', label: 'Easy' },
  { key: 'medium', label: 'Medium' },
  { key: 'hard', label: 'Hard' },
];

export default function HostLobby({ state, players, onStart }: Props) {
  const cat = getCategory(state.category);
  const [mode, setMode] = useState<GameMode>('buzzer');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all');
  const joinUrl = typeof window !== 'undefined' ? `${window.location.host}/play` : '/play';
  const count = availableCount(state.category, difficulty);
  const modeHint = MODES.find((m) => m.key === mode)?.hint;

  return (
    <div className="max-w-3xl mx-auto text-center space-y-7 animate-fade-in-up">
      <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-5 py-2 text-white font-bold text-lg">
        <span className="text-2xl">{cat?.emoji}</span> {cat?.label} round
      </div>

      <div className="bg-white/10 backdrop-blur rounded-3xl p-7 flex flex-col sm:flex-row items-center justify-center gap-8">
        <div className="space-y-4">
          <RoomCodeBadge code={state.code} />
          <p className="text-white/70 max-w-xs">
            Go to <span className="font-bold text-white">{joinUrl}</span> and enter the code — or scan the QR.
          </p>
        </div>
        <QrJoin code={state.code} />
      </div>

      <Roster names={players.map((p) => ({ id: p.id, name: p.name, avatar: p.avatar }))} />

      {/* Mode selector */}
      <div className="space-y-2">
        <p className="text-white/70 font-semibold text-sm">GAME MODE</p>
        <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
          {MODES.map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`rounded-2xl p-4 font-bold transition ${
                mode === m.key ? 'bg-yellow-300 text-black scale-[1.02]' : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="text-white/60 text-sm">{modeHint}</p>
      </div>

      {/* Difficulty selector */}
      <div className="space-y-2">
        <p className="text-white/70 font-semibold text-sm">DIFFICULTY</p>
        <div className="inline-flex rounded-2xl bg-white/10 p-1 gap-1">
          {DIFFS.map((d) => (
            <button
              key={d.key}
              onClick={() => setDifficulty(d.key)}
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                difficulty === d.key ? 'bg-white text-gray-900' : 'text-white hover:bg-white/10'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
        <p className="text-white/60 text-sm">{count} questions this round</p>
      </div>

      <button
        onClick={() => onStart({ gameMode: mode, difficultyFilter: difficulty })}
        disabled={players.length < 1}
        className="w-full sm:w-auto px-14 py-4 rounded-2xl bg-yellow-300 text-black font-black text-2xl shadow-xl hover:bg-yellow-200 hover:scale-105 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        Start Game 🚀
      </button>
      {players.length < 1 && <p className="text-white/60 text-sm">Waiting for at least one player…</p>}
    </div>
  );
}
