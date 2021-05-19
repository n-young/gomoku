import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import { NEIGenerator } from 'natural-english-ids'

import { Main, Header1, Header2 } from '../lib/Library'
import Board from '../components/Board'
import { SOCKET_URL } from "../lib/Config"

export default function Game(props) {
    const [socket, setSocket] = useState()
    const [username, setUsername] = useState('')

    // TODO: Chat and player list.
    // Set socket and emit "player-joined" message.
    useEffect(() => {
        // Create new socket.
        const newSocket = io(SOCKET_URL, { query: { room: props.match.params.room } })
        setSocket(newSocket)

        // Create new username.
        const gen = new NEIGenerator({length: 2})
        const newUsername = gen.generate()
        setUsername(newUsername)

        // Emit message and return callback to close the socket.
        newSocket.emit('player-joined', {player: newUsername})
        return () => newSocket.close()
    }, [props.match.params.room])

    // Render.
    return (
        <Main>
            <Header1>Room ID: {props.match.params.room}</Header1>
            <Header2>Your username: {username}</Header2>
            <Board socket={socket} />
        </Main>
    )
}