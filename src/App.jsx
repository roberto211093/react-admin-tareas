import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import {auth} from "./firebase";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Admin from "./components/Admin";
import Reset from "./components/Reset";

const App = () => {
    const [user, setUser] = useState(false);

    useEffect(() => {
        const fetchUser = () => {
            auth.onAuthStateChanged(res => {
                res ? setUser(res) : setUser(null);
            })
        }
        fetchUser()
    }, [user, setUser]);


    const RutaProtegida = ({component, path, ...rest}) => {
        if (user) {
            return <Route component={component} path={path} {...rest} />
        } else {
            return <Redirect to="/login" {...rest} />
        }

    }

    return user !== false ? (
        <Router>
            <div className="container-fluid p-0">
                <div>
                    <Navbar user={user}/>
                    <Switch>
                        <Route component={Login} path="/login"/>
                        <Route component={Reset} path="/reset"/>
                        <RutaProtegida component={Admin} path="/admin" exact/>
                        <RutaProtegida component={Admin} path="/" exact/>
                    </Switch>
                </div>
            </div>
        </Router>
    ) : (<div>Cargando...</div>)
}

export default App
