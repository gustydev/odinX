import { Link } from "react-router-dom"
export default function UserDisplay( {user} ) {
    return (
        <div>
            <p>
                <strong>{user.displayName}</strong>
                &nbsp; 
                <Link to={`/user/${user.id}`}>@{user.username}</Link>
            </p>
        </div>
    )
}