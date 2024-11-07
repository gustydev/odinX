import { Navigate, Outlet } from "react-router-dom";
import useAuth from './useAuth'
import Sidebar from "../../components/layout/sidebar/Sidebar";
import { io } from "socket.io-client";
import { API_URL } from "../../utils/api";

export default function ProtectedRoute() {
    const auth = useAuth();
    
    if (!auth.token) return <Navigate to="/login" />;

    const socket = io(API_URL, {transports: ['websocket', 'polling', 'flashsocket'], query: {
        userId: auth.user._id,
        demo: auth.user.demo
    }})
    
    return (
        <>
            <Sidebar socket={socket} />
            <Outlet context={[socket]} />
        </>
    );
};