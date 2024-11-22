import { followUser } from "../../utils/apiRequests"

const style = 'btn rounded-0 '

export default function FollowButton( { user, auth, socket } ) {
    const isFollowing = user.followers?.find((follower) => follower.id === auth.user.id);

    return (
        <button title={isFollowing ? 'Unfollow' : 'Follow'}className={style + 'btn-outline-' + (isFollowing ? 'danger' : 'primary')} onClick={() => followUser(user.id, auth.token, socket)}>
            {isFollowing ? '✖' : '✚'}
        </button>
    )
}