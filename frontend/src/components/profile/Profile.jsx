import { useParams } from "react-router-dom";
import { useData } from "../../hooks/useData/useData";
import Loading from "../loading/Loading";
import FetchError from "../errors/FetchError";
import PostList from "../post/PostList";
import { useState } from "react";
import useAuth from "../../hooks/useAuth/useAuth";

const buttonStyle = 'btn btn-outline-dark rounded-0 '
const actionButtonStyle = buttonStyle + 'btn-sm position-absolute '

export default function Profile() {
    const { userId } = useParams();
    const [replies, setReplies] = useState(false);
    const { data: user, loading: userLoading, error: userError } = useData(`user/${userId}`);
    const { data: posts, loading: postsLoading, error: postsError } = useData(`user/${userId}/posts?replies=${replies}`);
    const auth = useAuth();

    if (userLoading) return <Loading/>
    if (userError) return <FetchError error={userError} />
    console.log(user)
    return (
        <div className="user-profile">
            <div className="page-bar">
                <h2>Profile</h2>
            </div>
            <div className='position-relative'>
                {/* <img src={user.profilePicUrl} alt={user.username + "'s profile picture"} /> */}
                <h3><strong>{user.displayName}</strong> @{user.username}</h3>
                <p>{user.bio}</p>
                <p>Member since {new Date(user.joinDate).toLocaleDateString()}</p>
                <p>{user._count.followers} followers</p>
                <p>{user._count.following} following</p>
                {auth.user.id === user.id && <button className={actionButtonStyle + 'top-0 end-0'}>Edit 🖉</button>}
                {auth.user.id !== user.id && (
                    <button className={actionButtonStyle + 'bottom-0 end-0'}>
                        {user.followers.find((follower) => follower.id === auth.user.id) ? 'Unfollow' : 'Follow'}
                    </button>
                )}
            </div>
            <div className='btn-group d-flex mt-3'>
                <button className={buttonStyle + (!replies ? 'active' : '')} onClick={() => setReplies(false)}>
                    Posts
                </button>
                <button className={buttonStyle + (replies ? 'active' : '')} onClick={() => setReplies(true)}>
                    Replies
                </button>
            </div>
            {postsLoading? <Loading/> : postsError ? <FetchError error={postsError} /> : <PostList posts={posts} />}
        </div>
    )
}