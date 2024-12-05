import { useData } from "../../hooks/useData/useData";
import Loading from "../loading/Loading";
import FetchError from "../errors/FetchError";
import UserList from "../user/UserList";
import SearchForm from "../search/SearchForm";

export default function RightSidebar( {socket} ) {
    const { data: users, loading, error } = useData('user/list?limit=5');
    
    if (loading) return <Loading />
    if (error) return <FetchError error={error} />

    return (
        <div className='right-sidebar'>
            <SearchForm />
            <div className='mt-4'>
                <h2 className='mb-2'>Users</h2>
                <UserList users={users} socket={socket} />
            </div>
        </div>
    )
}