import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import io from 'socket.io-client'
import { NEIGenerator } from 'natural-english-ids'

import { useUsername } from '../contexts/UsernameProvider'
import { Main, Container, HContainer, Header1, Header2 } from '../lib/Library'
import Board from '../components/Board'
import Chat from '../components/Chat'
import { SOCKET_URL } from "../lib/Config"

export default function Game(props) {
    const { username } = useUsername()

    // Create new username.
    const gen = new NEIGenerator({ length: 2 })
    const newUsername = gen.generate()
    const [socket, setSocket] = useState()
    const [user, setUser] = useState(username || newUsername)

    const HHContainer = styled(HContainer)`
        align-items: center
    `

    const Clicky = styled.p`
        margin-left: 10px;
        cursor: pointer;
    `

    // Set socket and emit "player-joined" message.
    useEffect(() => {
        // Create new socket.
        const newSocket = io(SOCKET_URL, { query: { room: props.match.params.room, user } })
        setSocket(newSocket)

        // Emit message and return callback to close the socket.
        newSocket.emit('player-joined', { player: user })
        return () => newSocket.close()
    }, [props.match.params.room, user])

    console.log(props)

    // Render.
    return (
        <Main>
            <HHContainer>
                <Header1>room id: {props.match.params.room} </Header1>
                <Clicky onClick={() => navigator.clipboard.writeText(props.match.params.room)}>[copy]</Clicky>
            </HHContainer>
            <Header2>your username: {user}</Header2>
            <Container>
                <Board socket={socket} />
                <Chat socket={socket} user={user} />
            </Container>
        </Main>
    )
}