'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { Channel } from 'pusher-js';
import { createPusherClient } from '@/app/lib/pusher-client';
import { channelName } from '@/app/lib/roomCode';
import { triggerEvent } from '@/app/lib/trigger';
import { EVENT_STATE, EVENT_BUZZ, EVENT_ANSWER } from '@/app/lib/constants';
import type { GameStatePayload, Avatar } from '@/app/types';

type ConnStatus = 'connecting' | 'connected' | 'error';

function getUserId(): string {
  if (typeof window === 'undefined') return 'temp';
  let id = sessionStorage.getItem('trivia-uid');
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : `p-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
    sessionStorage.setItem('trivia-uid', id);
  }
  return id;
}

export function usePlayerGame(code: string, name: string, avatar: Avatar | undefined, enabled: boolean) {
  const [state, setState] = useState<GameStatePayload | null>(null);
  const [status, setStatus] = useState<ConnStatus>('connecting');
  const [hostLeft, setHostLeft] = useState(false);
  const [myAnswer, setMyAnswer] = useState<number | null>(null);
  const meRef = useRef<string>('');
  const hostIdRef = useRef<string | null>(null);
  const lastQuestionRef = useRef<number>(-1);

  useEffect(() => {
    if (!enabled || !code || !name) return;
    const userId = getUserId();
    meRef.current = userId;

    const pusher = createPusherClient({ userId, name, role: 'player', avatar });
    pusher.connection.bind('connected', () => setStatus('connected'));
    pusher.connection.bind('error', () => setStatus('error'));
    pusher.connection.bind('unavailable', () => setStatus('error'));

    const channel: Channel = pusher.subscribe(channelName(code));

    const trackHost = (members: { each: (cb: (m: { id: string; info: { role: string } }) => void) => void }) => {
      members.each((m) => {
        if (m.info?.role === 'host') hostIdRef.current = m.id;
      });
    };

    channel.bind('pusher:subscription_succeeded', (members: { each: (cb: (m: { id: string; info: { role: string } }) => void) => void }) => {
      setStatus('connected');
      trackHost(members);
    });
    channel.bind('pusher:member_added', (m: { id: string; info: { role: string } }) => {
      if (m.info?.role === 'host') {
        hostIdRef.current = m.id;
        setHostLeft(false);
      }
    });
    channel.bind('pusher:member_removed', (m: { id: string }) => {
      if (m.id === hostIdRef.current) setHostLeft(true);
    });

    channel.bind(EVENT_STATE, (data: GameStatePayload) => {
      // Reset my locked-in answer whenever a new question begins.
      if (data.questionNumber !== lastQuestionRef.current) {
        lastQuestionRef.current = data.questionNumber;
        if (data.phase === 'question') setMyAnswer(null);
      }
      setState(data);
      if (data.phase === 'ended') setHostLeft(false);
    });

    return () => {
      try {
        channel.unbind_all();
        pusher.unsubscribe(channelName(code));
        pusher.disconnect();
      } catch {
        /* noop */
      }
    };
  }, [code, name, avatar, enabled]);

  const buzz = useCallback(() => {
    if (!state || state.phase !== 'question' || state.buzzedPlayerId) return;
    triggerEvent(channelName(code), EVENT_BUZZ, { playerId: meRef.current, name, t: Date.now() });
  }, [code, name, state]);

  const answer = useCallback(
    (selectedIndex: number) => {
      if (!state || state.gameMode !== 'tap' || state.phase !== 'question') return;
      if (myAnswer !== null) return;
      setMyAnswer(selectedIndex);
      triggerEvent(channelName(code), EVENT_ANSWER, { playerId: meRef.current, selectedIndex, t: Date.now() });
    },
    [code, state, myAnswer]
  );

  return { state, status, hostLeft, myId: meRef.current, myAnswer, buzz, answer };
}
