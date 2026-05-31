'use client';

import { useEffect } from 'react';
import { useHostGame } from '@/app/hooks/useHostGame';
import { startLobbyMusic, stopLobbyMusic } from '@/app/lib/music';
import HostLobby from './HostLobby';
import HostQuestion from './HostQuestion';
import HostStandings from './HostStandings';
import HostResults from './HostResults';

export default function HostGame({ code, categoryId }: { code: string; categoryId: string }) {
  const { state, players, isLast, actions } = useHostGame(code, categoryId);

  const inLobby = !state || state.phase === 'lobby';
  useEffect(() => {
    if (inLobby) startLobbyMusic();
    else stopLobbyMusic();
    return () => stopLobbyMusic();
  }, [inLobby]);

  if (!state) {
    return <p className="text-center text-white/80">Setting up room…</p>;
  }

  if (state.phase === 'lobby') {
    return <HostLobby state={state} players={players} onStart={actions.startGame} />;
  }

  if (state.phase === 'leaderboard') {
    return (
      <HostStandings
        players={players}
        questionNumber={state.index + 1}
        totalQuestions={state.questions.length}
        onNext={actions.next}
      />
    );
  }

  if (state.phase === 'ended') {
    return <HostResults players={players} onPlayAgain={actions.playAgain} />;
  }

  const optionTally =
    state.phase === 'reveal' && state.gameMode === 'tap'
      ? [0, 1, 2, 3].map((i) => Object.values(state.answers).filter((a) => a.idx === i).length)
      : null;

  return (
    <HostQuestion
      state={state}
      players={players}
      isLast={isLast}
      optionTally={optionTally}
      answeredCount={Object.keys(state.answers).length}
      playerCount={players.length}
      onReveal={actions.reveal}
      onJudge={actions.judge}
      onReopen={actions.reopen}
      onToStandings={actions.toStandings}
      onNext={actions.next}
    />
  );
}
