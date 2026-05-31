'use client';

import { GameStatePayload, Avatar as AvatarType } from '@/app/types';
import Roster from '@/app/components/Roster';
import Avatar from '@/app/components/Avatar';
import BrandHeader from '@/app/components/BrandHeader';

export default function PlayerLobby({
  state,
  name,
  code,
  avatar,
}: {
  state: GameStatePayload | null;
  name: string;
  code: string;
  avatar: AvatarType;
}) {
  return (
    <div className="max-w-md mx-auto text-center space-y-6">
      <BrandHeader subtitle={`Room ${code}`} />
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <div className="flex justify-center mb-3 animate-pop-in">
          <Avatar avatar={avatar} size="lg" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">You&apos;re in, {name}!</h2>
        <p className="text-gray-500 mt-1">Waiting for the host to start…</p>
        <div className="mt-4 flex justify-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
      {state && state.players.length > 0 && (
        <Roster names={state.players.map((p) => ({ id: p.id, name: p.name, avatar: p.avatar }))} myId="" />
      )}
    </div>
  );
}
