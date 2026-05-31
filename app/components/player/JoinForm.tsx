'use client';

import { useEffect, useState } from 'react';
import { normalizeCode } from '@/app/lib/roomCode';
import {
  ROOM_CODE_LENGTH,
  AVATAR_COLORS,
  AVATAR_EMOJIS,
  AVATAR_COLOR_CLASS,
  LS_PLAYER_NAME,
  LS_PLAYER_AVATAR,
  LS_SEEN_HELP,
} from '@/app/lib/constants';
import { Avatar } from '@/app/types';
import BrandHeader from '@/app/components/BrandHeader';

interface Props {
  initialCode?: string;
  onJoin: (code: string, name: string, avatar: Avatar) => void;
}

function randomAvatar(): Avatar {
  return {
    color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    emoji: AVATAR_EMOJIS[Math.floor(Math.random() * AVATAR_EMOJIS.length)],
  };
}

export default function JoinForm({ initialCode = '', onJoin }: Props) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  // Deterministic default avoids SSR/client hydration mismatch; randomized after mount.
  const [avatar, setAvatar] = useState<Avatar>({ color: AVATAR_COLORS[0], emoji: AVATAR_EMOJIS[0] });
  const [returning, setReturning] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [customize, setCustomize] = useState(false);

  // Sync prefilled code once the parent reads it from the URL.
  useEffect(() => {
    if (initialCode) setCode((c) => (c ? c : normalizeCode(initialCode)));
  }, [initialCode]);

  // Restore remembered identity for one-tap rejoin (client-only).
  useEffect(() => {
    try {
      const savedName = localStorage.getItem(LS_PLAYER_NAME);
      const savedAvatar = localStorage.getItem(LS_PLAYER_AVATAR);
      if (savedName) {
        setName(savedName);
        setReturning(true);
      }
      setAvatar(savedAvatar ? JSON.parse(savedAvatar) : randomAvatar());
      if (!localStorage.getItem(LS_SEEN_HELP)) setShowHelp(true);
    } catch {
      setAvatar(randomAvatar());
    }
  }, []);

  const ready = code.length === ROOM_CODE_LENGTH && name.trim().length > 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    try {
      localStorage.setItem(LS_PLAYER_NAME, name.trim());
      localStorage.setItem(LS_PLAYER_AVATAR, JSON.stringify(avatar));
    } catch {
      /* ignore */
    }
    onJoin(code, name.trim(), avatar);
  };

  const dismissHelp = () => {
    setShowHelp(false);
    try {
      localStorage.setItem(LS_SEEN_HELP, '1');
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      <BrandHeader subtitle="Join the game" />

      {showHelp && (
        <div className="bg-white/15 text-white rounded-2xl p-4 mb-4 text-sm animate-fade-in-up">
          <p className="font-bold mb-1">How it works</p>
          <ol className="list-decimal list-inside space-y-0.5 text-white/90">
            <li>Enter the room code (or scan the QR).</li>
            <li>Pick a name & avatar.</li>
            <li>Buzz in or tap your answer — fastest correct wins!</li>
          </ol>
          <button onClick={dismissHelp} className="mt-2 text-yellow-300 font-semibold">Got it ✕</button>
        </div>
      )}

      <form onSubmit={submit} className="bg-white rounded-3xl shadow-2xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-500 mb-1">ROOM CODE</label>
          <input
            value={code}
            onChange={(e) => setCode(normalizeCode(e.target.value))}
            placeholder="ABCD"
            autoCapitalize="characters"
            autoFocus={!initialCode}
            className="w-full px-4 py-3 text-center text-3xl font-black tracking-[0.4em] border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 uppercase"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-500 mb-1">
            {returning ? 'WELCOME BACK 👋' : 'YOUR NAME'}
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 20))}
            placeholder="Enter your name"
            autoFocus={!!initialCode && !name}
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Avatar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-gray-500">YOUR AVATAR</label>
            <button type="button" onClick={() => setCustomize((c) => !c)} className="text-sm font-semibold text-blue-600">
              {customize ? 'Done' : 'Change'}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-2xl shadow ${
                AVATAR_COLOR_CLASS[avatar.color] ?? 'bg-gray-400'
              }`}
            >
              {avatar.emoji}
            </span>
            {!customize && <span className="text-gray-500 text-sm">Tap “Change” to customize</span>}
          </div>

          {customize && (
            <div className="mt-3 space-y-3">
              <div className="grid grid-cols-8 gap-1.5">
                {AVATAR_EMOJIS.map((e) => (
                  <button
                    type="button"
                    key={e}
                    onClick={() => setAvatar((a) => ({ ...a, emoji: e }))}
                    className={`text-xl rounded-lg p-1 ${avatar.emoji === e ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-gray-100'}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {AVATAR_COLORS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setAvatar((a) => ({ ...a, color: c }))}
                    className={`w-7 h-7 rounded-full ${AVATAR_COLOR_CLASS[c]} ${
                      avatar.color === c ? 'ring-2 ring-offset-2 ring-gray-700' : ''
                    }`}
                    aria-label={c}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!ready}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-black text-lg hover:shadow-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {returning ? `Join as ${name || 'me'}` : 'Join Game'}
        </button>
      </form>
    </div>
  );
}
