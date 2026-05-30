'use client';

import { useState } from 'react';
import { normalizeCode } from '@/app/lib/roomCode';
import { ROOM_CODE_LENGTH } from '@/app/lib/constants';
import BrandHeader from '@/app/components/BrandHeader';

interface Props {
  initialCode?: string;
  onJoin: (code: string, name: string) => void;
}

export default function JoinForm({ initialCode = '', onJoin }: Props) {
  const [code, setCode] = useState(normalizeCode(initialCode));
  const [name, setName] = useState('');

  const ready = code.length === ROOM_CODE_LENGTH && name.trim().length > 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ready) onJoin(code, name.trim());
  };

  return (
    <div className="max-w-sm mx-auto">
      <BrandHeader subtitle="Join the game" />
      <form onSubmit={submit} className="bg-white rounded-3xl shadow-2xl p-8 space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-500 mb-1">ROOM CODE</label>
          <input
            value={code}
            onChange={(e) => setCode(normalizeCode(e.target.value))}
            placeholder="ABCD"
            autoCapitalize="characters"
            className="w-full px-4 py-3 text-center text-3xl font-black tracking-[0.4em] border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 uppercase"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-500 mb-1">YOUR NAME</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 20))}
            placeholder="Enter your name"
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={!ready}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-black text-lg hover:shadow-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Join Game
        </button>
      </form>
    </div>
  );
}
