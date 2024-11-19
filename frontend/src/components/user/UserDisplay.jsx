import { useState } from "react"
import { Link } from "react-router-dom"

export default function UserDisplay( {user} ) {
    const [userInfo, setUserInfo] = useState(user)

    return (
        <li>
            <strong>{userInfo.displayName}</strong>
            &nbsp; 
            <Link to={`/user/${userInfo.id}`}>@{userInfo.username}</Link>
        </li>
    )
}