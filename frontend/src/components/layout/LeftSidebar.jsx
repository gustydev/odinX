import { useState } from "react";
import useAuth from "../../hooks/useAuth/useAuth";
import { useData } from "../../hooks/useData/useData"
import { useNavigate } from "react-router-dom";

const buttonStyle = 'btn btn-outline-dark fw-bold rounded-0';

export default function LeftSidebar() {
    const [postFormActive, setPostFormActive] = useState(false);
    const { data: users } = useData('user/list');
    const navigate = useNavigate();
    const auth = useAuth();

    return (
        <div className="left-sidebar">
            <div className="btn-group d-flex">
                <button onClick={() => navigate('/')} className={buttonStyle}>
                    🏠 Homepage
                </button>
                <button onClick={() => navigate(`/user/${auth.user.id}`)} className={buttonStyle}>
                    👤 Profile
                </button>
            </div>
            <button className={buttonStyle} onClick={() => setPostFormActive(true)}>
                🖉 New Post
            </button>
            <div>
                <h2>Users</h2>
                <ul>
                    {users?.map((user) => {
                        return <li key={user.id}>{user.displayName} @{user.username}</li>
                    })}
                </ul>
            </div>
            <div className={"modal " + (postFormActive ? 'd-block' : 'd-none')}>
            {postFormActive && (
                <form action="" className='post-form'>
                    <button className='btn btn-dark btn-sm close-form-btn rounded-0' onClick={() => setPostFormActive(false)}>X</button>
                    <h2>Write a post</h2>
                    <input type="text" />
                    <button type="submit" className='btn btn-warning'>Post</button>
                </form>
            )}
            </div>
        </div>
    )
}