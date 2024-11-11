import { Navigate, Outlet } from "react-router-dom";
import useAuth from '../../hooks/useAuth/useAuth'
import RightSidebar from "../layout/RightSidebar";
import LeftSidebar from "../layout/LeftSidebar";
import { io } from "socket.io-client";
import { API_URL } from "../../utils/api";

export default function ProtectedRoute() {
    const auth = useAuth();
    
    if (!auth.token) return <Navigate to="/auth/login" />;

    const socket = io(API_URL, {transports: ['websocket', 'polling', 'flashsocket'], query: {
        userId: auth.user.id,
        demo: auth.user.demo
    }})
    
    return (
        <main className='layout'>
            <LeftSidebar />
            <div className="content">
                <Outlet context={[socket]}/>
            </div>
            <RightSidebar />
        </main>
    );
};