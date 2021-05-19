import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import { NEIGenerator } from 'natural-english-ids'

import { Main, HContainer, Header1, Header2 } from '../lib/Library'
import Board from '../components/Board'
import Chat from '../components/Chat'
import { SOCKET_URL } from "../lib/Config"

export default function Game(props) {
    // Create new username.
    const gen = new NEIGenerator({ length: 2 })
    const newUsername = gen.generate()
    const [socket, setSocket] = useState()
    const [user, setUser] = useState(newUsername)

    // Set socket and emit "player-joined" message.
    useEffect(() => {
        // Create new socket.
        const newSocket = io(SOCKET_URL, { query: { room: props.match.params.room, user } })
        setSocket(newSocket)

        // Emit message and return callback to close the socket.
        newSocket.emit('player-joined', { player: user })
        return () => newSocket.close()
    }, [props.match.params.room, user])

    // Render.
    return (
        <Main>
            <Header1>Room ID: {props.match.params.room}</Header1>
            <Header2>Your username: {user}</Header2>
            <HContainer>
                <Board socket={socket} />
                <Chat socket={socket} user={user} />
            </HContainer>
        </Main>
    )
}