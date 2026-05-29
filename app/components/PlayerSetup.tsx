'use client';

import { useState } from 'react';

interface PlayerSetupProps {
  onStart: (playerNames: string[]) => void;
}

export default function PlayerSetup({ onStart }: PlayerSetupProps) {
  const [players, setPlayers] = useState<string[]>(['', '']);

  const addPlayer = () => {
    setPlayers([...players, '']);
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const updatePlayer = (index: number, name: string) => {
    const updated = [...players];
    updated[index] = name;
    setPlayers(updated);
  };

  const handleStart = () => {
    const validPlayers = players.filter((p) => p.trim());
    if (validPlayers.length >= 2) {
      onStart(validPlayers);
    }
  };

  const allFilled = players.filter((p) => p.trim()).length >= 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">Finance Trivia</h1>
        <p className="text-center text-gray-600 mb-8 font-semibold">For Financial Advisors</p>

        <div className="space-y-4 mb-8">
          {players.map((player, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={player}
                onChange={(e) => updatePlayer(index, e.target.value)}
                placeholder={`Player ${index + 1}`}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              {players.length > 2 && (
                <button
                  onClick={() => removePlayer(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={addPlayer}
          className="w-full mb-4 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          + Add Player
        </button>

        <button
          onClick={handleStart}
          disabled={!allFilled}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold text-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Game
        </button>

        <p className="text-center text-gray-600 text-sm mt-4">
          Minimum 2 players required
        </p>
      </div>
    </div>
  );
}
