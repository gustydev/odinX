import { useParams } from "react-router-dom";
import { useData } from "../../hooks/useData/useData";
import Post from "./Post";

export default function PostPage() {
    const { postId } = useParams();
    const { data: post, setData: setPost, loading: loadingPost, error: postError } = useData(`post/${postId}`);
    const { data: replies, setData: setReplies, loading: loadingReplies, error: repliesError } = useData(`post/${postId}/replies`)

    if (loadingPost || loadingReplies) return 'Loading'
    if (postError || repliesError) return 'Error'

    return (
        <div className='post-page'>
            <Post post={post}/>
            <div className="reply-container">
                <h2>Replies ({replies?.length})</h2>
                <div className="replies">
                {replies.map((reply) => {
                    return <Post key={reply.id} post={reply}/>
                })}
                </div>
            </div>
        </div>
    )
}