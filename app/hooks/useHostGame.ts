'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { Channel } from 'pusher-js';
import { createPusherClient } from '@/app/lib/pusher-client';
import { channelName } from '@/app/lib/roomCode';
import { getCategory, pickQuestions } from '@/app/lib/categories';
import { triggerEvent } from '@/app/lib/trigger';
import {
  EVENT_STATE,
  EVENT_BUZZ,
  EVENT_ANSWER,
  POINTS_PER_CORRECT,
  SPEED_BONUS_MAX,
  QUESTION_SECONDS,
} from '@/app/lib/constants';
import type {
  HostGameState,
  GameStatePayload,
  BuzzPayload,
  AnswerPayload,
  RoomMember,
  GameMode,
  DifficultyFilter,
} from '@/app/types';

const newDeadline = () => Date.now() + QUESTION_SECONDS * 1000;

function playerMembers(s: HostGameState): RoomMember[] {
  return s.members.filter((m) => m.role === 'player');
}

function buildPayload(s: HostGameState): GameStatePayload {
  const q = s.questions[s.index];
  const showQuestion = s.phase === 'question' || s.phase === 'buzzed' || s.phase === 'reveal';
  const players = playerMembers(s)
    .map((m) => ({ id: m.id, name: m.name, score: s.scores[m.id] ?? 0, avatar: m.avatar, delta: s.deltas[m.id] ?? 0 }))
    .sort((a, b) => b.score - a.score);
  const tally =
    s.phase === 'reveal' && s.gameMode === 'tap'
      ? [0, 1, 2, 3].map((i) => Object.values(s.answers).filter((a) => a.idx === i).length)
      : null;
  return {
    phase: s.phase,
    category: getCategory(s.category)?.label ?? s.category,
    gameMode: s.gameMode,
    questionNumber: s.index + 1,
    totalQuestions: s.questions.length,
    question: showQuestion && q
      ? { id: q.id, text: q.question, options: q.options, category: q.category, difficulty: q.difficulty }
      : null,
    buzzedPlayerId: s.buzzedPlayerId,
    buzzedPlayerName: s.buzzedPlayerName,
    revealCorrectIndex: s.phase === 'reveal' && q ? q.correct : null,
    lastAnswerCorrect: s.lastAnswerCorrect,
    deadline: s.deadline,
    answeredCount: Object.keys(s.answers).length,
    playerCount: playerMembers(s).length,
    optionTally: tally,
    players,
  };
}

// Score every tap answer for the current question (tap mode).
function applyTapScoring(cur: HostGameState): HostGameState {
  const q = cur.questions[cur.index];
  const scores = { ...cur.scores };
  const deltas: Record<string, number> = {};
  const streaks = { ...cur.streaks };
  const total = QUESTION_SECONDS * 1000;
  for (const [pid, a] of Object.entries(cur.answers)) {
    if (q && a.idx === q.correct) {
      const bonus = Math.round((SPEED_BONUS_MAX * Math.max(0, a.ms)) / total);
      const gained = POINTS_PER_CORRECT + bonus;
      scores[pid] = (scores[pid] ?? 0) + gained;
      deltas[pid] = gained;
      streaks[pid] = (streaks[pid] ?? 0) + 1;
    } else {
      streaks[pid] = 0;
    }
  }
  return { ...cur, scores, deltas, streaks, phase: 'reveal', lastAnswerCorrect: null, deadline: null };
}

