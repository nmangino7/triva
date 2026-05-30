'use client';

import { usePlayerGame } from '@/app/hooks/usePlayerGame';
import PlayerLobby from './PlayerLobby';
import PlayerQuestion from './PlayerQuestion';
import PlayerResults from './PlayerResults';
import HostLeftScreen from './HostLeftScreen';

export default function PlayerGame({ code, name }: { code: string; name: string }) {
  const { state, status, hostLeft, myId, buzz } = usePlayerGame(code, name, true);

  if (hostLeft) return <HostLeftScreen />;

  if (status === 'error') {
    return (
      <div className="max-w-md mx-auto text-center space-y-4">
        <div className="text-5xl">📡</div>
        <h2 className="text-2xl font-black text-white">Connection trouble</h2>
        <p className="text-white/80">Couldn&apos;t reach the game. Check your internet and refresh.</p>
        <a href="/play" className="inline-block px-6 py-2 rounded-xl bg-white text-gray-900 font-bold">Try again</a>
      </div>
    );
  }

  // Connected but no state yet, or game hasn't started → lobby.
  if (!state || state.phase === 'lobby') {
    return <PlayerLobby state={state} name={name} code={code} />;
  }

  if (state.phase === 'ended') {
    return <PlayerResults state={state} myId={myId} />;
  }

  return <PlayerQuestion state={state} myId={myId} onBuzz={buzz} />;
}
