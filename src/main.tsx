import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Home from './components/Home.tsx';
import Career from './components/Career.tsx';
import App from './App.tsx';
import LoginPage from './components/authPage/SignIn.tsx';
import Register from './components/authPage/SignUp.tsx';
import AdminPanel from './components/admin/AdminPanel.tsx';
import LandingPage from './components/Home/LandingPage.tsx';
import Error404 from './common/Error404.tsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Rooms from './components/admin/jobRooms/Rooms.tsx';
import ShowJobs from './components/admin/job/ShowJobs.tsx';
import { Provider } from 'react-redux';
import { store } from './store/Store.tsx';

const router = createBrowserRouter([
    { path: '/', element: <LandingPage /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/signup', element: <Register /> },
    { 
        path: '/admindashboard', 
        element: <AdminPanel />,
        children: [
            { path: '', element: <ShowJobs /> },
            { path: 'rooms', element: <Rooms/> },
        ]
    },
    { path: '/error404', element: <Error404 /> },
    {
        path: '/home',
        element: <App />,
        children: [
            { path: '', element: <Home /> },
            { path: 'career', element: <Career /> },
        ],
    },
    { path: '*', element: <Navigate to="/error404" /> },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <ToastContainer />
            <RouterProvider router={router} />
        </Provider>
    </React.StrictMode>
);
