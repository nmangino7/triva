'use client';

import { GameStatePayload } from '@/app/types';
import QuestionCard from '@/app/components/QuestionCard';
import ColorOptionBlock from '@/app/components/ColorOptionBlock';
import Buzzer from '@/app/components/Buzzer';
import { playBuzz } from '@/app/lib/sound';

interface Props {
  state: GameStatePayload;
  myId: string;
  onBuzz: () => void;
}

export default function PlayerQuestion({ state, myId, onBuzz }: Props) {
  const q = state.question;
  if (!q) return null;

  const myScore = state.players.find((p) => p.id === myId)?.score ?? 0;
  const iBuzzed = state.buzzedPlayerId === myId;
  const someoneElseBuzzed = !!state.buzzedPlayerId && !iBuzzed;
  const canBuzz = state.phase === 'question' && !state.buzzedPlayerId;

  const handleBuzz = () => {
    playBuzz(900);
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

      {someoneElseBuzzed && state.phase === 'buzzed' && (
        <p className="text-center text-white text-lg font-bold">🔔 {state.buzzedPlayerName} buzzed first!</p>
      )}
      {iBuzzed && state.phase === 'buzzed' && (
        <p className="text-center text-yellow-300 text-xl font-black">🎉 You buzzed in — answer out loud!</p>
      )}

      <Buzzer disabled={!canBuzz} onBuzz={handleBuzz} label={buzzLabel} />

      <div className="text-center text-white font-bold text-lg">
        Your score: <span className="text-yellow-300">{myScore}</span>
      </div>
    </div>
  );
}
