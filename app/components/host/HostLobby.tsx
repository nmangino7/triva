'use client';

import { HostGameState, PublicPlayer } from '@/app/types';
import RoomCodeBadge from '@/app/components/RoomCodeBadge';
import Roster from '@/app/components/Roster';
import { getCategory } from '@/app/lib/categories';

interface Props {
  state: HostGameState;
  players: PublicPlayer[];
  onStart: () => void;
}

export default function HostLobby({ state, players, onStart }: Props) {
  const cat = getCategory(state.category);
  const joinUrl = typeof window !== 'undefined' ? `${window.location.origin}/play` : '/play';

  return (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      <div className="bg-white/10 rounded-3xl p-8 space-y-6">
        <p className="text-white/80 font-semibold text-lg">
          {cat?.emoji} {cat?.label} round
        </p>
        <RoomCodeBadge code={state.code} />
        <p className="text-white/70">
          Players go to <span className="font-bold text-white">{joinUrl}</span> and enter this code.
        </p>
      </div>

      <Roster names={players.map((p) => ({ id: p.id, name: p.name }))} />

      <button
        onClick={onStart}
        disabled={players.length < 1}
        className="w-full sm:w-auto px-12 py-4 rounded-2xl bg-yellow-300 text-black font-black text-2xl shadow-xl hover:bg-yellow-200 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Start Game
      </button>
      {players.length < 1 && <p className="text-white/60 text-sm">Waiting for at least one player…</p>}
    </div>
  );
}
