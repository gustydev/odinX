import { Navigate, Outlet } from "react-router-dom";
import useAuth from './useAuth'

export default function ProtectedRoute() {
    const auth = useAuth();
    
    if (!auth.token) return <Navigate to="/auth/login" />;
    
    return (
        <Outlet />
    );
};