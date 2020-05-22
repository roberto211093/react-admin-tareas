import React from 'react';
import {withRouter, Link, NavLink} from 'react-router-dom';
import {auth} from "../firebase";

const Navbar = (props) => {
    const {user, history} = props;

    const closeSession = () => {
        auth.signOut()
            .then(() => {
                    history.push('/login');
                }
            )
            .catch((error) => {
                console.log(error);
            })

    }
    return (
        <div className="navbar navbar-dark bg-dark">
            <Link to="/admin" className="navbar-brand">React Admin</Link>
            <div>
                <div className="d-flex">
                    {
                        user !== null
                            ?
                            <React.Fragment>
                                <NavLink
                                    className="btn btn-dark mr-2"
                                    to="/admin"
                                >
                                    Admin
                                </NavLink>
                                <button
                                    className="btn btn-dark"
                                    type="button"
                                    onClick={() => closeSession()}
                                >
                                    Cerrar Session
                                </button>
                            </React.Fragment>
                            : <NavLink
                                className="btn btn-dark"
                                to="/login"
                            >
                                Login
                            </NavLink>
                    }
                </div>
            </div>
        </div>
    )
}

export default withRouter(Navbar);
