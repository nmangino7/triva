'use client';

import { useEffect, useRef } from 'react';
import { HostGameState, PublicPlayer } from '@/app/types';
import QuestionCard from '@/app/components/QuestionCard';
import ColorOptionBlock from '@/app/components/ColorOptionBlock';
import Leaderboard from '@/app/components/Leaderboard';
import CountdownRing from '@/app/components/CountdownRing';
import { playBuzz, playCorrect, playWrong, playReveal } from '@/app/lib/sound';
import { celebrate } from '@/app/lib/effects';

interface Props {
  state: HostGameState;
  players: PublicPlayer[];
  isLast: boolean;
  optionTally: number[] | null;
  answeredCount: number;
  playerCount: number;
  onReveal: () => void;
  onJudge: (correct: boolean) => void;
  onReopen: () => void;
  onToStandings: () => void;
  onNext: () => void;
}

export default function HostQuestion({
  state,
  players,
  isLast,
  optionTally,
  answeredCount,
  playerCount,
  onReveal,
  onJudge,
  onReopen,
  onToStandings,
  onNext,
}: Props) {
  const q = state.questions[state.index];
  const tap = state.gameMode === 'tap';
  const lastBuzzed = useRef<string | null>(null);

  useEffect(() => {
    if (state.buzzedPlayerId && state.buzzedPlayerId !== lastBuzzed.current) {
      lastBuzzed.current = state.buzzedPlayerId;
      playBuzz();
    }
    if (!state.buzzedPlayerId) lastBuzzed.current = null;
  }, [state.buzzedPlayerId]);

  useEffect(() => {
    if (state.phase !== 'reveal') return;
    if (tap) {
      const gotIt = optionTally && q ? optionTally[q.correct] > 0 : false;
      if (gotIt) {
        celebrate();
        playCorrect();
      } else {
        playReveal();
      }
      return;
    }
    if (state.lastAnswerCorrect === true) {
      celebrate();
      playCorrect();
    } else if (state.lastAnswerCorrect === false) {
      playWrong();
    } else {
      playReveal();
    }
  }, [state.phase, state.lastAnswerCorrect, tap, optionTally, q]);

  if (!q) return null;

  const blockStatus = (i: number): 'idle' | 'correct' | 'dim' => {
    if (state.phase === 'reveal') return i === q.correct ? 'correct' : 'dim';
    return 'idle';
  };

  const correctCount = optionTally ? optionTally[q.correct] : 0;

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
          <ColorOptionBlock
            key={i}
            index={i}
            text={opt}
            status={blockStatus(i)}
            tally={tap && state.phase === 'reveal' && optionTally ? optionTally[i] : undefined}
          />
        ))}
      </div>

      <div className="bg-white/10 rounded-2xl p-5 space-y-4">
        {state.phase === 'question' && (
          <>
            <div className="flex flex-col items-center gap-2">
              {state.deadline && <CountdownRing deadline={state.deadline} />}
              <p className="text-center text-white text-lg font-semibold">
                {tap ? `${answeredCount} / ${playerCount} answered` : 'Waiting for someone to buzz…'}
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={onReveal} className="px-5 py-2 rounded-xl bg-white/20 text-white font-semibold hover:bg-white/30">
                {tap ? 'Reveal now' : 'Reveal answer'}
              </button>
            </div>
          </>
        )}

        {state.phase === 'buzzed' && !tap && (
          <>
            <p className="animate-pop-in text-center text-yellow-300 text-2xl font-black">🔔 {state.buzzedPlayerName} buzzed in!</p>
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
              {tap
                ? `${correctCount} of ${playerCount} got it right`
                : state.lastAnswerCorrect === true
                ? `✅ ${state.buzzedPlayerName} got it! +10`
                : state.lastAnswerCorrect === false
                ? '❌ No points'
                : `Answer: ${q.options[q.correct]}`}
            </p>
            <div className="flex justify-center">
              <button
                onClick={isLast ? onNext : onToStandings}
                className="px-8 py-3 rounded-xl bg-yellow-300 text-black font-black text-lg hover:bg-yellow-200 active:scale-95"
              >
                {isLast ? 'See Results →' : 'Standings →'}
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
