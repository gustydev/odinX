import { useOutletContext } from "react-router-dom";
import useAuth from "../../hooks/useAuth/useAuth"
import { likePost } from "../../utils/apiRequests";
import { useEffect, useState } from "react";

export default function Post( {post} ) {
    const auth = useAuth();
    const [socket] = useOutletContext();
    const [likes, setLikes] = useState(post._count.likes);

    useEffect(() => {
        socket.on('likePost', (postData) => {
            if (post.id === postData.id) {
                setLikes(postData.likes.length)
            }
        })

        return () => {
            socket.off('likePost')
        }
    }, [socket, post])

    return (
        <div className='post'>
            <div className='authorInfo'>
                {/* <img src={data.author.profilePicUrl} alt={data.author.username + ' profile picture'} /> */}
                <p>{post.author.displayName} @{post.author.username}</p>
            </div>
            <div className='postContent'>
                {post.content}
            </div>
            <div className='postDate'>
                {new Date(post.postDate).toLocaleString()}
            </div>
            <div className='postStats btn-group'>
                <button className='btn btn-outline-dark rounded-0 border-0' onClick={() => {likePost(post.id, auth.token, socket)}}>
                    ❤️ {likes} 
                </button> 
                <button className='btn btn-outline-dark rounded-0 border-0'>
                    🗫 {post._count.replies}
                </button>
            </div>
        </div>
    )
}