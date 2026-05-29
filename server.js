const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

let gameState = {
  state: 'setup', // setup, playing, buzzed, answered, finished
  players: [],
  currentQuestion: 0,
  buzzedPlayer: null,
  showAnswers: false,
};

let playerSessions = {};

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  socket.emit('game:state', gameState);

  socket.on('player:join', (playerName) => {
    const newPlayer = {
      id: socket.id,
      name: playerName,
      score: 0,
      buzzed: false,
    };

    gameState.players.push(newPlayer);
    playerSessions[socket.id] = playerName;

    console.log(`${playerName} joined. Total players: ${gameState.players.length}`);
    io.emit('game:state', gameState);
  });

  socket.on('game:start', (playerNames) => {
    gameState.state = 'playing';
    gameState.players = playerNames.map((name, i) => ({
      id: `player-${i}`,
      name,
      score: 0,
      buzzed: false,
    }));
    gameState.currentQuestion = 0;
    gameState.buzzedPlayer = null;
    gameState.showAnswers = false;

    io.emit('game:state', gameState);
  });

  socket.on('player:buzz', () => {
    if (gameState.state === 'playing' && !gameState.buzzedPlayer) {
      const playerIndex = gameState.players.findIndex((p) => p.id === socket.id);
      if (playerIndex !== -1) {
        gameState.buzzedPlayer = socket.id;
        gameState.state = 'buzzed';
        io.emit('game:state', gameState);
        io.emit('game:buzz', gameState.players[playerIndex].name);
      }
    }
  });

  socket.on('host:showAnswers', () => {
    gameState.showAnswers = true;
    io.emit('game:state', gameState);
  });

  socket.on('host:answerResult', (correct) => {
    if (gameState.buzzedPlayer) {
      const playerIndex = gameState.players.findIndex((p) => p.id === gameState.buzzedPlayer);
      if (playerIndex !== -1 && correct) {
        gameState.players[playerIndex].score += 10;
      }
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
      state: 'setup',
      players: [],
      currentQuestion: 0,
      buzzedPlayer: null,
      showAnswers: false,
    };
    io.emit('game:state', gameState);
  });

  socket.on('disconnect', () => {
    const playerName = playerSessions[socket.id];
    delete playerSessions[socket.id];
    gameState.players = gameState.players.filter((p) => p.id !== socket.id);
    console.log(`${playerName} disconnected. Remaining players: ${gameState.players.length}`);
    io.emit('game:state', gameState);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