export function useHostGame(code: string, categoryId: string) {
  const stateRef = useRef<HostGameState | null>(null);
  const [state, setState] = useState<HostGameState | null>(null);

  const commit = useCallback((next: HostGameState) => {
    stateRef.current = next;
    setState(next);
    triggerEvent(channelName(next.code), EVENT_STATE, buildPayload(next));
  }, []);

  useEffect(() => {
    const hostId =
      typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `host-${Date.now()}`;

    const initial: HostGameState = {
      code,
      category: categoryId,
      gameMode: 'buzzer',
      difficultyFilter: 'all',
      questions: [],
      index: 0,
      phase: 'lobby',
      buzzedPlayerId: null,
      buzzedPlayerName: null,
      lastAnswerCorrect: null,
      deadline: null,
      answers: {},
      scores: {},
      deltas: {},
      streaks: {},
      members: [],
    };
    stateRef.current = initial;
    setState(initial);

    const pusher = createPusherClient({ userId: hostId, name: 'Host', role: 'host' });
    const channel = pusher.subscribe(channelName(code));

    const syncMembers = () => {
      const members: RoomMember[] = [];
      // @ts-expect-error pusher-js members typing
      channel.members.each((m: { id: string; info: { name: string; role: string; avatar?: { color: string; emoji: string } } }) => {
        members.push({
          id: m.id,
          name: m.info?.name ?? 'Player',
          role: m.info?.role === 'host' ? 'host' : 'player',
          avatar: m.info?.avatar,
        });
      });
      const cur = stateRef.current!;
      commit({ ...cur, members });
    };

    channel.bind('pusher:subscription_succeeded', syncMembers);
    channel.bind('pusher:member_added', syncMembers);

    channel.bind('pusher:member_removed', (m: { id: string }) => {
      const cur = stateRef.current!;
      const members = cur.members.filter((x) => x.id !== m.id);
      let nextState: HostGameState = { ...cur, members };
      // Buzzer: the buzzed player left — reopen with a fresh timer.
      if (cur.buzzedPlayerId === m.id && cur.phase === 'buzzed') {
        nextState = { ...nextState, buzzedPlayerId: null, buzzedPlayerName: null, phase: 'question', deadline: newDeadline() };
      }
      // Tap: if everyone remaining has now answered, advance.
      if (cur.gameMode === 'tap' && cur.phase === 'question') {
        const ids = members.filter((x) => x.role === 'player').map((x) => x.id);
        if (ids.length > 0 && ids.every((id) => nextState.answers[id] !== undefined)) {
          nextState = applyTapScoring(nextState);
        }
      }
      commit(nextState);
    });

    // Buzzer: first buzz while open wins.
    channel.bind(EVENT_BUZZ, (data: BuzzPayload) => {
      const cur = stateRef.current!;
      if (cur.gameMode !== 'buzzer' || cur.phase !== 'question' || cur.buzzedPlayerId) return;
      commit({ ...cur, phase: 'buzzed', buzzedPlayerId: data.playerId, buzzedPlayerName: data.name, deadline: null });
    });

    // Tap: record first answer; auto-advance when all present players answered.
    channel.bind(EVENT_ANSWER, (data: AnswerPayload) => {
      const cur = stateRef.current!;
      if (cur.gameMode !== 'tap' || cur.phase !== 'question') return;
      if (cur.answers[data.playerId] !== undefined) return;
      if (data.selectedIndex < 0 || data.selectedIndex > 3) return;
      const ms = cur.deadline ? Math.max(0, cur.deadline - Date.now()) : 0;
      const answers = { ...cur.answers, [data.playerId]: { idx: data.selectedIndex, ms } };
      const ids = playerMembers(cur).map((p) => p.id);
      const allAnswered = ids.length > 0 && ids.every((id) => answers[id] !== undefined);
      commit(allAnswered ? applyTapScoring({ ...cur, answers }) : { ...cur, answers });
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

  // Auto-reveal when the countdown expires.
  useEffect(() => {
    if (!state || state.phase !== 'question' || !state.deadline) return;
    const ms = Math.max(0, state.deadline - Date.now());
    const id = setTimeout(() => {
      const cur = stateRef.current;
      if (!cur || cur.phase !== 'question') return;
      if (cur.gameMode === 'tap') {
        commit(applyTapScoring(cur));
      } else if (!cur.buzzedPlayerId) {
        commit({ ...cur, phase: 'reveal', lastAnswerCorrect: null, deadline: null });
      }
    }, ms);
    return () => clearTimeout(id);
  }, [state, commit]);

  // ---- Host actions ----
  const startGame = useCallback((opts: { gameMode: GameMode; difficultyFilter: DifficultyFilter }) => {
    const cur = stateRef.current;
    if (!cur) return;
    const questions = pickQuestions(cur.category, opts.difficultyFilter);
    commit({
      ...cur,
      gameMode: opts.gameMode,
      difficultyFilter: opts.difficultyFilter,
      questions,
      index: 0,
      phase: 'question',
      buzzedPlayerId: null,
      buzzedPlayerName: null,
      lastAnswerCorrect: null,
      answers: {},
      deltas: {},
      streaks: {},
      deadline: newDeadline(),
    });
  }, [commit]);

  const reveal = useCallback(() => {
    const cur = stateRef.current;
    if (!cur) return;
    commit({ ...cur, phase: 'reveal', deadline: null });
  }, [commit]);

  const judge = useCallback((correct: boolean) => {
    const cur = stateRef.current;
    if (!cur) return;
    const scores = { ...cur.scores };
    const deltas: Record<string, number> = {};
    if (correct && cur.buzzedPlayerId) {
      scores[cur.buzzedPlayerId] = (scores[cur.buzzedPlayerId] ?? 0) + POINTS_PER_CORRECT;
      deltas[cur.buzzedPlayerId] = POINTS_PER_CORRECT;
    }
    commit({ ...cur, phase: 'reveal', lastAnswerCorrect: correct, scores, deltas, deadline: null });
  }, [commit]);

  const reopen = useCallback(() => {
    const cur = stateRef.current;
    if (!cur) return;
    commit({ ...cur, phase: 'question', buzzedPlayerId: null, buzzedPlayerName: null, deadline: newDeadline() });
  }, [commit]);

  // reveal -> standings (between-question scoreboard)
  const toStandings = useCallback(() => {
    const cur = stateRef.current;
    if (!cur) return;
    commit({ ...cur, phase: 'leaderboard', deadline: null });
  }, [commit]);

  // advance to next question, or end the game
  const next = useCallback(() => {
    const cur = stateRef.current;
    if (!cur) return;
    if (cur.index >= cur.questions.length - 1) {
      commit({ ...cur, phase: 'ended', deadline: null });
    } else {
      commit({
        ...cur,
        index: cur.index + 1,
        phase: 'question',
        buzzedPlayerId: null,
        buzzedPlayerName: null,
        lastAnswerCorrect: null,
        answers: {},
        deltas: {},
        deadline: newDeadline(),
      });
    }
  }, [commit]);

  const playAgain = useCallback(() => {
    const cur = stateRef.current;
    if (!cur) return;
    const questions = pickQuestions(cur.category, cur.difficultyFilter);
    commit({
      ...cur,
      questions,
      index: 0,
      phase: 'lobby',
      buzzedPlayerId: null,
      buzzedPlayerName: null,
      lastAnswerCorrect: null,
      answers: {},
      scores: {},
      deltas: {},
      streaks: {},
      deadline: null,
    });
  }, [commit]);

  const players = state
    ? playerMembers(state)
        .map((m) => ({ id: m.id, name: m.name, score: state.scores[m.id] ?? 0, avatar: m.avatar, delta: state.deltas[m.id] ?? 0 }))
        .sort((a, b) => b.score - a.score)
    : [];

  const isLast = state ? state.index >= state.questions.length - 1 : false;

  return { state, players, isLast, actions: { startGame, reveal, judge, reopen, toStandings, next, playAgain } };
}
