import { useState } from "react";
import { useData } from "../../hooks/useData/useData";

export default function HomePage() {
    const [tab, setTab] = useState('all');
    const { data: posts } = useData('post/list');

    return (
        <div className='home'>
            <div className='btn-group d-flex'>
                <button className={'btn btn-outline-dark ' +  (tab === 'all' ? 'active' : '')} onClick={() => setTab('all')}>
                    All posts
                </button>
                <button className={'btn btn-outline-dark ' + (tab === 'follows' ? 'active' : '')} onClick={() => setTab('follows')}>
                    Your following
                </button>
            </div>
            <div className='posts'>
                {posts?.map((p) => {
                    return <p key={p.id}>{p.content}</p>
                })}
            </div>
        </div>
    )
}