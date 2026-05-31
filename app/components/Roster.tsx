'use client';

import { Avatar as AvatarType } from '@/app/types';
import Avatar from './Avatar';

interface Props {
  names: { id: string; name: string; avatar?: AvatarType }[];
  myId?: string;
}

export default function Roster({ names, myId }: Props) {
  return (
    <div>
      <p className="text-sm font-semibold text-white/70 mb-2 text-center">PLAYERS ({names.length})</p>
      {names.length === 0 ? (
        <p className="text-center text-white/60 text-sm">Waiting for players to join…</p>
      ) : (
        <div className="flex flex-wrap gap-2 justify-center">
          {names.map((n) => (
            <span
              key={n.id}
              className={`animate-pop-in inline-flex items-center gap-2 pl-1 pr-3 py-1 rounded-full font-semibold ${
                n.id === myId ? 'bg-yellow-300 text-black' : 'bg-white/20 text-white'
              }`}
            >
              <Avatar avatar={n.avatar} size="sm" />
              {n.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
