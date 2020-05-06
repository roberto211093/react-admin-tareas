import React, {useState, useEffect, useCallback} from "react";
import {db} from '../firebase';
import moment from 'moment';
import 'moment/locale/es.js'; // Pasar a español

const Firestore = (props) => {
    const {user} = props;
    const [tareas, setTareas] = useState([]);
    const [tarea, setTarea] = useState('');
    const [modoEdicion, setModoEdicion] = useState(false);
    const [id, setId] = useState('');
    const [ultimaTarea, setUltimaTarea] = useState(null);
    const [desactivar, setDesactivar] = useState(false);

    const checkMoreTareas = useCallback(async (data) => {
        const query = await db.collection(user.uid)
            .limit(10)
            .orderBy('fecha')
            .startAfter(data.docs[data.docs.length - 1])
            .get();
        if (query.empty) {
            console.log('No hay más tareas');
            setDesactivar(true);
        } else {
            setDesactivar(false);
        }
    }, [user]);

    useEffect(() => {
        setDesactivar(true);
        const obtenerDatos = async () => {
            try {
                const data = await db.collection(user.uid)
                    .limit(10)
                    .orderBy('fecha')
                    .get();
                const arrayData = data.docs.map(doc => ({id: doc.id, ...doc.data()}));
                setUltimaTarea(data.docs[data.docs.length - 1]);
                setTareas(arrayData);
                checkMoreTareas(data);
            } catch (error) {
                console.log(error)
            }
        }
        obtenerDatos()
    }, [user, checkMoreTareas])

    const siguiente = async  () => {
        try {
            const data = await db.collection(user.uid)
                .limit(10)
                .orderBy('fecha')
                .startAfter(ultimaTarea)// para que lo agregue despues del ultimo documento
                .get();
            const arrayData = data.docs.map(doc => ({id: doc.id, ...doc.data()}));
            setTareas([...tareas, ...arrayData]);
            setUltimaTarea(data.docs[data.docs.length - 1]);
            checkMoreTareas(data);
        }
        catch (error) {
            console.log(error);
        }
    }

    const agregar = async (e) => {
        e.preventDefault()

        if (!tarea.trim()) {
            console.log('está vacio')
            return
        }

        try {
            const nuevaTarea = {
                name: tarea,
                fecha: Date.now()
            }
            const data = await db.collection(user.uid).add(nuevaTarea)

            setTareas([
                ...tareas,
                {...nuevaTarea, id: data.id}
            ])

            setTarea('')

        } catch (error) {
            console.log(error)
        }
    }

    const eliminar = async (id) => {
        try {
            await db.collection(user.uid).doc(id).delete()

            const arrayFiltrado = tareas.filter(item => item.id !== id)
            setTareas(arrayFiltrado)

        } catch (error) {
            console.log(error)
        }
    }

    const activarEdicion = (item) => {
        setModoEdicion(true)
        setTarea(item.name)
        setId(item.id)
    }

    const editar = async (e) => {
        e.preventDefault()
        if (!tarea.trim()) {
            console.log('vacio')
            return
        }
        try {
            await db.collection(user.uid).doc(id).update({
                name: tarea
            })
            const arrayEditado = tareas.map(item => (
                item.id === id ? {id: item.id, fecha: item.fecha, name: tarea} : item
            ))
            setTareas(arrayEditado)
            setModoEdicion(false)
            setTarea('')
            setId('')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <div className="row">
                <div className="col-md-6">
                    <h3>Lista de tareas</h3>
                    <ul className="list-group">
                        {
                            tareas.map(item => (
                                <li className="list-group-item mb-2" key={item.id}>
                                    <div>{item.name} - {moment(item.fecha).format('LLL')}</div>
                                    <div className="mt-2">
                                        <button
                                            className="btn btn-danger btn-sm float-right"
                                            onClick={() => eliminar(item.id)}
                                        >
                                            Eliminar
                                        </button>
                                        <button
                                            className="btn btn-warning btn-sm float-right mr-2"
                                            onClick={() => activarEdicion(item)}
                                        >
                                            Editar
                                        </button>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                    <button
                        className="btn btn-info btn-block mr-2"
                        onClick={() => siguiente()}
                        disabled={desactivar}
                    >
                        {
                            desactivar ? 'No hay más tareas' : 'Cargar más'
                        }
                    </button>
                </div>
                <div className="col-md-6">
                    <h3>
                        {
                            modoEdicion ? 'Editar Tarea' : 'Agregar Tarea'
                        }
                    </h3>
                    <form onSubmit={modoEdicion ? editar : agregar}>
                        <input
                            type="text"
                            placeholder="Ingrese tarea"
                            className="form-control mb-2"
                            onChange={e => setTarea(e.target.value)}
                            value={tarea}
                        />
                        <button
                            className={
                                modoEdicion ? 'btn btn-warning btn-block' : 'btn btn-dark btn-block'
                            }
                            type="submit"
                        >
                            {
                                modoEdicion ? 'Editar' : 'Agregar'
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Firestore
