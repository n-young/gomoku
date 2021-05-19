import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { BLACK, WHITE, GREEN, BLUE, ORANGE } from '../lib/Colors'
import { Text, Button, Input } from '../lib/Library'

const COLORS = [GREEN, BLUE, ORANGE]
const BOARD_SIZE = 19

const ChatContainer = styled.div`
    box-sizing: content-box;
    background-color: ${WHITE};
    border: 1px solid ${BLACK};
    width: 200px;
    margin: 0 10px;
    height: ${BOARD_SIZE * 2}vh;
    display: flex;
    flex-direction: column
`

const UserList = styled.div`
    padding: 2px;
`

const ChatList = styled.div`
    padding: 2px;
    border-top: 1px solid ${BLACK};
    height: 100%;
    overflow-y: scroll;
`

const ChatInput = styled(Input)`
    margin: 0;
    padding: 5px;
    border: none;
    border-top: 1px solid ${BLACK};
    bottom: 0;
    &:focus {
        outline: none;
    }
`

const ChatText = styled(Text)`
    margin: 0;
`

export default function Chat(props) {
    const [players, setPlayers] = useState([])
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState("")

    // Listen to socket for joining players.
    useEffect(() => {
        if (props.socket == null) return
        console.log("a")
        props.socket.on('player-joined', (player) => {
            setPlayers(players.concat([player]))
            props.socket.emit('welcome-player', props.user)
        })
        return () => props.socket.off('player-joined')
    }, [props.socket, props.user, players])

    // Listen to socket for joining players.
    useEffect(() => {
        if (props.socket == null) return
        props.socket.on('welcome-player', (player) => {
            setPlayers(players.concat([player]))
        })
        return () => props.socket.off('welcome-player')
    }, [props.socket, props.user, players])

    // Listen to socket for leaving players.
    useEffect(() => {
        if (props.socket == null) return
        props.socket.on('player-left', (player) => {
            setPlayers(players.filter(p => p !== player))
        })
        return () => props.socket.off('player-left')
    }, [props.socket, players])

    // Listen to socket for new message.
    useEffect(() => {
        if (props.socket == null) return
        props.socket.on('message-sent', (m) => {
            setMessages(messages.concat([m]))
        })
        return () => props.socket.off('message-sent')
    }, [props.socket, messages])

    // Send a message
    const sendMessage = (e) => {
        e.preventDefault()
        const messageObj = {sender: props.user, message}
        setMessages(messages.concat([messageObj]))
        setMessage("")
        props.socket.emit('message-sent', messageObj)
    }

    // Return
    return (
        <ChatContainer>
            <UserList>
            players: {players.join(", ")}
            </UserList>
            <ChatList>
                {messages.map(m => <ChatText>{m.sender}: {m.message}</ChatText>)}
            </ChatList>
            <form onSubmit={sendMessage} >
                <ChatInput type="text" placeholder="chat" value={message} onChange={(e) => setMessage(e.target.value)} />
            </form>
        </ChatContainer>
    )
}