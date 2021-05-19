import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Header1 } from '../lib/Library'
import { WHITE } from '../lib/Colors'

const Navbar = styled.nav`
    display: flex;
    align-items: center;
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

export default function Nav() {
    return (
        <Navbar>
            <Link to="/"><NavHeader>Gomoku</NavHeader></Link>
        </Navbar>
    )
}
