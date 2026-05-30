'use client';

import { useHostGame } from '@/app/hooks/useHostGame';
import HostLobby from './HostLobby';
import HostQuestion from './HostQuestion';
import HostResults from './HostResults';

export default function HostGame({ code, categoryId }: { code: string; categoryId: string }) {
  const { state, players, actions } = useHostGame(code, categoryId);

  if (!state) {
    return <p className="text-center text-white/80">Setting up room…</p>;
  }

  if (state.phase === 'lobby') {
    return <HostLobby state={state} players={players} onStart={actions.startGame} />;
  }

  if (state.phase === 'ended') {
    return <HostResults players={players} onPlayAgain={actions.playAgain} />;
  }

  return (
    <HostQuestion
      state={state}
      players={players}
      onReveal={actions.reveal}
      onJudge={actions.judge}
      onReopen={actions.reopen}
      onNext={actions.next}
    />
  );
}
