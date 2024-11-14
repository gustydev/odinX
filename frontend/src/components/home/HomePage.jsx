import { useState } from "react";
import { useData } from "../../hooks/useData/useData";
import Post from "../post/Post";
import Loading from '../loading/Loading';
import FetchError from '../errors/FetchError';

const buttonStyle = 'btn btn-outline-dark rounded-0 '

export default function HomePage() {
    const [tab, setTab] = useState('all');
    const { data: posts, loading, error } = useData('post/list');

    if (loading) return <Loading />
    if (error) return <FetchError error={error}/>

    return (
        <div className='home'>
            <div className='page-bar'>
                <h2>Home</h2>
            </div>
            <div className='btn-group d-flex'>
                <button className={buttonStyle + (tab === 'all' ? 'active' : '')} onClick={() => setTab('all')}>
                    All posts
                </button>
                <button className={buttonStyle + (tab === 'follows' ? 'active' : '')} onClick={() => setTab('follows')}>
                    Your following
                </button>
            </div>
            <div className='posts d-flex flex-column gap-4 mt-4'>
                {posts?.map((post) => {
                    return <Post key={post.id} post={post} />
                })}
            </div>
        </div>
    )
}