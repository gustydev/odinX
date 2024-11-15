import { useData } from "../../hooks/useData/useData";
import Loading from "../loading/Loading";
import FetchError from "../errors/FetchError";
import { Link } from "react-router-dom";

export default function RightSidebar() {
    const { data: users, loading, error } = useData('user/list');

    if (loading) return <Loading />
    if (error) return <FetchError error={error} />

    return (
        <div className='right-sidebar'>
            <form action="">
                <input type="text" />
                <input type="submit" value="Search" />
            </form>
            <div>
                <h2>Users</h2>
                <ul>
                    {users?.map((user) => {
                        return <li key={user.id}>
                            <Link to={`/user/${user.id}`}>
                            {user.displayName} @{user.username}
                            </Link>
                        </li>
                    })}
                </ul>
            </div>
        </div>
    )
}