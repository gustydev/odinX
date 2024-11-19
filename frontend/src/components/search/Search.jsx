import { useOutletContext, useSearchParams } from "react-router-dom"
import { useData } from "../../hooks/useData/useData";
import Loading from "../loading/Loading";
import FetchError from "../errors/FetchError";
import PostList from "../post/PostList";
import UserList from '../user/UserList';

export default function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q').trim();
    const { data, loading, error } = useData(`search?q=${query}`);
    const [socket] = useOutletContext();

    return (
        <div className='search'>
            <div className='page-bar'>
                <h2>Search: "{query}"</h2>
            </div>
            {loading ? <Loading/> : error ? <FetchError error={error}/> : (
                <>
                    <h3 className='mb-2'>Users</h3>
                    <UserList users={data.users} socket={socket} />
                    <h3 className='mb-1 mt-4'>Posts</h3>
                    <PostList posts={data.posts}/>
                </>
            )}
        </div>
    )
}