import { Navigate, Outlet } from "react-router-dom";
import useAuth from '../../hooks/useAuth/useAuth'
import RightSidebar from "../layout/RightSidebar";
import LeftSidebar from "../layout/LeftSidebar";

export default function ProtectedRoute() {
    const auth = useAuth();
    
    if (!auth.token) return <Navigate to="/auth/login" />;
    
    return (
        <main className='layout'>
            <LeftSidebar />
            <div className="content">
                <Outlet />
            </div>
            <RightSidebar />
        </main>
    );
};