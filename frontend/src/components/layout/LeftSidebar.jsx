import useAuth from "../../hooks/useAuth/useAuth";
import { useData } from "../../hooks/useData/useData"
import { useNavigate } from "react-router-dom";

const buttonStyle = 'btn btn-outline-dark fw-bold rounded-0';

export default function LeftSidebar() {
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
            <button className={buttonStyle}>
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
        </div>
    )
}