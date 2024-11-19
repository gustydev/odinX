import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import FollowButton from "./FollowButton"
import useAuth from "../../hooks/useAuth/useAuth"

const buttonStyle = 'btn btn-outline-dark rounded-0 btn-sm'

export default function UserDisplay( {user, socket} ) {
    const [userInfo, setUserInfo] = useState(user)
    const auth = useAuth();

    useEffect(() => {
        socket.on('followUser', (userData) => {
            if (userData.id === Number(userInfo.id)) {
                setUserInfo(userData)
            }        
        })
    }, [socket, userInfo, setUserInfo])

    return (
        <li className='user-display list-group-item'>
            <div>
                <strong>{userInfo.displayName}</strong>
                &nbsp;
                <Link to={`/user/${userInfo.id}`}>@{userInfo.username}</Link>
            </div>
            {userInfo.id !== auth.user.id && <FollowButton user={userInfo} auth={auth} socket={socket} style={buttonStyle} />}
        </li>
    )
}