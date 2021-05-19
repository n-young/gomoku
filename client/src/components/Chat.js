import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { BLACK, WHITE } from '../lib/Colors'
import { Text, Input } from '../lib/Library'
import { BOARD_SIZE, TILE_SIZE, MAX_TILE_SIZE } from '../lib/Config'

const ChatContainer = styled.div`
    box-sizing: content-box;
    background-color: ${WHITE};
    border: 1px solid ${BLACK};
    width: 300px;
    margin: 0 10px;
    height: calc(max(${TILE_SIZE * BOARD_SIZE}vw, ${MAX_TILE_SIZE * BOARD_SIZE}px));
    display: flex;
    flex-direction: column;

    @media screen and (max-width: 768px) {
        margin: auto;
        width: 400px;
    }
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

const ChatForm = styled.form`
    display: flex;
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
    width: 100%;
`

const ChatText = styled(Text)`
    margin: 0;
    overflow-wrap: break-word;
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
                {messages.map(m => <ChatText><strong>{m.sender}</strong>: {m.message}</ChatText>)}
            </ChatList>
            <ChatForm onSubmit={sendMessage} >
                <ChatInput type="text" placeholder="chat" value={message} onChange={(e) => setMessage(e.target.value)} />
            </ChatForm>
        </ChatContainer>
    )
}