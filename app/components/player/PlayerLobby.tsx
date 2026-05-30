'use client';

import { GameStatePayload } from '@/app/types';
import Roster from '@/app/components/Roster';
import BrandHeader from '@/app/components/BrandHeader';

export default function PlayerLobby({ state, name, code }: { state: GameStatePayload | null; name: string; code: string }) {
  return (
    <div className="max-w-md mx-auto text-center space-y-6">
      <BrandHeader subtitle={`Room ${code}`} />
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <div className="text-6xl mb-3 animate-pop-in">✅</div>
        <h2 className="text-2xl font-black text-gray-900">You&apos;re in, {name}!</h2>
        <p className="text-gray-500 mt-1">Waiting for the host to start…</p>
        <div className="mt-4 flex justify-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
      {state && state.players.length > 0 && (
        <Roster names={state.players.map((p) => ({ id: p.id, name: p.name }))} />
      )}
    </div>
  );
}
