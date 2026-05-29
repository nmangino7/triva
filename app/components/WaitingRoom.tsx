'use client';

import { Player } from '@/app/types';

interface WaitingRoomProps {
  players: Player[];
  myName: string;
  onStart: () => void;
}

export default function WaitingRoom({ players, myName, onStart }: WaitingRoomProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">Waiting for players...</h1>
        <p className="text-gray-500 mb-6">Share this page link with everyone</p>

        <div className="bg-gray-50 rounded-xl p-4 mb-6 min-h-[120px]">
          <p className="text-sm text-gray-500 font-semibold mb-3">PLAYERS JOINED ({players.length})</p>
          <div className="space-y-2">
            {players.map((p) => (
              <div
                key={p.id}
                className={`px-4 py-2 rounded-lg font-semibold text-lg ${
                  p.name === myName ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {p.name} {p.name === myName && '(you)'}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onStart}
          disabled={players.length < 1}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold text-xl hover:shadow-lg transition disabled:opacity-40"
        >
          Start Game
        </button>
        <p className="text-gray-400 text-sm mt-3">Anyone can start the game</p>
      </div>
    </div>
  );
}
