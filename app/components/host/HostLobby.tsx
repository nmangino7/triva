'use client';

import { HostGameState, PublicPlayer } from '@/app/types';
import RoomCodeBadge from '@/app/components/RoomCodeBadge';
import Roster from '@/app/components/Roster';
import QrJoin from '@/app/components/QrJoin';
import { getCategory } from '@/app/lib/categories';

interface Props {
  state: HostGameState;
  players: PublicPlayer[];
  onStart: () => void;
}

export default function HostLobby({ state, players, onStart }: Props) {
  const cat = getCategory(state.category);
  const joinUrl = typeof window !== 'undefined' ? `${window.location.host}/play` : '/play';

  return (
    <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in-up">
      <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-5 py-2 text-white font-bold text-lg">
        <span className="text-2xl">{cat?.emoji}</span> {cat?.label} round
      </div>

      <div className="bg-white/10 backdrop-blur rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-center gap-8">
        <div className="space-y-4">
          <RoomCodeBadge code={state.code} />
          <p className="text-white/70 max-w-xs">
            Go to <span className="font-bold text-white">{joinUrl}</span> and enter the code — or scan
            the QR with your phone camera.
          </p>
        </div>
        <QrJoin code={state.code} />
      </div>

      <Roster names={players.map((p) => ({ id: p.id, name: p.name }))} />

      <button
        onClick={onStart}
        disabled={players.length < 1}
        className="w-full sm:w-auto px-14 py-4 rounded-2xl bg-yellow-300 text-black font-black text-2xl shadow-xl hover:bg-yellow-200 hover:scale-105 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        Start Game 🚀
      </button>
      {players.length < 1 && <p className="text-white/60 text-sm">Waiting for at least one player…</p>}
    </div>
  );
}
