import styled from 'styled-components'
import { BLACK, WHITE, BLUE, GREEN, ORANGE } from './Colors'

export const Main = styled.div`
    display: flex;
    flex-direction: column;
    width: 90%;
    max-width: 1200px;
    margin: auto;
    padding: 10vh 0;
    align-items: center;
    justify-content: center;
    font-family: 'Roboto Mono', monospace;
    background-color: ${WHITE};
    color: ${BLACK};
`

export const HContainer = styled.div`
    display: flex;
    flex-direction: row;
`

export const VContainer = styled.div`
    display: flex;
    flex-direction: column;
`

export const Header1 = styled.h1`
    font-family: 'Roboto Slab', serif;
    text-decoration: underline;
    text-decoration-color: ${GREEN};
    color: ${BLACK};
`

export const Header2 = styled.h2`
    font-family: 'Roboto Slab', serif;
    color: ${BLACK};
`

export const Header3 = styled.h3`
    font-family: 'Roboto Slab', serif;
    color: ${BLACK};
`

export const Text = styled.p`
    font-family: 'Roboto Mono', monospace;
    color: ${BLACK};
`

export const Button = styled.button`
    font-family: 'Roboto Mono', monospace;
    border: none;
    background-color: ${ORANGE};
    padding: 10px 20px;
    &:hover {
        opacity: 0.75;
        cursor: pointer;
    }
`

