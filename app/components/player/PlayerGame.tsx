'use client';

import { useEffect } from 'react';
import { usePlayerGame } from '@/app/hooks/usePlayerGame';
import { Avatar } from '@/app/types';
import { startLobbyMusic, stopLobbyMusic } from '@/app/lib/music';
import PlayerLobby from './PlayerLobby';
import PlayerQuestion from './PlayerQuestion';
import PlayerStandings from './PlayerStandings';
import PlayerResults from './PlayerResults';
import HostLeftScreen from './HostLeftScreen';

export default function PlayerGame({ code, name, avatar }: { code: string; name: string; avatar: Avatar }) {
  const { state, status, hostLeft, myId, myAnswer, buzz, answer } = usePlayerGame(code, name, avatar, true);

  // Lobby music while waiting, stop once the game is underway.
  const inLobby = !state || state.phase === 'lobby';
  useEffect(() => {
    if (inLobby && !hostLeft) startLobbyMusic();
    else stopLobbyMusic();
    return () => stopLobbyMusic();
  }, [inLobby, hostLeft]);

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

  if (!state || state.phase === 'lobby') {
    return <PlayerLobby state={state} name={name} code={code} avatar={avatar} />;
  }

  if (state.phase === 'leaderboard') {
    return <PlayerStandings state={state} myId={myId} />;
  }

  if (state.phase === 'ended') {
    return <PlayerResults state={state} myId={myId} />;
  }

  return <PlayerQuestion state={state} myId={myId} myAnswer={myAnswer} onBuzz={buzz} onAnswer={answer} />;
}
