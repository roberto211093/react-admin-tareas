import React, {useState, useCallback} from 'react';
import {auth} from "../firebase";
import {withRouter} from 'react-router-dom';

const Reset = (props) => {
    const {history} = props;
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);

    const procesarDatos = (e) => {
        e.preventDefault();
        if (!email.trim()) {
            setError('Ingresa Email');
            return;
        }
        setError(null);
        recuperar();
    }

    const recuperar = useCallback(async () => {
        try {
            await auth.sendPasswordResetEmail(email);
            history.push('/login')
        } catch (error) {
            setError(error.message)
        }
    }, [email, history]);

    return (
        <div className="mt-5">
            <div className="text-center">
                <h3>
                    Recuperar Contraseña
                </h3>
                <hr/>
                <div className="row justify-content-center m-0">
                    <div className="col-12 col-sm-8 col-md-6 col-xl-4">
                        <form onSubmit={procesarDatos}>
                            {
                                error && (
                                    <div className="alert alert-warning">{error}</div>
                                )
                            }
                            <input
                                type="email"
                                className="form-control mb-2"
                                placeholder="Ingresa email"
                                onChange={e => setEmail(e.target.value)}
                                value={email}
                            />
                            <button className="btn btn-dark btn-lg btn-block" type="submit">
                                Enviar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Reset);
