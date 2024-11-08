import { useData } from "../../hooks/useData/useData"


export default function LeftSidebar() {
    const { data: users } = useData('user/list');

    return (
        <div className="left-sidebar">
            <div>
                <h2>Users</h2>
                <ul>
                    {users?.map((user) => {
                        return <p key={user.id}>{user.displayName} @{user.username}</p>
                    })}
                </ul>
            </div>
        </div>
    )
}