'use client';

import { useEffect, useRef } from 'react';
import { HostGameState, PublicPlayer } from '@/app/types';
import QuestionCard from '@/app/components/QuestionCard';
import ColorOptionBlock from '@/app/components/ColorOptionBlock';
import Leaderboard from '@/app/components/Leaderboard';
import { playBuzz } from '@/app/lib/sound';

interface Props {
  state: HostGameState;
  players: PublicPlayer[];
  onReveal: () => void;
  onJudge: (correct: boolean) => void;
  onReopen: () => void;
  onNext: () => void;
}

export default function HostQuestion({ state, players, onReveal, onJudge, onReopen, onNext }: Props) {
  const q = state.questions[state.index];
  const lastBuzzed = useRef<string | null>(null);

  // Beep when a new buzz arrives.
  useEffect(() => {
    if (state.buzzedPlayerId && state.buzzedPlayerId !== lastBuzzed.current) {
      lastBuzzed.current = state.buzzedPlayerId;
      playBuzz();
    }
    if (!state.buzzedPlayerId) lastBuzzed.current = null;
  }, [state.buzzedPlayerId]);

  if (!q) return null;

  const blockStatus = (i: number): 'idle' | 'correct' | 'dim' => {
    if (state.phase === 'reveal') return i === q.correct ? 'correct' : 'dim';
    return 'idle';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <QuestionCard
        text={q.question}
        category={q.category}
        difficulty={q.difficulty}
        questionNumber={state.index + 1}
        totalQuestions={state.questions.length}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {q.options.map((opt, i) => (
          <ColorOptionBlock key={i} index={i} text={opt} status={blockStatus(i)} />
        ))}
      </div>

      {/* Host control bar */}
      <div className="bg-white/10 rounded-2xl p-5 space-y-4">
        {state.phase === 'question' && (
          <>
            <p className="text-center text-white text-lg font-semibold animate-pulse">Waiting for someone to buzz…</p>
            <div className="flex gap-3 justify-center">
              <button onClick={onReveal} className="px-5 py-2 rounded-xl bg-white/20 text-white font-semibold hover:bg-white/30">
                Reveal answer
              </button>
              <button onClick={onNext} className="px-5 py-2 rounded-xl bg-white/20 text-white font-semibold hover:bg-white/30">
                Skip →
              </button>
            </div>
          </>
        )}

        {state.phase === 'buzzed' && (
          <>
            <p className="text-center text-yellow-300 text-2xl font-black">🔔 {state.buzzedPlayerName} buzzed in!</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => onJudge(true)} className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold text-lg hover:bg-emerald-400 active:scale-95">
                ✓ Correct
              </button>
              <button onClick={onReopen} className="px-6 py-3 rounded-xl bg-rose-500 text-white font-bold text-lg hover:bg-rose-400 active:scale-95">
                ✗ Wrong — reopen
              </button>
            </div>
            <p className="text-center text-white/50 text-sm">Answer: {q.options[q.correct]}</p>
          </>
        )}

        {state.phase === 'reveal' && (
          <>
            <p className="text-center text-white text-xl font-bold">
              {state.lastAnswerCorrect === true && `✅ ${state.buzzedPlayerName} got it! +10`}
              {state.lastAnswerCorrect === false && '❌ No points'}
              {state.lastAnswerCorrect === null && `Answer: ${q.options[q.correct]}`}
            </p>
            <div className="flex justify-center">
              <button onClick={onNext} className="px-8 py-3 rounded-xl bg-yellow-300 text-black font-black text-lg hover:bg-yellow-200 active:scale-95">
                {state.index >= state.questions.length - 1 ? 'See Results →' : 'Next Question →'}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="bg-white/5 rounded-2xl p-4">
        <Leaderboard players={players} />
      </div>
    </div>
  );
}
