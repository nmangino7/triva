'use client';

import { Question, Player, GameState } from '@/app/types';

interface GameViewProps {
  currentQuestion: Question;
  players: Player[];
  gameState: GameState;
  onBuzz: (playerId: string) => void;
  buzzedPlayer: string | null;
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
  onToggleHost,
  questionNumber,
  totalQuestions,
}: GameViewProps) {
  const currentPlayer = buzzedPlayer ? players.find((p) => p.id === buzzedPlayer) : null;
  const isBuzzed = gameState === 'buzzed';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 p-4 flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg font-semibold">
          Question {questionNumber}/{totalQuestions}
        </div>
        <button
          onClick={onToggleHost}
          className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-600 transition text-sm"
        >
          Host View
        </button>
      </div>

      {!isBuzzed ? (
        <>
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 flex-1 flex flex-col justify-center">
            <div className="text-center mb-8">
              <p className="text-gray-500 text-sm mb-2">QUESTION {questionNumber}</p>
              <h2 className="text-3xl font-bold text-gray-800">{currentQuestion.question}</h2>
              <p className="text-gray-500 mt-3 text-sm">{currentQuestion.category}</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            {players.map((player) => (
              <button
                key={player.id}
                onClick={() => onBuzz(player.id)}
                className="flex flex-col items-center gap-2 bg-white rounded-lg p-4 min-w-[100px] hover:shadow-lg transition transform hover:scale-105 active:scale-95"
              >
                <div className="text-2xl font-bold text-blue-600">{player.score}</div>
                <div className="text-sm font-semibold text-gray-800 text-center">{player.name}</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBuzz(player.id);
                  }}
                  className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm font-bold hover:bg-blue-600 transition active:scale-90 w-full"
                >
                  BUZZ
                </button>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="bg-white rounded-lg shadow-2xl p-12 text-center max-w-md">
            <p className="text-gray-500 text-lg mb-2">BUZZED</p>
            <h1 className="text-4xl font-bold text-blue-600 mb-4">{currentPlayer?.name}</h1>
            <p className="text-gray-600 text-lg">Waiting for answer...</p>
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-2">
        {players.map((player, index) => (
          <div
            key={player.id}
            className={`px-4 py-2 rounded-lg text-center font-semibold transition ${
              index === 0 ? 'bg-yellow-400 text-black' : 'bg-white bg-opacity-20 text-white'
            }`}
          >
            {index + 1}. {player.name} - {player.score}
          </div>
        ))}
      </div>
    </div>
  );
}
