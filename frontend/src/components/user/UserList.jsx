import UserDisplay from "./UserDisplay"

export default function UserList( {users} ) {
    return (
        <div className='d-flex flex-column'>
            {users?.length < 1 ? 'Nothing to see here...' : users?.map((user) => {
                return <UserDisplay key={user.id} user={user} />
            })}
        </div>
    )
}