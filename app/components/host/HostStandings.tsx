'use client';

import { useEffect } from 'react';
import { PublicPlayer } from '@/app/types';
import Leaderboard from '@/app/components/Leaderboard';
import { playStandings } from '@/app/lib/sound';

interface Props {
  players: PublicPlayer[];
  questionNumber: number;
  totalQuestions: number;
  onNext: () => void;
}

export default function HostStandings({ players, questionNumber, totalQuestions, onNext }: Props) {
  useEffect(() => {
    playStandings();
  }, []);

  return (
    <div className="max-w-2xl mx-auto text-center space-y-6">
      <h2 className="text-4xl font-black text-white drop-shadow animate-pop-in">Standings</h2>
      <p className="text-white/70 font-semibold">After question {questionNumber} of {totalQuestions}</p>
      <div className="bg-white/10 rounded-3xl p-6">
        <Leaderboard players={players} podium showDelta />
      </div>
      <button
        onClick={onNext}
        className="px-12 py-4 rounded-2xl bg-yellow-300 text-black font-black text-2xl shadow-xl hover:bg-yellow-200 hover:scale-105 active:scale-95 transition"
      >
        Next Question →
      </button>
    </div>
  );
}
