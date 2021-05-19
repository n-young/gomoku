import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { BLACK, WHITE } from '../lib/Colors'
import { Button } from '../lib/Library'

const BOARD_SIZE = 19

const Tiles = styled.div` 
    width: ${BOARD_SIZE * 2}vw;
    height: ${BOARD_SIZE * 2}vw;
    display: grid;
    grid-template-columns: repeat(${BOARD_SIZE}, 1fr);
    grid-template-rows: repeat(${BOARD_SIZE}, 1fr);
    padding: 0;
    background-color: Bisque;
`

const Tile = styled.div`
    margin: 0;
    padding: 0;
    width: 2vw;
    height: 2vw;
    background-color: Bisque;

    &::after {
        content: '';
        width: 100%;
        height: 1px;
        background: black;
        display: block;
        position: relative;
        bottom: 50%;
    }

    &::before {
        content: '';
        width: 1px;
        height: 2vw;
        background: black;
        display: block;
        position: absolute;
        margin-left: 1vw;
    }

    &:hover > .piece {
        opacity: 0.7
    }
`

const Piece = styled.div`
    border-radius: 1000px;
    width: 2vw;
    height: 2vw;
    opacity: 0;
    margin: 0;
    z-index: 100;
`

const CurrWhitePiece = styled(Piece)`
    background-color: ${WHITE};
`

const CurrBlackPiece = styled(Piece)`
    background-color: ${BLACK};
`

const WhitePiece = styled(CurrWhitePiece)`
    opacity: 1;
`

const BlackPiece = styled(CurrBlackPiece)`
    opacity: 1;
`

// HELPER - returns an array of 0s
const zeros = (d) => {
    let array = [];
    for (let i = 0; i < d[0]; ++i) {
        array.push(d.length === 1 ? 0 : zeros(d.slice(1)));
    }
    return array;
}

// HELPER - returns array with one pos changed.
const setOne = (arr, x, y, v) => {
    arr[y][x] = v
    return arr
}

// TODO: Make the border pieces less shit.
// TODO: Make this tidier by making board emit whenever board changes, and
// perhaps transmitting "last played" data as well.
export default function Board(props) {
    const [board, setBoard] = useState(zeros([BOARD_SIZE, BOARD_SIZE]))
    const [lastPlaced, setLastPlaced] = useState(1)

    // Listen to socket for joining players.
    useEffect(() => {
        if (props.socket == null) return
        props.socket.on('player-joined', (player) => {
            console.log(`Player ${player} Joined!`)
            props.socket.emit('piece-played', { board })
        })
        return () => props.socket.off('player-joined')
    }, [props.socket, board, lastPlaced])


    // Listen to socket for played pieces.
    useEffect(() => {
        if (props.socket == null) return
        props.socket.on('piece-played', (newBoard) => {
            setLastPlaced(-lastPlaced)
            setBoard(newBoard)
        })
        return () => props.socket.off('piece-played')
    }, [props.socket, board, lastPlaced])

    // Place a piece by updating the board and notifying the server.
    const placePiece = (x, y) => {
        console.log('place piece')
        const newBoard = setOne(board, x, y, lastPlaced)
        setBoard(newBoard)
        setLastPlaced(-lastPlaced)
        props.socket.emit('piece-played', { board: newBoard })
    }

    // Reset the board.
    const resetBoard = () => {
        console.log('reset board')
        const newBoard = zeros([BOARD_SIZE, BOARD_SIZE])
        setBoard(newBoard)
        props.socket.emit('piece-played', { board: newBoard })
    }

    // Render tiles.
    const tiles = () => {
        const ret = []
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (board[i][j] === 1) {
                    ret.push(
                        <Tile key={`${i}-${j}`} >
                            <BlackPiece />
                        </Tile>
                    )
                } else if (board[i][j] === -1) {
                    ret.push(
                        <Tile key={`${i}-${j}`} >
                            <WhitePiece />
                        </Tile>
                    )
                } else if (lastPlaced === -1) {
                    ret.push(
                        <Tile key={`${i}-${j}`} onClick={() => placePiece(j, i)}>
                            <CurrWhitePiece className="piece" />
                        </Tile>
                    )
                } else {
                    ret.push(
                        <Tile key={`${i}-${j}`} onClick={() => placePiece(j, i)}>
                            <CurrBlackPiece className="piece" />
                        </Tile>
                    )
                }
            }
        }
        return ret
    }

    // Render.
    return (
        <>
            <Tiles>
                {tiles()}
            </Tiles>
            <Button onClick={resetBoard}>Reset</Button>
        </>
    )
}