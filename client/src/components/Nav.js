import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Header1, Header2 } from '../lib/Library'
import { WHITE } from '../lib/Colors'

const Navbar = styled.nav`
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background-color: ${WHITE};
    height: 60px;
    border-bottom: 1px solid black;
    padding: 10px 30px;

    @media screen and (max-width: 768px) {
        display: none
    }
`

const NavHeader = styled(Header1)`
    margin: 0;
`

const OptionIcon = styled(Header2)`
    padding: 5px;
    cursor: pointer;
`

export default function Nav(props) {
    return (
        <Navbar>
            <Link to="/"><NavHeader>Gomoku</NavHeader></Link>
            <OptionIcon onClick={props.openOptions}>⌥</OptionIcon>
        </Navbar>
    )
}
