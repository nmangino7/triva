'use client';

import { useState } from 'react';
import { CATEGORIES } from '@/app/lib/categories';
import { generateRoomCode } from '@/app/lib/roomCode';
import BrandHeader from '@/app/components/BrandHeader';
import HostGame from '@/app/components/host/HostGame';

export default function HostPage() {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [code, setCode] = useState('');

  const pick = (id: string) => {
    setCode(generateRoomCode());
    setCategoryId(id);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-700 p-6">
      <div className="py-6">
        {!categoryId ? (
          <div className="max-w-3xl mx-auto">
            <BrandHeader subtitle="Pick a category to host" />
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => pick(c.id)}
                  className={`text-left rounded-3xl p-6 shadow-xl bg-gradient-to-br ${c.color} text-white hover:scale-[1.02] active:scale-95 transition`}
                >
                  <div className="text-4xl mb-2">{c.emoji}</div>
                  <h2 className="text-2xl font-black">{c.label}</h2>
                  <p className="text-white/85">{c.blurb}</p>
                  <p className="text-white/70 text-sm mt-2">{c.questions.length} questions</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <HostGame code={code} categoryId={categoryId} />
        )}
      </div>
    </main>
  );
}
