require('dotenv').config()
const express = require('express')
const app = express();

app.get('/', (_, res) => {
    res.send('up')
})

const server = app.listen(process.env.PORT);
const io = require('socket.io')(server, { cors: { origin: "*:" } })

// Socket options.
io.on('connection', socket => {
    // Establish memory.
    const memory = []

    // Get and join room.
    const room = socket.handshake.query.room
    socket.join(room)

    // When a player joins...
    socket.on('player-joined', ({ player }) => {
        console.log(`Player ${player} joined`)
        socket.broadcast.to(room).emit('player-joined', player)
    })

    // When a piece is played...
    socket.on('piece-played', ({ board }) => {
        console.log(`piece played`)
        socket.broadcast.to(room).emit('piece-played', board)
    })
})
