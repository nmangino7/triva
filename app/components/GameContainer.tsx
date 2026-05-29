'use client';

import { useState, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Player, GameState } from '@/app/types';
import { questions } from '@/app/data/questions';
import PlayerSetup from './PlayerSetup';
import GameView from './GameView';
import HostView from './HostView';

export default function GameContainer() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [buzzedPlayer, setBuzzedPlayer] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [isHostView, setIsHostView] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const [playerId, setPlayerId] = useState<string>('');

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    const socket = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;
    setPlayerId(socket.id || '');

    socket.on('game:state', (newState: any) => {
      setGameState(newState.state);
      setPlayers(newState.players);
      setCurrentQuestion(newState.currentQuestion);
      setBuzzedPlayer(newState.buzzedPlayer);
      setShowAnswers(newState.showAnswers);
    });

    socket.on('game:buzz', (playerName: string) => {
      playBuzzSound();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const playBuzzSound = () => {
    if (typeof window !== 'undefined') {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  };

  const handleStartGame = (playerNames: string[]) => {
    if (socketRef.current) {
      socketRef.current.emit('game:start', playerNames);
    }
  };

  const handleBuzz = () => {
    if (socketRef.current && gameState === 'playing') {
      socketRef.current.emit('player:buzz');
    }
  };

  const handleShowAnswers = () => {
    if (socketRef.current) {
      socketRef.current.emit('host:showAnswers');
    }
  };

  const handleAnswerResult = (correct: boolean) => {
    if (socketRef.current) {
      socketRef.current.emit('host:answerResult', correct);
    }
  };

  const handleNextQuestion = () => {
    if (socketRef.current) {
      socketRef.current.emit('host:nextQuestion');
    }
  };

  const resetGame = () => {
    if (socketRef.current) {
      socketRef.current.emit('game:reset');
    }
  };

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const currentBuzzedPlayer = buzzedPlayer ? players.find((p) => p.id === buzzedPlayer) ?? null : null;

  if (gameState === 'setup') {
    return <PlayerSetup onStart={handleStartGame} />;
  }

  if (gameState === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Game Over!</h1>
          <div className="space-y-4 mb-8">
            {sortedPlayers.map((player, index) => (
              <div key={player.id} className="flex justify-between items-center bg-gray-100 p-4 rounded">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-purple-600">#{index + 1}</span>
                  <span className="text-lg font-semibold text-gray-800">{player.name}</span>
                </div>
                <span className="text-3xl font-bold text-blue-600">{player.score}</span>
              </div>
            ))}
          </div>
          <button
            onClick={resetGame}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold text-lg hover:shadow-lg transition"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return isHostView ? (
    <HostView
      currentQuestion={questions[currentQuestion]}
      buzzedPlayer={currentBuzzedPlayer}
      showAnswers={showAnswers}
      onShowAnswers={handleShowAnswers}
      onAnswerResult={handleAnswerResult}
      onNextQuestion={handleNextQuestion}
      onToggleView={() => setIsHostView(false)}
      players={sortedPlayers}
      questionNumber={currentQuestion + 1}
      totalQuestions={questions.length}
    />
  ) : (
    <GameView
      currentQuestion={questions[currentQuestion]}
      players={sortedPlayers}
      gameState={gameState}
      onBuzz={handleBuzz}
      buzzedPlayer={buzzedPlayer}
      onToggleHost={() => setIsHostView(true)}
      questionNumber={currentQuestion + 1}
      totalQuestions={questions.length}
    />
  );
}
