import { Navigate, Outlet } from "react-router-dom";
import useAuth from '../../hooks/useAuth/useAuth'
import RightSidebar from "../layout/RightSidebar";
import LeftSidebar from "../layout/LeftSidebar";
import { io } from "socket.io-client";
import { API_URL } from "../../utils/api";
import MobileMenu from "../layout/MobileMenu";
import SearchForm from "../search/SearchForm";
import { useState } from "react";
import PostForm from "../post/PostForm";

export default function ProtectedRoute() {
    const auth = useAuth();
    const [postFormActive, setPostFormActive] = useState(false);
    
    if (!auth.token) return <Navigate to="/auth/login" />;

    const socket = io(API_URL, {transports: ['websocket', 'polling', 'flashsocket'], query: {
        userId: auth.user.id,
        demo: auth.user.demo
    }})
    
    return (
        <main className='layout'>
            <LeftSidebar setPostFormActive={setPostFormActive} />
            <div className="content">
                <div className='mobile-only'>
                    <SearchForm/>
                </div>
                <Outlet context={[socket]} />
            </div>
            <RightSidebar socket={socket} />
            <MobileMenu setPostFormActive={setPostFormActive} />
            <div className={"modal " + (postFormActive ? 'd-block' : 'd-none')}>
            {postFormActive && (
                <PostForm 
                    auth={auth} 
                    setFormActive={setPostFormActive} 
                />
            )}
            </div>
        </main>
    );
};