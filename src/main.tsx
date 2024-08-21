import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";
import Home from "./components/User/Home.tsx";
import Career from "./components/User/Career.tsx";
import App from "./App.tsx";
import LoginPage from "./components/authPage/SignIn.tsx";
import Register from "./components/authPage/SignUp.tsx";
import AdminPanel from "./components/admin/AdminPanel.tsx";
import LandingPage from "./components/Home/LandingPage.tsx";
import Error404 from "./common/Error404.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShowJobs from "./components/admin/job/ShowJobs.tsx";
import { Provider } from "react-redux";
import { store } from "./store/Store.tsx";
import AdminRooms from "./components/admin/job/jobRooms/AdminRooms.tsx";
import UserJobRooms from "./components/User/Job/UserJobRooms.tsx";
import UserBookings from "./components/admin/job/bookings/UserBookings.tsx";

const router = createBrowserRouter([
    { path: "/", element: <LandingPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <Register /> },
    {
        path: "/admin",
        element: <AdminPanel />,
        children: [
            { path: "", element: <ShowJobs /> },
            { path: "rooms", element: <AdminRooms /> },
            { path: "userbookings", element: <UserBookings /> },
        ],
    },
    { path: "/error404", element: <Error404 /> },
    {
        path: "/home",
        element: <App />,
        children: [
            { path: "", element: <Home /> },
            { path: "career", element: <Career /> },
            { path: "userroom", element: <UserJobRooms /> },
        ],
    },
    { path: "*", element: <Navigate to="/error404" /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <ToastContainer />
            <RouterProvider router={router} />
        </Provider>
    </React.StrictMode>
);
