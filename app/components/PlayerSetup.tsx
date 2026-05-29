'use client';

import { useState } from 'react';

interface PlayerSetupProps {
  onJoin: (name: string) => void;
}

export default function PlayerSetup({ onJoin }: PlayerSetupProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onJoin(name.trim());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-sm w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-1">Finance Trivia</h1>
        <p className="text-gray-500 mb-8 font-semibold">For Financial Advisors</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            autoFocus
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold text-lg hover:shadow-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Join Game
          </button>
        </form>
      </div>
    </div>
  );
}
