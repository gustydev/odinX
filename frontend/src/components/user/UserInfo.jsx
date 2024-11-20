import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import FollowButton from "./FollowButton"
import useAuth from "../../hooks/useAuth/useAuth"

const buttonStyle = 'btn rounded-0 btn-sm '

export default function UserInfo( {user, socket, isListItem} ) {
    const [userInfo, setUserInfo] = useState(user)
    const auth = useAuth();

    useEffect(() => {
        socket.on('followUser', (userData) => {
            if (userData.id === Number(userInfo.id)) {
                setUserInfo(userData)
            }        
        })
    }, [socket, userInfo, setUserInfo])

    function Info() {
        return (
            <>
            <div className="d-inline-block text-truncate">
                <Link to={`/user/${userInfo.id}`} className='profile-link'>
                    <strong>{userInfo.displayName}</strong>
                </Link>
                <p>
                    @{userInfo.username}
                </p>
            </div>
            {userInfo.id !== auth.user.id && <FollowButton user={userInfo} auth={auth} socket={socket} style={buttonStyle} />}
            </>
        )
    }

    return (
        isListItem ? <li className='user-info list-group-item border-dark'>
            <Info/>
        </li> 
        : <div className='user-info'>
            <Info/>
        </div>
    )
}