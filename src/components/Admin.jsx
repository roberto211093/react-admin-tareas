import React, {useEffect, useState} from 'react';
import {auth} from '../firebase';
import {withRouter} from 'react-router-dom';
import Firestore from './Firestore';

const Admin = (props) => {
    const {history} = props;
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (auth.currentUser) {
            setUser(auth.currentUser);
        } else {
            history.push('/login')
        }
    }, [user, history])

    return (
        <div className="p-4">
            {user && (
                <Firestore user={user}/>
            )}
        </div>
    )
}

export default withRouter(Admin);
