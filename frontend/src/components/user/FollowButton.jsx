import { followUser } from "../../utils/apiRequests"

export default function FollowButton( { style, user, auth, socket } ) {
    return (
        <button className={style} onClick={() => followUser(user.id, auth.token, socket)}>
            {user.followers?.find((follower) => follower.id === auth.user.id) ? '✖ Unfollow' : '✚ Follow'}
        </button>
    )
}