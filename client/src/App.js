import React, { useState } from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import Home from './pages/Home'
import Game from './pages/Game'
import Nav from './components/Nav'
import Options from './components/Options';

import { UsernameProvider } from './contexts/UsernameProvider'

require('dotenv').config()

function App() {
    const [isOptionsOpen, setOptionsOpen] = useState(false)
    const openOptions = () => { setOptionsOpen(true) }
    const closeOptions = () => { setOptionsOpen(false) }

    return (
        <UsernameProvider>
            <Router>
                <Nav openOptions={openOptions} />
                <Switch>
                    <Route exact path="/game/:room" component={Game} />
                    <Route exact path="/" component={Home} />
                    <Route path="/">
                        <Redirect to="/" />
                    </Route>
                </Switch>
            </Router>
            <Options isOptionsOpen={isOptionsOpen} closeOptions={closeOptions} />
        </UsernameProvider>
    );
}

export default App;
