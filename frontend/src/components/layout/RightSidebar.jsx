import { useData } from "../../hooks/useData/useData";
import Loading from "../loading/Loading";
import FetchError from "../errors/FetchError";
import UserList from "../user/UserList";

export default function RightSidebar() {
    const { data: users, loading, error } = useData('user/list');

    if (loading) return <Loading />
    if (error) return <FetchError error={error} />

    return (
        <div className='right-sidebar'>
            <form action="/search" className='d-flex gap-1'>
                <input type="search" className='form-control' name='q' id='q' required minLength={1} maxLength={50} />
                <input type="submit" value="🔍" className='btn btn-primary' />
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