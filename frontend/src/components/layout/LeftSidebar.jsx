import useAuth from "../../hooks/useAuth/useAuth";
import { useNavigate } from "react-router-dom";

const buttonStyle = 'btn fw-bold rounded-0 ';

export default function LeftSidebar( {setPostFormActive} ) {
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
            {auth.token && (
                <button onClick={auth.logOut} className={buttonStyle + 'btn-outline-secondary'}>
                    ⎋ Log out
                </button>
            )}
        </div>
    )
}