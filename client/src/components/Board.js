import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { BLACK, WHITE } from '../lib/Colors'
import { VContainer, HContainer, Button } from '../lib/Library'
import { BOARD_SIZE, TILE_SIZE, MAX_TILE_SIZE } from '../lib/Config'


const Tiles = styled.div` 
    width: calc(max(${TILE_SIZE * BOARD_SIZE}vw, ${MAX_TILE_SIZE * BOARD_SIZE}px));
    height: calc(max(${TILE_SIZE * BOARD_SIZE}vw, ${MAX_TILE_SIZE * BOARD_SIZE}px));
    display: grid;
    grid-template-columns: repeat(${BOARD_SIZE}, 1fr);
    grid-template-rows: repeat(${BOARD_SIZE}, 1fr);
    padding: 0;
    background-color: Bisque;
    margin-bottom: 20px;
`

const Tile = styled.div`
    margin: -1px;
    padding: 0;
    background-color: Bisque;

    &::after {
        content: '';
        width: 100%;
        height: 1px;
        background: black;
        display: block;
        position: relative;
        bottom: calc(max(${TILE_SIZE}vw, ${MAX_TILE_SIZE}px) / 2);
    }

    &::before {
        content: '';
        width: 1px;
        height: calc(max(${TILE_SIZE}vw, ${MAX_TILE_SIZE}px));
        background: black;
        display: block;
        position: absolute;
        margin-left: calc(max(${TILE_SIZE}vw, ${MAX_TILE_SIZE}px) / 2);
    }

    &:hover > .piece {
        opacity: 0.7
    }
`

const Piece = styled.div`
    border-radius: 1000px;
    width: calc(max(${TILE_SIZE}vw, ${MAX_TILE_SIZE}px));
    height: calc(max(${TILE_SIZE}vw, ${MAX_TILE_SIZE}px));
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

const VVContainer = styled(VContainer)`
    @media screen and (max-width: 768px) {
        flex-direction: column-reverse;
    }
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

// HELPER - deep copies an array.
const deepCopy = (arr) => {
    return JSON.parse(JSON.stringify(arr))
}

// HELPER - check if there is a winner.
const checkWinner = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            // Look in all 8 directions
            if (arr[j][i] === 0) { continue }
            if ((j >= 4 && arr[j][i] === arr[j-1][i] && arr[j][i] === arr[j-2][i] && arr[j][i] === arr[j-3][i] && arr[j][i] === arr[j-4][i])
                || (j < arr.length - 4 && arr[j][i] === arr[j+1][i] && arr[j][i] === arr[j+2][i] && arr[j][i] === arr[j+3][i] && arr[j][i] === arr[j+4][i])
                || (i >= 4 && arr[j][i] === arr[j][i-1] && arr[j][i] === arr[j][i-2] && arr[j][i] === arr[j][i-3] && arr[j][i] === arr[j][i-4])
                || (i < arr.length - 4 && arr[j][i] === arr[j][i+1] && arr[j][i] === arr[j][i+2] && arr[j][i] === arr[j][i+3] && arr[j][i] === arr[j][i+4])
                || (j < arr.length - 4 && i < arr.length - 4 && arr[j][i] === arr[j+1][i+1] && arr[j][i] === arr[j+2][i+2] && arr[j][i] === arr[j+3][i+3] && arr[j][i] === arr[j+4][i+4])
                || (j < arr.length - 4 && i >= 4 && arr[j][i] === arr[j+1][i-1] && arr[j][i] === arr[j+2][i-2] && arr[j][i] === arr[j+3][i-3] && arr[j][i] === arr[j+4][i-4])
                || (j >= 4 && i < arr.length - 4 && arr[j][i] === arr[j-1][i+1] && arr[j][i] === arr[j-2][i+2] && arr[j][i] === arr[j-3][i+3] && arr[j][i] === arr[j-4][i+4])
                || (j >= 4 && i >= 4 && arr[j][i] === arr[j-1][i-1] && arr[j][i] === arr[j-2][i-2] && arr[j][i] === arr[j-3][i-3] && arr[j][i] === arr[j-4][i-4])) {
                    return true
                }
        }
    }
    return false
}

// TODO: Make the border pieces less shit.
// TODO: Make this tidier by making board emit whenever board changes, and
// perhaps transmitting "last played" data as well.
export default function Board(props) {
    const [boardHistory, setBoardHistory] = useState([zeros([BOARD_SIZE, BOARD_SIZE])])
    const [board, setBoard] = useState(zeros([BOARD_SIZE, BOARD_SIZE]))
    const [lastPlaced, setLastPlaced] = useState(1)
    const won = checkWinner(board)
    // if (won) {
    //     props.socket.emit('game-won')
    // }

    // Listen to socket for joining players.
    useEffect(() => {
        if (props.socket == null) return
        props.socket.on('board-request', (player) => {
            props.socket.emit('piece-played', { board, boardHistory })
        })
        return () => props.socket.off('board-request')
    }, [props.socket, board, boardHistory, lastPlaced])


    // Listen to socket for played pieces.
    useEffect(() => {
        if (props.socket == null) return
        props.socket.on('piece-played', (newBoard, newBoardHistory, newLastPlaced) => {
            setLastPlaced(newLastPlaced)
            setBoard(newBoard)
            setBoardHistory(newBoardHistory)
        })
        return () => props.socket.off('piece-played')
    }, [props.socket, board, boardHistory, lastPlaced])

    // Place a piece by updating the board and notifying the server.
    const placePiece = (x, y) => {
        if (won) { return }
        const newBoard = setOne(board, x, y, lastPlaced)
        const newBoardHistory = boardHistory.concat([deepCopy(newBoard)])
        setLastPlaced(-lastPlaced)
        setBoard(newBoard)
        setBoardHistory(newBoardHistory)
        props.socket.emit('piece-played', { board: newBoard, boardHistory: newBoardHistory, lastPlaced: -lastPlaced })
    }

    // Reset the board.
    const resetBoard = () => {
        const newBoard = zeros([BOARD_SIZE, BOARD_SIZE])
        const newBoardHistory = [zeros([BOARD_SIZE, BOARD_SIZE])]
        setBoard(newBoard)
        setBoardHistory(newBoardHistory)
        setLastPlaced(1)
        props.socket.emit('piece-played', { board: newBoard, boardHistory: newBoardHistory, lastPlaced: 1 })
    }

    // Undo a move. NOTE: This is wildly inefficient.
    const undoMove = () => {
        if (boardHistory.length > 1) {
            let newBoard
            let newBoardHistory
            if (boardHistory.length === 2) {
                newBoard = zeros([BOARD_SIZE, BOARD_SIZE])
                newBoardHistory = [newBoard]
                setBoardHistory(newBoardHistory)
                setBoard(newBoard)
                setLastPlaced(-lastPlaced)
            } else {
                newBoard = boardHistory[boardHistory.length - 2]
                newBoardHistory = deepCopy(boardHistory.slice(0, boardHistory.length - 1))
                setBoard(newBoard)
                setBoardHistory(newBoardHistory)
                setLastPlaced(-lastPlaced)
            }
            props.socket.emit('piece-played', { board: newBoard, boardHistory: newBoardHistory, lastPlaced: -lastPlaced })
        }
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

    console.log(won)
    console.log(board)
    console.log(boardHistory)

    // Render.
    return (
        <VVContainer>
            <Tiles>
                {tiles()}
            </Tiles>
            <HContainer style={{ margin: "auto" }}>
                <Button onClick={undoMove}>Undo Move</Button>
                <Button onClick={resetBoard}>Reset</Button>
            </HContainer>
        </VVContainer>
    )
}