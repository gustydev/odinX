import { useSearchParams } from "react-router-dom"
import { useData } from "../../hooks/useData/useData";
import Loading from "../loading/Loading";
import FetchError from "../errors/FetchError";
import PostList from "../post/PostList";
import UserList from '../user/UserList';

export default function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const { data, loading, error } = useData(`search?q=${query}`);

    return (
        <div className='search'>
            <div className='page-bar'>
                <h2>Search</h2>
            </div>
            {loading ? <Loading/> : error ? <FetchError error={error}/> : (
                <>
                    <h3>Users</h3>
                    <UserList users={data.users}/>
                    <h3 className='mt-4'>Posts</h3>
                    <PostList posts={data.posts}/>
                </>
            )}
        </div>
    )
}