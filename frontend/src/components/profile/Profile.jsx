import { useOutletContext, useParams } from "react-router-dom";
import { useData } from "../../hooks/useData/useData";
import Loading from "../loading/Loading";
import FetchError from "../errors/FetchError";
import PostList from "../post/PostList";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth/useAuth";
import EditProfileForm from "./EditProfileForm";
import UserInfo from "../user/UserInfo";
import { dateFormat } from "../../utils/dateFormat";
import DeleteForm from "./DeleteForm";

const buttonStyle = 'btn btn-outline-dark rounded-0 border-dark '
const profileActionButton = buttonStyle + 'btn-sm'

export default function Profile() {
    const { userId } = useParams();
    const [tab, setTab] = useState('posts');
    const [editFormActive, setEditFormActive] = useState(false);
    const [deleteFormActive, setDeleteFormActive] = useState(false)
    const { data: user, setData: setUser, loading: userLoading, error: userError } = useData(`user/${userId}`);
    const postQuery = tab === 'replies' ? 'replies=true' : tab === 'likes' ? 'likes=true' : '';
    const { data: posts, loading: postsLoading, error: postsError } = useData(`user/${userId}/posts?${postQuery}`);
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
            <div className="page-bar position-relative">
                <h2>Profile</h2>
                {auth.user.id === user.id && !auth.user.demo &&  
                    <div className='btn-group'>
                        <button className={profileActionButton} onClick={() => setEditFormActive(true)}>🖉 Edit</button>
                        <button className={profileActionButton} onClick={() => setDeleteFormActive(true)}>🗑 Delete account</button>
                    </div>
                }
            </div>
            <div>
                <UserInfo user={user} socket={socket} />
                <p className='line-break-anywhere mt-2 mb-2'>{user.bio}</p>
                <p>Member since {dateFormat(user.joinDate)}</p>
                <p>{user._count.followers} followers</p>
                <p>{user._count.following} following</p>
            </div>
            <div className='btn-group d-flex mt-3 mb-4 tab-select'>
                <button className={buttonStyle + (tab === 'posts' ? 'active' : '')} onClick={() => setTab('posts')}>
                    Posts
                </button>
                <button className={buttonStyle + (tab === 'replies' ? 'active' : '')} onClick={() => setTab('replies')}>
                    Replies
                </button>
                <button className={buttonStyle + (tab === 'likes' ? 'active' : '')} onClick={() => setTab('likes')}>
                    Likes
                </button>
            </div>
            {postsLoading? <Loading/> : postsError ? <FetchError error={postsError} /> : <PostList posts={posts} />}
            <div className={"modal " + (editFormActive || deleteFormActive ? 'd-block' : 'd-none')}>
                {editFormActive && <EditProfileForm user={user} auth={auth} setEditFormActive={setEditFormActive} />}
                {deleteFormActive && <DeleteForm user={user} auth={auth} setDeleteFormActive={setDeleteFormActive} />}
            </div>
        </div>
    )
}