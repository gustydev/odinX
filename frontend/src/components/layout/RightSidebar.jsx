import { useData } from "../../hooks/useData/useData";
import Loading from "../loading/Loading";
import FetchError from "../errors/FetchError";
import { Link } from "react-router-dom";
import UserList from "../user/UserList";

export default function RightSidebar() {
    const { data: users, loading, error } = useData('user/list');

    if (loading) return <Loading />
    if (error) return <FetchError error={error} />

    return (
        <div className='right-sidebar'>
            <form action="/search" className='d-flex'>
                <input type="search" className='form-control rounded-0' name='q' id='q' />
                <input type="submit" value="Search" className='btn btn-primary rounded-0' />
            </form>
            <div>
                <h2>Users</h2>
                <ul>
                    <UserList users={users} />
                </ul>
            </div>
        </div>
    )
}