import { Navigate, Outlet } from "react-router-dom";
import useAuth from '../../hooks/useAuth/useAuth'

export default function ProtectedRoute() {
    const auth = useAuth();
    
    if (!auth.token) return <Navigate to="/auth/login" />;
    
    return (
        <main className='layout'>
            <div className='left-sidebar'>
                A
            </div>
            <div className="content">
                <Outlet />
            </div>
            <div className="right-sidebar">
                C
            </div>
        </main>
    );
};