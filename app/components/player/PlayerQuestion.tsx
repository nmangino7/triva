'use client';

import { useEffect } from 'react';
import { GameStatePayload } from '@/app/types';
import QuestionCard from '@/app/components/QuestionCard';
import ColorOptionBlock from '@/app/components/ColorOptionBlock';
import Buzzer from '@/app/components/Buzzer';
import CountdownRing from '@/app/components/CountdownRing';
import { playBuzz, playCorrect, playWrong, playReveal } from '@/app/lib/sound';
import { celebrate, buzzHaptic } from '@/app/lib/effects';

interface Props {
  state: GameStatePayload;
  myId: string;
  onBuzz: () => void;
}

export default function PlayerQuestion({ state, myId, onBuzz }: Props) {
  const q = state.question;
  const iBuzzed = state.buzzedPlayerId === myId;

  // Reveal sound for everyone; confetti only for the player who got it right.
  useEffect(() => {
    if (state.phase !== 'reveal') return;
    if (state.lastAnswerCorrect === true) {
      playCorrect();
      if (iBuzzed) celebrate();
    } else if (state.lastAnswerCorrect === false) {
      playWrong();
    } else {
      playReveal();
    }
  }, [state.phase, state.lastAnswerCorrect, iBuzzed]);

  if (!q) return null;

  const myScore = state.players.find((p) => p.id === myId)?.score ?? 0;
  const someoneElseBuzzed = !!state.buzzedPlayerId && !iBuzzed;
  const canBuzz = state.phase === 'question' && !state.buzzedPlayerId;

  const handleBuzz = () => {
    playBuzz(900);
    buzzHaptic();
    onBuzz();
  };

  const blockStatus = (i: number): 'idle' | 'correct' | 'dim' => {
    if (state.phase === 'reveal' && state.revealCorrectIndex !== null) {
      return i === state.revealCorrectIndex ? 'correct' : 'dim';
    }
    return 'idle';
  };

  let buzzLabel = 'BUZZ';
  if (iBuzzed) buzzLabel = 'YOU!';
  else if (someoneElseBuzzed) buzzLabel = state.buzzedPlayerName ?? 'BUZZED';
  else if (state.phase === 'reveal') buzzLabel = '—';

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <QuestionCard
        text={q.text}
        category={q.category}
        difficulty={q.difficulty}
        questionNumber={state.questionNumber}
        totalQuestions={state.totalQuestions}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {q.options.map((opt, i) => (
          <ColorOptionBlock key={i} index={i} text={opt} status={blockStatus(i)} />
        ))}
      </div>

      {canBuzz && state.deadline && (
        <div className="flex justify-center">
          <CountdownRing deadline={state.deadline} />
        </div>
      )}

      {someoneElseBuzzed && state.phase === 'buzzed' && (
        <p className="animate-pop-in text-center text-white text-lg font-bold">🔔 {state.buzzedPlayerName} buzzed first!</p>
      )}
      {iBuzzed && state.phase === 'buzzed' && (
        <p className="animate-pop-in text-center text-yellow-300 text-xl font-black">🎉 You buzzed in — answer out loud!</p>
      )}

      <Buzzer disabled={!canBuzz} onBuzz={handleBuzz} label={buzzLabel} />

      <div className="text-center text-white font-bold text-lg">
        Your score: <span className="text-yellow-300">{myScore}</span>
      </div>
    </div>
  );
}
