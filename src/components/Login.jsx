import React, {useCallback, useState} from 'react';
import {auth, db} from '../firebase';
import {withRouter} from 'react-router-dom';

const Login = (props) => {
    const {history} = props;
    const [email, setEmail] = useState('rafael.r.acosta.m.93@gmail.com');
    const [password, setPassword] = useState('123456');
    const [error, setError] = useState(null);
    const [esRegistro, setEsRegistro] = useState(true);

    const procesarDatos = (e) => {
        e.preventDefault();
        if (!email.trim()) {
            setError('Ingresa Email');
            return;
        }
        if (!password.trim()) {
            setError('Ingresa Password');
            return;
        }
        if (password.length < 6) {
            setError('Password debe ser de minimo 6 caracteres');
            return;
        }
        setError(null);
        if (esRegistro) {
            registrar();
        } else {
            login()
        }
    }

    const isOk = useCallback(async () => {
        setEmail('');
        setPassword('');
        setError(null);
        history.push('/admin');
    }, [history]);

    const login = useCallback(async () => {
        try {
            const res = await auth.signInWithEmailAndPassword(email, password);
            console.log('res: ', res);
            isOk();
        } catch (error) {
            setError(error.message)
        }
    }, [email, password, isOk]);

    const registrar = useCallback(async () => {
        try {
            const res = await auth.createUserWithEmailAndPassword(email, password);
            await db.collection('usuarios').doc(res.user.email).set({
                email: res.user.email,
                uid: res.user.uid
            });
            await db.collection(res.user.uid).add({
                    name: 'Tarea de Ejemplo',
                    fecha: Date.now()
                }
            );
            isOk();
        } catch (error) {
            setError(error.message)
        }
    }, [email, password, isOk]);

    return (
        <div className="mt-5">
            <div className="text-center">
                <h3>
                    {
                        esRegistro
                            ? 'Registro de usuarios'
                            : 'Acceso de usuarios'
                    }
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
                            <input
                                type="password"
                                className="form-control mb-2"
                                placeholder="Ingresa password"
                                onChange={e => setPassword(e.target.value)}
                                value={password}
                            />
                            <button className="btn btn-dark btn-lg btn-block" type="submit">
                                {
                                    esRegistro
                                        ? 'Registrarse'
                                        : 'Iniciar session'
                                }
                            </button>
                            {
                                !esRegistro && (
                                    <button className="btn btn-dark btn-lg btn-block"
                                            type="button"
                                            onClick={() => history.push('/reset')}>
                                        Recuperar Contraseña
                                    </button>
                                )
                            }
                            <button className="btn btn-info btn-lg btn-block"
                                    type="button"
                                    onClick={() => setEsRegistro(!esRegistro)}>
                                {
                                    esRegistro
                                        ? '¿Ya tienes una cuenta?'
                                        : '¿No tienes cuenta?'
                                }
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Login);
