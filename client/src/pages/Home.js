import React, { useState } from 'react'
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { useHistory } from 'react-router-dom'
import { NEIGenerator } from 'natural-english-ids'
import { Main, Header1, Button, Input } from '../lib/Library'


const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

export default function Home() {
    const [isOpen, setIsOpen] = useState(false)
    const [room, setRoom] = useState('')
    const history = useHistory()
    const gen = new NEIGenerator()

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }


    const createGame = () => {
        const roomId = gen.generate()
        history.push(`/game/${roomId}`, { room: roomId })
    }

    const joinGame = (roomId) => {
        history.push(`/game/${roomId}`, { room: roomId })
    }

    return (
        <Main>
            <Header1>Gomoku</Header1>
            <Button onClick={createGame}>create game</Button>
            <Button onClick={openModal}>join game</Button>
            <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                style={modalStyles}
            >
                <Input value={room} onChange={(e) => setRoom(e.target.value)} type="text" placeholder="Room Id" />
                <Button onClick={() => joinGame(room)}>submit</Button>
            </Modal>
        </Main>
    )
}
