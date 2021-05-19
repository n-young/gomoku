require('dotenv').config()
const express = require('express')
const app = express();

app.get('/', (_, res) => {
    res.send('up')
})

const server = app.listen(process.env.PORT);
const io = require('socket.io')(server, { cors: { origin: "*" } })

// Socket options.
io.on('connection', socket => {
    // Establish memory.
    // const memory = []

    // Get and join room.
    const room = socket.handshake.query.room
    socket.join(room)

    // When a player joins...
    socket.on('player-joined', ({ player }) => {
        console.log(`Player ${player} joined`)
        socket.broadcast.to(room).emit('player-joined', player)
        socket.broadcast.to(room).emit('board-request', player)
    })

    // When a player leaves...
    socket.on('disconnect', () => {
        console.log(`Player ${socket.handshake.query.user} left`)
        socket.broadcast.to(room).emit('player-left', socket.handshake.query.user)
    })

    // When a player leaves...
    socket.on('welcome-player', () => {
        socket.broadcast.to(room).emit('welcome-player', socket.handshake.query.user)
    })

    // When a piece is played...
    socket.on('piece-played', ({ board, boardHistory, lastPlaced }) => {
        console.log(`piece played`)
        socket.broadcast.to(room).emit('piece-played', board, boardHistory, lastPlaced)
    })

    // When a player leaves...
    socket.on('message-sent', (m) => {
        console.log(`message sent`)
        socket.broadcast.to(room).emit('message-sent', m)
    })

    // When won
    socket.on('game-won', () => {
        console.log(`game won`)
        socket.to(room).emit('message-sent', { sender: "game", message: "Game won!"})
    })
})
