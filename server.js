const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

app.use(cors());

let gameState = {
  state: 'waiting',
  players: [],
  currentQuestion: 0,
  buzzedPlayer: null,
  showAnswers: false,
};

io.on('connection', (socket) => {
  // Send current state to new connection
  socket.emit('game:state', gameState);

  socket.on('player:join', (playerName) => {
    // Don't allow joining mid-game
    if (gameState.state !== 'waiting') return;

    // Prevent duplicate joins
    const exists = gameState.players.find((p) => p.id === socket.id);
    if (!exists) {
      gameState.players.push({ id: socket.id, name: playerName, score: 0 });
    }
    io.emit('game:state', gameState);
  });

  socket.on('game:start', () => {
    if (gameState.players.length < 1) return;
    gameState.state = 'playing';
    gameState.currentQuestion = 0;
    gameState.buzzedPlayer = null;
    gameState.showAnswers = false;
    io.emit('game:state', gameState);
  });

  socket.on('player:buzz', () => {
    if (gameState.state === 'playing' && !gameState.buzzedPlayer) {
      const player = gameState.players.find((p) => p.id === socket.id);
      if (player) {
        gameState.buzzedPlayer = socket.id;
        gameState.state = 'buzzed';
        io.emit('game:state', gameState);
        io.emit('game:buzz', player.name);
      }
    }
  });

  socket.on('host:showAnswers', () => {
    gameState.showAnswers = true;
    io.emit('game:state', gameState);
  });

  socket.on('host:answerResult', (correct) => {
    if (gameState.buzzedPlayer && correct) {
      const idx = gameState.players.findIndex((p) => p.id === gameState.buzzedPlayer);
      if (idx !== -1) gameState.players[idx].score += 10;
    }
    gameState.buzzedPlayer = null;
    gameState.showAnswers = false;
    gameState.state = 'playing';
    io.emit('game:state', gameState);
  });

  socket.on('host:nextQuestion', () => {
    if (gameState.currentQuestion < 19) {
      gameState.currentQuestion += 1;
      gameState.buzzedPlayer = null;
      gameState.showAnswers = false;
      gameState.state = 'playing';
    } else {
      gameState.state = 'finished';
    }
    io.emit('game:state', gameState);
  });

  socket.on('game:reset', () => {
    gameState = {
      state: 'waiting',
      players: [],
      currentQuestion: 0,
      buzzedPlayer: null,
      showAnswers: false,
    };
    io.emit('game:state', gameState);
  });

  socket.on('disconnect', () => {
    gameState.players = gameState.players.filter((p) => p.id !== socket.id);
    if (gameState.buzzedPlayer === socket.id) {
      gameState.buzzedPlayer = null;
      gameState.state = 'playing';
    }
    io.emit('game:state', gameState);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Socket.io server running on port ${PORT}`));
