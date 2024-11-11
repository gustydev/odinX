import { useOutletContext, useParams } from "react-router-dom";
import { useData } from "../../hooks/useData/useData";
import Post from "./Post";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { postReply } from "../../utils/apiRequests";
import useAuth from "../../hooks/useAuth/useAuth";

export default function PostPage() {
    const { postId } = useParams();
    const { data: post, setData: setPost, loading: loadingPost, error: postError } = useData(`post/${postId}`);
    const { data: replies, setData: setReplies, loading: loadingReplies, error: repliesError } = useData(`post/${postId}/replies`)
    const replyRef = useRef(null);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors} } = useForm();
    const auth = useAuth();
    const [socket] = useOutletContext();

    useEffect(() => {
        const hash = window.location.hash;
        if (hash === '#reply') {
            replyRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    useEffect(() => {
        socket.on('postReply', (replyData) => {
            if (Number(postId) === replyData.parentPostId) {
                setReplies((prev) => [...prev, replyData])
            }        
        })

        return () => {
            socket.off('postReply')
        }
    }, [socket, postId, replies, setReplies])
    
    async function handlePostReply(data) {
        await postReply(postId, data, auth.token, socket)
    }

    if (loadingPost || loadingReplies) return 'Loading'
    if (postError || repliesError) return 'Error'

    return (
        <div className='post-page'>
            <div className='page-bar'>
                <h2>Post</h2>
                <button onClick={() => navigate(-1)} className='btn btn-outline-dark fw-bold'>↰</button>
            </div>
            <Post post={post}/>
            <form onSubmit={handleSubmit(handlePostReply)} className='d-flex'>
                <input 
                    {...register('content', {
                        required: 'Content required',
                        minLength: { value: 1, message: 'Required' },
                        maxLength: { value: 500, message: 'Maximum: 500 characters'}
                    })}
                    type="text" id='content' name='content' placeholder='Write a reply...' maxLength={500} minLength={1}
                />
                {errors.content && <span className="error">{errors.content.message}</span>}
                <input type="submit" value="Post" className="btn btn-warning" />
            </form>
            <div className="replies" id='reply'>
                {replies.map((reply) => {
                    return <Post key={reply.id} post={reply}/>
                })}
            </div>
        </div>
    )
}