import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {auth} from "./firebase";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Admin from "./components/Admin";
import Reset from "./components/Reset";

const App = () => {
    const [user, setUser] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged(res => {
            res ? setUser(res) : setUser(null);
        })
    }, [user, setUser]);
    return user !== false ? (
        <Router>
            <div className="container-fluid p-0">
                <Navbar user={user}/>
                <Switch>
                    <Route path="/login">
                        <Login/>
                    </Route>
                    <Route path="/admin">
                        <Admin/>
                    </Route>
                    <Route path="/reset">
                        <Reset />
                    </Route>
                    <Route path="/" exact>
                        Ruta de inicio
                    </Route>
                </Switch>
            </div>
        </Router>
    ) : (<div>Cargando...</div>)
}

export default App
