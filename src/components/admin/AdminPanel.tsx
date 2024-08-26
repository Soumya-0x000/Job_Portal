import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../../API';
import { useLocation, useNavigate } from 'react-router-dom';
import { AdminSideBar } from './AdminSideBar';

const AdminPanel: FC = () => {
    const [userName, setUserName] = useState<string>('');

    const location = useLocation();
    const uniqueId = location?.state
    const navigate = useNavigate();

    useEffect(() => {
        const admin = JSON.parse(localStorage.getItem('adminDetails') || '');
        const savedToken = admin?.token
        setUserName(admin?.username)

        if(uniqueId !== savedToken) {
            navigate('/');
        } else {
            (async() => {
                const { data, status } = await axios.get(`${URL}/users/me`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': '69420',
                        authorization: `token ${savedToken}`,
                    }
                })
                console.log(data, status)
            })();
        }
    }, []);

    return (
        <div className=' bg-slate -400 min-h-screen w-full'>
            <AdminSideBar userName={userName} />
        </div>
    );
}

export default AdminPanel;