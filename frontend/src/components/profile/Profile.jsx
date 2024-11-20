import { useOutletContext, useParams } from "react-router-dom";
import { useData } from "../../hooks/useData/useData";
import Loading from "../loading/Loading";
import FetchError from "../errors/FetchError";
import PostList from "../post/PostList";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth/useAuth";
import EditProfileForm from "./EditProfileForm";
import FollowButton from "../user/FollowButton";

const buttonStyle = 'btn btn-outline-dark rounded-0 border-dark '

export default function Profile() {
    const { userId } = useParams();
    const [replies, setReplies] = useState(false);
    const [editFormActive, setEditFormActive] = useState(false);
    const { data: user, setData: setUser, loading: userLoading, error: userError } = useData(`user/${userId}`);
    const { data: posts, loading: postsLoading, error: postsError } = useData(`user/${userId}/posts?replies=${replies}`);
    const auth = useAuth();
    const [socket] = useOutletContext()

    useEffect(() => {
        socket.on('followUser', (userData) => {
            if (userData.id === Number(userId)) {
                setUser(userData)
            }        
        })
    }, [socket, userId, setUser])

    if (userLoading) return <Loading/>
    if (userError) return <FetchError error={userError} />

    return (
        <div className="user-profile">
            <div className="page-bar">
                <h2>Profile</h2>
            </div>
            <div>
                {/* <img src={user.profilePicUrl} alt={user.username + "'s profile picture"} /> */}
                <div className="d-flex justify-content-between align-items-center gap-4 mb-2">
                    <div>
                        <h3>
                            {user.displayName}
                        </h3>
                        <p>
                            @{user.username}
                        </p>
                    </div>
                    {auth.user.id === user.id ? (
                        <button className={buttonStyle + 'btn-sm'} onClick={() => setEditFormActive(true)}>🖉 Edit</button>)
                    : (
                        <FollowButton user={user} auth={auth} socket={socket} />
                    )}
                </div>
                <p className='line-break-anywhere mt-2 mb-2'>{user.bio}</p>
                <p>Member since {new Date(user.joinDate).toLocaleDateString()}</p>
                <p>{user._count.followers} followers</p>
                <p>{user._count.following} following</p>
                
            </div>
            <div className='btn-group d-flex mt-3 mb-4'>
                <button className={buttonStyle + (!replies ? 'active' : '')} onClick={() => setReplies(false)}>
                    Posts
                </button>
                <button className={buttonStyle + (replies ? 'active' : '')} onClick={() => setReplies(true)}>
                    Replies
                </button>
            </div>
            {postsLoading? <Loading/> : postsError ? <FetchError error={postsError} /> : <PostList posts={posts} />}
            <div className={"modal " + (editFormActive ? 'd-block' : 'd-none')}>
                {editFormActive && <EditProfileForm user={user} auth={auth} setEditFormActive={setEditFormActive} />}
            </div>
        </div>
    )
}