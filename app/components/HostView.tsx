'use client';

import { Question, Player } from '@/app/types';

interface HostViewProps {
  currentQuestion: Question;
  buzzedPlayer: Player | null;
  showAnswers: boolean;
  onShowAnswers: () => void;
  onAnswerResult: (correct: boolean) => void;
  onNextQuestion: () => void;
  onToggleView: () => void;
  players: Player[];
  questionNumber: number;
  totalQuestions: number;
}

export default function HostView({
  currentQuestion,
  buzzedPlayer,
  showAnswers,
  onShowAnswers,
  onAnswerResult,
  onNextQuestion,
  onToggleView,
  players,
  questionNumber,
  totalQuestions,
}: HostViewProps) {
  const correctAnswer = currentQuestion.options[currentQuestion.correct];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 p-4 flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg font-semibold">
          HOST • Question {questionNumber}/{totalQuestions}
        </div>
        <button
          onClick={onToggleView}
          className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-yellow-600 transition text-sm"
        >
          Player View
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-6 flex-1">
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm mb-2">QUESTION {questionNumber}</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{currentQuestion.question}</h2>
          <div className="flex gap-2 justify-center mb-6">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
              {currentQuestion.category}
            </span>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold capitalize">
              {currentQuestion.difficulty}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg text-center font-semibold text-lg transition ${
                showAnswers && index === currentQuestion.correct
                  ? 'bg-green-500 text-white ring-4 ring-green-300'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {String.fromCharCode(65 + index)}: {option}
            </div>
          ))}
        </div>

        {buzzedPlayer && (
          <div className="mb-6 p-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg text-center">
            <p className="text-yellow-800 font-semibold text-lg">
              {buzzedPlayer.name} buzzed in! ({buzzedPlayer.score} points)
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6">
        {!showAnswers ? (
          <button
            onClick={onShowAnswers}
            className="bg-green-500 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-600 transition"
          >
            Reveal Answer
          </button>
        ) : (
          <>
            <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4 text-center">
              <p className="text-green-800 font-semibold text-lg">
                Correct Answer: <span className="text-2xl">{correctAnswer}</span>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onAnswerResult(true)}
                className="bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
              >
                ✓ Correct
              </button>
              <button
                onClick={() => onAnswerResult(false)}
                className="bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition"
              >
                ✕ Incorrect
              </button>
            </div>
          </>
        )}
      </div>

      {showAnswers && (
        <button
          onClick={onNextQuestion}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition"
        >
          Next Question →
        </button>
      )}

      <div className="mt-6 grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto">
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
