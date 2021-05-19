import React from 'react'
import { useHistory } from 'react-router-dom'
import { NEIGenerator } from 'natural-english-ids'
import { Main, Header1, Button } from '../lib/Library'

export default function Home() {
    const gen = new NEIGenerator()
    const history = useHistory()

    const createGame = () => {
        const roomId = gen.generate()
        history.push(`/game/${roomId}`, {room: roomId})
    }

    return (
        <Main>
            <Header1>Gomoku</Header1>
            <Button onClick={createGame}>Create Game</Button>
        </Main>
    )
}


