'use client';

import { Question, Player, GameState } from '@/app/types';

interface GameViewProps {
  currentQuestion: Question;
  players: Player[];
  gameState: GameState;
  onBuzz: () => void;
  buzzedPlayer: string | null;
  myPlayerId: string;
  onToggleHost: () => void;
  questionNumber: number;
  totalQuestions: number;
}

export default function GameView({
  currentQuestion,
  players,
  gameState,
  onBuzz,
  buzzedPlayer,
  myPlayerId,
  onToggleHost,
  questionNumber,
  totalQuestions,
}: GameViewProps) {
  const isBuzzed = gameState === 'buzzed';
  const buzzedName = buzzedPlayer ? players.find((p) => p.id === buzzedPlayer)?.name : null;
  const iMeBuzzed = buzzedPlayer === myPlayerId;
  const canBuzz = gameState === 'playing';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex flex-col p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg font-semibold text-sm">
          Q {questionNumber}/{totalQuestions}
        </div>
        <button
          onClick={onToggleHost}
          className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-500 transition"
        >
          Host Controls
        </button>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 flex-1 flex flex-col justify-center">
        <p className="text-gray-400 text-sm text-center font-semibold mb-2">{currentQuestion.category}</p>
        <h2 className="text-2xl font-bold text-gray-800 text-center">{currentQuestion.question}</h2>

        {/* Options — always visible */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          {currentQuestion.options.map((opt, i) => (
            <div key={i} className="bg-gray-100 rounded-xl p-3 text-center font-semibold text-gray-700">
              <span className="text-blue-500 font-bold">{String.fromCharCode(65 + i)}.</span> {opt}
            </div>
          ))}
        </div>
      </div>

      {/* Buzz status */}
      {isBuzzed && (
        <div className={`rounded-2xl p-5 text-center mb-4 font-bold text-xl ${iMeBuzzed ? 'bg-green-400 text-white' : 'bg-red-100 text-red-700'}`}>
          {iMeBuzzed ? '🎉 You buzzed in!' : `${buzzedName} buzzed in!`}
        </div>
      )}

      {/* MY buzz button */}
      <button
        onClick={onBuzz}
        disabled={!canBuzz}
        className={`w-full py-8 rounded-2xl font-black text-3xl tracking-wide transition-all active:scale-95 shadow-lg ${
          canBuzz
            ? 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700'
            : 'bg-gray-300 text-gray-400 cursor-not-allowed'
        }`}
      >
        {canBuzz ? 'BUZZ' : isBuzzed ? (iMeBuzzed ? 'You buzzed!' : 'Too slow...') : '—'}
      </button>

      {/* Leaderboard */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {players.map((p, i) => (
          <div
            key={p.id}
            className={`px-3 py-2 rounded-xl text-center font-semibold text-sm ${
              p.id === myPlayerId ? 'bg-yellow-300 text-black' : 'bg-white bg-opacity-20 text-white'
            }`}
          >
            {i + 1}. {p.name} — {p.score}
          </div>
        ))}
      </div>
    </div>
  );
}
