'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { Channel } from 'pusher-js';
import { createPusherClient } from '@/app/lib/pusher-client';
import { channelName } from '@/app/lib/roomCode';
import { getCategory, shuffle } from '@/app/lib/categories';
import { triggerEvent } from '@/app/lib/trigger';
import { EVENT_STATE, EVENT_BUZZ, POINTS_PER_CORRECT, QUESTIONS_PER_GAME } from '@/app/lib/constants';
import type {
  HostGameState,
  GameStatePayload,
  BuzzPayload,
  RoomMember,
} from '@/app/types';

function buildPayload(s: HostGameState): GameStatePayload {
  const q = s.questions[s.index];
  const showQuestion = s.phase !== 'lobby' && s.phase !== 'ended' && !!q;
  const players = s.members
    .filter((m) => m.role === 'player')
    .map((m) => ({ id: m.id, name: m.name, score: s.scores[m.id] ?? 0 }))
    .sort((a, b) => b.score - a.score);
  return {
    phase: s.phase,
    category: getCategory(s.category)?.label ?? s.category,
    questionNumber: s.index + 1,
    totalQuestions: s.questions.length,
    question: showQuestion
      ? { id: q.id, text: q.question, options: q.options, category: q.category, difficulty: q.difficulty }
      : null,
    buzzedPlayerId: s.buzzedPlayerId,
    buzzedPlayerName: s.buzzedPlayerName,
    revealCorrectIndex: s.phase === 'reveal' && q ? q.correct : null,
    lastAnswerCorrect: s.lastAnswerCorrect,
    players,
  };
}

export function useHostGame(code: string, categoryId: string) {
  const stateRef = useRef<HostGameState | null>(null);
  const channelRef = useRef<Channel | null>(null);
  const [state, setState] = useState<HostGameState | null>(null);

  // Push the latest state to React + broadcast the player-safe payload.
  const commit = useCallback((next: HostGameState) => {
    stateRef.current = next;
    setState(next);
    triggerEvent(channelName(next.code), EVENT_STATE, buildPayload(next));
  }, []);

  useEffect(() => {
    const cat = getCategory(categoryId);
    const questions = shuffle(cat ? cat.questions : []).slice(0, QUESTIONS_PER_GAME);
    const hostId =
      typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `host-${Date.now()}`;

    const initial: HostGameState = {
      code,
      category: categoryId,
      questions,
      index: 0,
      phase: 'lobby',
      buzzedPlayerId: null,
      buzzedPlayerName: null,
      lastAnswerCorrect: null,
      scores: {},
      members: [],
    };
    stateRef.current = initial;
    setState(initial);

    const pusher = createPusherClient({ userId: hostId, name: 'Host', role: 'host' });
    const channel = pusher.subscribe(channelName(code));
    channelRef.current = channel;

    const syncMembers = () => {
      const members: RoomMember[] = [];
      // @ts-expect-error pusher-js members typing
      channel.members.each((m: { id: string; info: { name: string; role: string } }) => {
        members.push({ id: m.id, name: m.info?.name ?? 'Player', role: m.info?.role === 'host' ? 'host' : 'player' });
      });
      const cur = stateRef.current!;
      commit({ ...cur, members });
    };

    channel.bind('pusher:subscription_succeeded', syncMembers);

    channel.bind('pusher:member_added', () => {
      // Rebuild roster, then rebroadcast so the newcomer syncs immediately.
      syncMembers();
    });

    channel.bind('pusher:member_removed', (m: { id: string }) => {
      const cur = stateRef.current!;
      const members = cur.members.filter((x) => x.id !== m.id);
      let patch: Partial<HostGameState> = { members };
      // If the player who was buzzed left, reopen the question.
      if (cur.buzzedPlayerId === m.id && cur.phase === 'buzzed') {
        patch = { ...patch, buzzedPlayerId: null, buzzedPlayerName: null, phase: 'question' };
      }
      commit({ ...cur, ...patch });
    });

    // A player buzzed. First buzz while the question is open wins.
    channel.bind(EVENT_BUZZ, (data: BuzzPayload) => {
      const cur = stateRef.current!;
      if (cur.phase !== 'question' || cur.buzzedPlayerId) return;
      commit({ ...cur, phase: 'buzzed', buzzedPlayerId: data.playerId, buzzedPlayerName: data.name });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, categoryId]);

  // ---- Host actions ----
  const startGame = useCallback(() => {
    const cur = stateRef.current;
    if (!cur) return;
    commit({ ...cur, phase: 'question', index: 0, buzzedPlayerId: null, buzzedPlayerName: null, lastAnswerCorrect: null });
  }, [commit]);

  const reveal = useCallback(() => {
    const cur = stateRef.current;
    if (!cur) return;
    commit({ ...cur, phase: 'reveal' });
  }, [commit]);

  const judge = useCallback((correct: boolean) => {
    const cur = stateRef.current;
    if (!cur) return;
    const scores = { ...cur.scores };
    if (correct && cur.buzzedPlayerId) {
      scores[cur.buzzedPlayerId] = (scores[cur.buzzedPlayerId] ?? 0) + POINTS_PER_CORRECT;
    }
    commit({ ...cur, phase: 'reveal', lastAnswerCorrect: correct, scores });
  }, [commit]);

  // Let a wrong buzzer pass — reopen buzzing without revealing.
  const reopen = useCallback(() => {
    const cur = stateRef.current;
    if (!cur) return;
    commit({ ...cur, phase: 'question', buzzedPlayerId: null, buzzedPlayerName: null });
  }, [commit]);

  const next = useCallback(() => {
    const cur = stateRef.current;
    if (!cur) return;
    if (cur.index >= cur.questions.length - 1) {
      commit({ ...cur, phase: 'ended' });
    } else {
      commit({ ...cur, index: cur.index + 1, phase: 'question', buzzedPlayerId: null, buzzedPlayerName: null, lastAnswerCorrect: null });
    }
  }, [commit]);

  const playAgain = useCallback(() => {
    const cur = stateRef.current;
    if (!cur) return;
    const cat = getCategory(cur.category);
    const freshQuestions = shuffle(cat ? cat.questions : cur.questions).slice(0, QUESTIONS_PER_GAME);
    commit({ ...cur, questions: freshQuestions, index: 0, phase: 'lobby', buzzedPlayerId: null, buzzedPlayerName: null, lastAnswerCorrect: null, scores: {} });
  }, [commit]);

  const players = state
    ? state.members.filter((m) => m.role === 'player').map((m) => ({ id: m.id, name: m.name, score: state.scores[m.id] ?? 0 })).sort((a, b) => b.score - a.score)
    : [];

  return { state, players, actions: { startGame, reveal, judge, reopen, next, playAgain } };
}
