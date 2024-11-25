import { useOutletContext, useParams } from "react-router-dom";
import { useData } from "../../hooks/useData/useData";
import Post from "./Post";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { postReply } from "../../utils/apiRequests";
import useAuth from "../../hooks/useAuth/useAuth";
import Loading from '../loading/Loading';
import FetchError from '../errors/FetchError';

export default function PostPage() {
    const { postId } = useParams();
    const { data: post, setData: setPost, loading: loadingPost, error: postError } = useData(`post/${postId}`);
    const { data: replies, setData: setReplies, loading: loadingReplies, error: repliesError } = useData(`post/${postId}/replies`)
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors}, reset } = useForm();
    const auth = useAuth();
    const [socket] = useOutletContext();
    
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
        reset();
    }

    if (loadingPost || loadingReplies) return <Loading />
    if (postError) return <FetchError error={postError} />
    if (repliesError) return <FetchError error={repliesError} />

    return (
        <div className='post-page'>
            <div className='page-bar'>
                <h2>Post</h2>
                <div className='btn-group d-flex'>
                    <button 
                        onClick={() => navigate(`/post/${post.parentPostId}`)} 
                        className={'btn btn-outline-dark fw-bold rounded-0 btn-sm ' + (!post.parentPostId && 'invisible')}>
                        ↩️
                    </button>
                </div>
            </div>
            <Post post={post}/>
            <div className="replies mb-3">
                {replies.map((reply) => {
                    return <Post key={reply.id} post={reply}/>
                })}
            </div>
            {post.postType === 'userPost' && 
            <form onSubmit={handleSubmit(handlePostReply)} className='form-group d-flex flex-column gap-1'>
                <textarea 
                    {...register('content', {
                        required: true,
                        minLength: 1,
                        maxLength: {value: 500, message: 'Post cannot surpass 500 characters'}
                    })} 
                    type="text" id="content" name="content" placeholder="What do you think of this post?" minLength={1} maxLength={500} rows={1}
                    className={`form-control ${errors.content ? "is-invalid" : ""}`}    
                />
                <input type="submit" value="Reply" className="btn btn-warning rounded-0 align-self-end" />
            </form>
            }
        </div>
    )
}