import React from 'react'
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import Home from './pages/Home'
import Game from './pages/Game'
import Nav from './components/Nav'

function App() {

    return (
        <>
            <Router>
                <Nav />
                <Switch>
                    <Route exact path="/game/:room" component={Game} />
                    <Route exact path="/" component={Home} />
                    <Route path="/">
                        <Redirect to="/" />
                    </Route>
                </Switch>
            </Router>
        </>
    );
}

export default App;
