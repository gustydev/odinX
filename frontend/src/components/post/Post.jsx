import { useLocation, useOutletContext } from "react-router-dom";
import useAuth from "../../hooks/useAuth/useAuth"
import { likePost } from "../../utils/apiRequests";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const buttonStyle = 'btn btn-outline-dark rounded-0 border-0'

export default function Post( {post} ) {
    const auth = useAuth();
    const [socket] = useOutletContext();
    const [likes, setLikes] = useState(post._count.likes);
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

    return (
        <div className='post'>
            <div className='authorInfo'>
                {/* <img src={data.author.profilePicUrl} alt={data.author.username + ' profile picture'} /> */}
                <p>{post.author.displayName} @{post.author.username}</p>
            </div>
            <div className={'postContent ' + (truncate && 'truncate')}>
                {post.content}
            </div>
            <div className='postDate'>
                <Link to={`/post/${post.id}`}>
                {new Date(post.postDate).toLocaleString()}
                </Link>
            </div>
            <div className='postStats btn-group'>
                <button className={buttonStyle} onClick={() => {likePost(post.id, auth.token, socket)}}>
                    ❤️ {likes} 
                </button>
                <Link to={`/post/${post.id}`} className={buttonStyle}>
                    🗫 {post._count.replies}
                </Link>
            </div>
        </div>
    )
}