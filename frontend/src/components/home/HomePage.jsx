import { useEffect, useState } from "react";
import { useData } from "../../hooks/useData/useData";
import Loading from '../loading/Loading';
import FetchError from '../errors/FetchError';
import PostList from "../post/PostList";

const buttonStyle = 'btn btn-outline-dark font-weight-bold rounded-0 '

export default function HomePage() {
    const [tab, setTab] = useState('follows');
    const [page, setPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [end, setEnd] = useState(false);

    const { data: newPosts, loading: loadingNew, error } = useData(`post/list?follows=${tab === 'follows'}&limit=10&page=${page}`);

    useEffect(() => {
        setLoading(true)
        setPage(1);
    }, [tab])

    useEffect(() => {
        if (newPosts) {
            setTimeout(() => {
                setPosts(prev => (page === 1 ? newPosts : [...new Set([...prev, ...newPosts])])) // Set is used to prevent duplication
                setEnd(newPosts.length === 0)
                setLoading(false)
            }, 100)
            // Adding a small delay to make tab switching a bit more smooth
        }
    }, [newPosts, page])

    useEffect(() => {
        function handleScroll() {
            if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
                if (!end) setPage(prevPage => prevPage + 1);
            }
        }

        window.addEventListener('scroll', handleScroll)

        return () => window.removeEventListener('scroll', handleScroll);
    }, [end, loadingNew])

    if (error) return <FetchError error={error}/>

    return (
        <div className='home'>
            <div className='page-bar'>
                <h2>Home</h2>
            </div>
            <div className='btn-group d-flex mb-4'>
                <button className={buttonStyle + (tab === 'follows' ? 'active' : '')} onClick={() => setTab('follows')}>
                    Your following
                </button>
                <button className={buttonStyle + (tab === 'all' ? 'active' : '')} onClick={() => setTab('all')}>
                    All posts
                </button>
            </div>
            {loading ? <Loading /> : (
                <>
                <PostList posts={posts} />
                {posts.length < 1 && tab === 'follows' && 'Find some people to follow!'}
                {loadingNew && page > 1 && <Loading/>}
                {end && <div className='d-flex justify-content-center mt-4'>You have reached the end! Congratulations!</div>}
                </>
            )}
        </div>
    )
}