import { useState } from "react";
import useAuth from "../../hooks/useAuth/useAuth";
import { useNavigate } from "react-router-dom";
import PostForm from "../post/PostForm";

const buttonStyle = 'btn fw-bold rounded-0 ';

export default function LeftSidebar() {
    const [postFormActive, setPostFormActive] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();

    return (
        <div className="left-sidebar">
            <strong className="text-center">Welcome back, @{auth.user.username}!</strong>
            <div className="btn-group d-flex">
                <button onClick={() => navigate('/')} className={buttonStyle + 'btn-danger'}>
                    ⌂ Home
                </button>
                <button onClick={() => navigate(`/user/${auth.user.id}`)} className={buttonStyle + 'btn-success'}>
                    ◉ Profile
                </button>
            </div>
            <button className='btn btn-primary fw-bold rounded-0' onClick={() => setPostFormActive(true)}>
                🖉 New Post
            </button>
            <div className={"modal " + (postFormActive ? 'd-block' : 'd-none')}>
            {postFormActive && (
                <PostForm 
                    auth={auth} 
                    setFormActive={setPostFormActive} 
                />
            )}
            </div>
        </div>
    )
}