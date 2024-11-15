import { useState } from "react";
import { useData } from "../../hooks/useData/useData";
import Loading from '../loading/Loading';
import FetchError from '../errors/FetchError';
import PostList from "../post/PostList";

const buttonStyle = 'btn btn-outline-dark rounded-0 '

export default function HomePage() {
    const [tab, setTab] = useState('follows');
    const { data: posts, loading, error } = useData(`post/list?follows=${tab === 'follows'}`);

    if (loading) return <Loading />
    if (error) return <FetchError error={error}/>

    return (
        <div className='home'>
            <div className='page-bar'>
                <h2>Home</h2>
            </div>
            <div className='btn-group d-flex'>
                <button className={buttonStyle + (tab === 'follows' ? 'active' : '')} onClick={() => setTab('follows')}>
                    Your following
                </button>
                <button className={buttonStyle + (tab === 'all' ? 'active' : '')} onClick={() => setTab('all')}>
                    All posts
                </button>
            </div>
            <PostList posts={posts} />
            {posts.length < 1 && tab === 'follows' && 'Find some people to follow!'}
        </div>
    )
}