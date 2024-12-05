import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth/useAuth";

const buttonStyle = 'btn fw-bold rounded-0 ';

export default function MobileMenu( { setPostFormActive } ) {
    const navigate = useNavigate();
    const auth = useAuth();

    return (
        <div className='mobile-menu btn-group d-flex'>
            <button 
            onClick={() => navigate('/')}
            className={buttonStyle + 'btn-danger'}
            title="Home"
            >
                ⌂
            </button>

            <button 
            onClick={() => navigate(`/user/${auth.user.id}`)}
            className={buttonStyle + 'btn-success'}
            title='Profile'
            >
                ◉
            </button>

            <button 
            onClick={() => setPostFormActive(true)}
            className={buttonStyle + 'btn-primary'}
            title="New Post"
            >
                🖉
            </button>

            {auth.token && (
                <button 
                onClick={auth.logOut} 
                className={buttonStyle + 'btn-secondary'}
                title='Log out'
                >
                    ⎋
                </button>
            )}
        </div>
    )
}