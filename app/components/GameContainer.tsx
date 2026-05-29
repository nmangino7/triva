'use client';

import { useState, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Player, GameState } from '@/app/types';
import { questions } from '@/app/data/questions';
import PlayerSetup from './PlayerSetup';
import WaitingRoom from './WaitingRoom';
import GameView from './GameView';
import HostView from './HostView';

export default function GameContainer() {
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [buzzedPlayer, setBuzzedPlayer] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [isHostView, setIsHostView] = useState(false);
  const [myName, setMyName] = useState('');
  const [myId, setMyId] = useState('');
  const [joined, setJoined] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    const socket = io(socketUrl, { reconnection: true });
    socketRef.current = socket;

    socket.on('connect', () => setMyId(socket.id || ''));

    socket.on('game:state', (s: any) => {
      setGameState(s.state);
      setPlayers(s.players);
      setCurrentQuestion(s.currentQuestion);
      setBuzzedPlayer(s.buzzedPlayer);
      setShowAnswers(s.showAnswers);
    });

    socket.on('game:buzz', () => playBuzzSound());

    return () => { socket.disconnect(); };
  }, []);

  const playBuzzSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  };

  const handleJoin = (name: string) => {
    setMyName(name);
    setJoined(true);
    socketRef.current?.emit('player:join', name);
  };

  const handleStart = () => socketRef.current?.emit('game:start');
  const handleBuzz = () => socketRef.current?.emit('player:buzz');
  const handleShowAnswers = () => socketRef.current?.emit('host:showAnswers');
  const handleAnswerResult = (correct: boolean) => socketRef.current?.emit('host:answerResult', correct);
  const handleNextQuestion = () => socketRef.current?.emit('host:nextQuestion');
  const handleReset = () => {
    setJoined(false);
    setMyName('');
    socketRef.current?.emit('game:reset');
  };

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const buzzedPlayerObj = buzzedPlayer ? players.find((p) => p.id === buzzedPlayer) ?? null : null;

  // Not joined yet — show name entry
  if (!joined || (gameState === 'waiting' && !players.find((p) => p.id === myId))) {
    return <PlayerSetup onJoin={handleJoin} />;
  }

  // Waiting room — joined but game not started
  if (gameState === 'waiting') {
    return <WaitingRoom players={players} myName={myName} onStart={handleStart} />;
  }

  // Game over
  if (gameState === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Game Over!</h1>
          <div className="space-y-3 mb-8">
            {sortedPlayers.map((p, i) => (
              <div key={p.id} className={`flex justify-between items-center p-4 rounded-xl ${p.id === myId ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-purple-600">#{i + 1}</span>
                  <span className="font-semibold text-gray-800">{p.name}{p.id === myId ? ' (you)' : ''}</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{p.score}</span>
              </div>
            ))}
          </div>
          <button
            onClick={handleReset}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold text-lg hover:shadow-lg transition"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  // Host view
  if (isHostView) {
    return (
      <HostView
        currentQuestion={questions[currentQuestion]}
        buzzedPlayer={buzzedPlayerObj}
        showAnswers={showAnswers}
        onShowAnswers={handleShowAnswers}
        onAnswerResult={handleAnswerResult}
        onNextQuestion={handleNextQuestion}
        onToggleView={() => setIsHostView(false)}
        players={sortedPlayers}
        questionNumber={currentQuestion + 1}
        totalQuestions={questions.length}
      />
    );
  }

  // Player game view
  return (
    <GameView
      currentQuestion={questions[currentQuestion]}
      players={sortedPlayers}
      gameState={gameState}
      onBuzz={handleBuzz}
      buzzedPlayer={buzzedPlayer}
      myPlayerId={myId}
      onToggleHost={() => setIsHostView(true)}
      questionNumber={currentQuestion + 1}
      totalQuestions={questions.length}
    />
  );
}
