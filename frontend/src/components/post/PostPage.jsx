import { useParams } from "react-router-dom";
import { useData } from "../../hooks/useData/useData";
import Post from "./Post";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function PostPage() {
    const { postId } = useParams();
    const { data: post, setData: setPost, loading: loadingPost, error: postError } = useData(`post/${postId}`);
    const { data: replies, setData: setReplies, loading: loadingReplies, error: repliesError } = useData(`post/${postId}/replies`)
    const replyRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const hash = window.location.hash;
        if (hash === '#reply') {
            replyRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    if (loadingPost || loadingReplies) return 'Loading'
    if (postError || repliesError) return 'Error'

    return (
        <div className='post-page'>
            <div className='page-bar'>
                <h2>Post</h2>
                <button onClick={() => navigate(-1)} className='btn btn-outline-dark fw-bold'>↰</button>
            </div>
            <Post post={post}/>
            <div className="replies" id='reply'>
            {replies.map((reply) => {
                return <Post key={reply.id} post={reply}/>
            })}
            </div>
        </div>
    )
}