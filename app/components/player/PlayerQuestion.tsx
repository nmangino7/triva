'use client';

import { useEffect } from 'react';
import { GameStatePayload } from '@/app/types';
import QuestionCard from '@/app/components/QuestionCard';
import ColorOptionBlock from '@/app/components/ColorOptionBlock';
import Buzzer from '@/app/components/Buzzer';
import CountdownRing from '@/app/components/CountdownRing';
import { playBuzz, playCorrect, playWrong, playReveal, playTap } from '@/app/lib/sound';
import { celebrate, buzzHaptic } from '@/app/lib/effects';

interface Props {
  state: GameStatePayload;
  myId: string;
  myAnswer: number | null;
  onBuzz: () => void;
  onAnswer: (i: number) => void;
}

export default function PlayerQuestion({ state, myId, myAnswer, onBuzz, onAnswer }: Props) {
  const q = state.question;
  const tap = state.gameMode === 'tap';
  const iBuzzed = state.buzzedPlayerId === myId;
  const myCorrect = tap && myAnswer !== null && myAnswer === state.revealCorrectIndex;

  // Reveal sound for everyone; confetti for the player who was right.
  useEffect(() => {
    if (state.phase !== 'reveal') return;
    if (tap) {
      if (myCorrect) {
        playCorrect();
        celebrate();
      } else if (myAnswer !== null) {
        playWrong();
      } else {
        playReveal();
      }
      return;
    }
    if (state.lastAnswerCorrect === true) {
      playCorrect();
      if (iBuzzed) celebrate();
    } else if (state.lastAnswerCorrect === false) {
      playWrong();
    } else {
      playReveal();
    }
  }, [state.phase, state.lastAnswerCorrect, iBuzzed, tap, myCorrect, myAnswer]);

  if (!q) return null;

  const myScore = state.players.find((p) => p.id === myId)?.score ?? 0;
  const someoneElseBuzzed = !!state.buzzedPlayerId && !iBuzzed;
  const canBuzz = state.phase === 'question' && !state.buzzedPlayerId;
  const canTap = state.phase === 'question' && myAnswer === null;

  const handleBuzz = () => {
    playBuzz(900);
    buzzHaptic();
    onBuzz();
  };
  const handleTap = (i: number) => {
    if (!canTap) return;
    playTap();
    buzzHaptic();
    onAnswer(i);
  };

  const blockStatus = (i: number): 'idle' | 'correct' | 'wrong' | 'dim' | 'selected' => {
    if (state.phase === 'reveal') {
      if (i === state.revealCorrectIndex) return 'correct';
      if (tap && myAnswer === i) return 'wrong';
      return 'dim';
    }
    if (tap && myAnswer === i) return 'selected';
    if (tap && myAnswer !== null) return 'dim';
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
          <ColorOptionBlock
            key={i}
            index={i}
            text={opt}
            status={blockStatus(i)}
            onClick={tap ? () => handleTap(i) : undefined}
            disabled={!canTap}
          />
        ))}
      </div>

      {canBuzz && !tap && state.deadline && (
        <div className="flex justify-center">
          <CountdownRing deadline={state.deadline} />
        </div>
      )}

      {tap && state.phase === 'question' && (
        <div className="flex flex-col items-center gap-2">
          {state.deadline && <CountdownRing deadline={state.deadline} />}
          <p className="text-center text-white font-bold">
            {myAnswer === null ? 'Tap your answer!' : `Locked in — ${state.answeredCount}/${state.playerCount} answered`}
          </p>
        </div>
      )}

      {tap && state.phase === 'reveal' && (
        <p className={`animate-pop-in text-center text-xl font-black ${myCorrect ? 'text-emerald-300' : 'text-white'}`}>
          {myAnswer === null ? '⏱️ Out of time!' : myCorrect ? '✅ Correct! Nice and fast.' : '❌ Not this time'}
        </p>
      )}

      {someoneElseBuzzed && state.phase === 'buzzed' && (
        <p className="animate-pop-in text-center text-white text-lg font-bold">🔔 {state.buzzedPlayerName} buzzed first!</p>
      )}
      {iBuzzed && state.phase === 'buzzed' && (
        <p className="animate-pop-in text-center text-yellow-300 text-xl font-black">🎉 You buzzed in — answer out loud!</p>
      )}

      {!tap && <Buzzer disabled={!canBuzz} onBuzz={handleBuzz} label={buzzLabel} />}

      <div className="text-center text-white font-bold text-lg">
        Your score: <span className="text-yellow-300">{myScore}</span>
      </div>
    </div>
  );
}
