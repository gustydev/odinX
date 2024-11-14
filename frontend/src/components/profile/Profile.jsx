import { useParams } from "react-router-dom";
import { useData } from "../../hooks/useData/useData";
import Loading from "../loading/Loading";
import FetchError from "../errors/FetchError";
import PostList from "../post/PostList";
import { useState } from "react";

export default function Profile() {
    const { userId } = useParams();
    const [replies, setReplies] = useState(false);
    const { data: user, loading: userLoading, error: userError } = useData(`user/${userId}`);
    const { data: posts, loading: postsLoading, error: postsError } = useData(`user/${userId}/posts?replies=${replies}`);
    console.log(posts)

    if (userLoading || postsLoading) return <Loading/>
    if (userError) return <FetchError error={userError} />
    if (postsError) return <FetchError error={postsError} />

    return (
        <div className="user-profile">
            <div className="page-bar">
                <h2>Profile</h2>
            </div>
            <div>
                {/* <img src={user.profilePicUrl} alt={user.username + "'s profile picture"} /> */}
                <h3>{user.displayName} @{user.username}</h3>
                <p>{user.bio}</p>
                <p>Member since {new Date(user.joinDate).toLocaleDateString()}</p>
                <p>{user._count.followers} followers</p>
                <p>{user._count.following} following</p>
            </div>
            <div className='btn-group d-flex'>
                <button className="btn btn-primary">
                    Posts
                </button>
                <button className="btn btn-primary">
                    Replies
                </button>
            </div>
            <PostList posts={posts} />
        </div>
    )
}