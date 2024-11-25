import { useLocation, useOutletContext } from "react-router-dom";
import useAuth from "../../hooks/useAuth/useAuth"
import { deletePost, likePost } from "../../utils/apiRequests";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserInfo from "../user/UserInfo";
import PostForm from "./PostForm";
import { dateFormat } from "../../utils/dateFormat";

const buttonStyle = 'btn rounded-2 border-0 '

export default function Post( {post} ) {
    const auth = useAuth();
    const [socket] = useOutletContext();
    const [likeCount, setLikeCount] = useState(post._count.likes);
    const [editFormActive, setEditFormActive] = useState(false)
    const location = useLocation();
    let truncate = true;

    if (location.pathname === `/post/${post.id}`) {
        // Don't truncate content in post's own page
        truncate = false
    }

    useEffect(() => {
        socket.on('likePost', (postData) => {
            if (post.id === postData.id) {
                setLikeCount(postData._count.likes)
            }
        })
    }, [socket, post])

    async function handleDelete() {
        const popup = confirm('Are you sure you want to delete your post? This cannot be undone! (Note: replies will remain intact)')
        if (popup) {
            await deletePost(post.id, auth.token)
        }
        return;
    }

    const postDate = dateFormat(post.postDate)
    const editDate = dateFormat(post.editDate)

    return (
        <div className='post position-relative'>
            {post.postType === 'systemPost' ? (
                // If the post was deleted, return just the content and the button to view replies
                <div className='postContent mb-3 mt-1 d-flex justify-content-between align-items-center'>
                    {post.content}
                    {post._count.replies > 0 && 
                    <Link title={`${post._count.replies} replies`}to={`/post/${post.id}`} className={buttonStyle + 'btn-outline-dark align-self-start mt-1'}>
                        🗫 {post._count.replies}
                    </Link>}
                </div>
            ) : (
                <>
                <UserInfo user={post.author} socket={socket} />
                {post.author.id === auth.user.id &&
                    <div className='btn-group position-absolute end-0 top-0'>
                        <button title='Edit post' onClick={() => setEditFormActive(true)} className='btn btn-sm btn-success'>
                            🖉
                        </button>
                        <button title='Delete post' className='btn btn-sm btn-danger' onClick={handleDelete}>
                            🗑
                        </button>
                    </div> 
                }
                <div className={'postContent mb-3 mt-1 ' + (truncate && 'truncate')}>
                    {post.content}
                </div>
                <div className='postDate'>
                    <Link to={`/post/${post.id}`}>
                        {postDate}
                    </Link>
                    &nbsp;
                    {post.editDate && <span className='edited' title={`Original post: ${postDate}\nLast edited: ${editDate}`}>(Edited)</span>}
                </div>
                <div className='postStats btn-group'>
                    <button title={`${likeCount} likes`}className={buttonStyle + 'btn-outline-danger'} onClick={() => {likePost(post.id, auth.token, socket)}}>
                        ❤️ {likeCount} 
                    </button>
                    <Link title={`${post._count.replies} replies`}to={`/post/${post.id}`} className={buttonStyle + 'btn-outline-primary'}>
                        🗫 {post._count.replies}
                    </Link>
                </div>
                <div className={"modal " + (editFormActive ? 'd-block' : 'd-none')}>
                    {editFormActive && <PostForm auth={auth} setFormActive={setEditFormActive} editing={true} post={post} />}
                </div>
                </>
            )}
        </div>
    )
}