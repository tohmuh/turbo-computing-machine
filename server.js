const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname)));

let gameState = {
    drawnNumbers: [],
    isPlaying: false
};

io.on('connection', (socket) => {
    console.log(`A phone connected: ${socket.id}`);
    socket.emit('game-sync', gameState);

    socket.on('game-event', (data) => {
        console.log('Event received from a phone:', data.type);

        if (data.type === 'numberDrawn') {
            gameState.drawnNumbers = JSON.parse(data.numbers);
        }
        if (data.type === 'gameState') {
            gameState.isPlaying = data.isPlaying;
        }
        if (data.type === 'restart') {
            gameState.drawnNumbers = [];
            gameState.isPlaying = false;
        }

        socket.broadcast.emit('game-event', data);
    });

    socket.on('disconnect', () => {
        console.log(`A phone disconnected: ${socket.id}`);
    });
});

server.listen(3000, () => {
  console.log('Server is running and live on Replit!');
});