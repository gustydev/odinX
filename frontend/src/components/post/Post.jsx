import { useLocation, useOutletContext } from "react-router-dom";
import useAuth from "../../hooks/useAuth/useAuth"
import { likePost } from "../../utils/apiRequests";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserInfo from "../user/UserInfo";
import PostForm from "./PostForm";
import { dateFormat } from "../../utils/dateFormat";

const buttonStyle = 'btn rounded-2 border-0 '

export default function Post( {post} ) {
    const auth = useAuth();
    const [socket] = useOutletContext();
    const [likes, setLikes] = useState(post._count.likes);
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
                setLikes(postData._count.likes)
            }
        })
    }, [socket, post])

    const postDate = dateFormat(post.postDate)
    const editDate = dateFormat(post.editDate)

    return (
        <div className='post'>
            <UserInfo user={post.author} socket={socket} />
            {post.author.id === auth.user.id && 
                <button onClick={() => setEditFormActive(true)} className='btn btn-sm btn-outline-dark'>EDIT</button>
            }
            <div className={'postContent mb-3 mt-1 ' + (truncate && 'truncate')}>
                {post.content}
            </div>
            <div className='postDate'>
                <Link to={`/post/${post.id}`}>
                    {postDate}
                </Link>
                {post.editDate && <span title={`Original post: ${postDate}\nLast edited: ${editDate}`}>&nbsp;(Edited)</span>}
            </div>
            <div className='postStats btn-group'>
                <button className={buttonStyle + 'btn-outline-danger'} onClick={() => {likePost(post.id, auth.token, socket)}}>
                    ❤️ {likes} 
                </button>
                <Link to={`/post/${post.id}`} className={buttonStyle + 'btn-outline-primary'}>
                    🗫 {post._count.replies}
                </Link>
            </div>
            <div className={"modal " + (editFormActive ? 'd-block' : 'd-none')}>
                {editFormActive && <PostForm auth={auth} setFormActive={setEditFormActive} editing={true} post={post} />}
            </div>
        </div>
    )
}