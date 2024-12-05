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
                <div className='d-flex gap-2 align-items-center'>
                    <img 
                    src={userInfo.profilePicUrl || `/images/blank-profile-picture.png`} 
                    alt={userInfo.profilePicUrl ? `${userInfo.username}'s profile picture` : 'blank profile picture'} 
                    className='img-fluid pic'
                    />
                    <div>
                        <Link to={`/user/${userInfo.id}`} className='profile-link'>
                            <strong>{userInfo.displayName}</strong>
                            <p>
                                @{userInfo.username}
                            </p>
                        </Link>
                    </div>
                </div>
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