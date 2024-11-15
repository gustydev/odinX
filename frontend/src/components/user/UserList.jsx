import User from "./User"

export default function UserList( {users} ) {
    return (
        <div className='d-flex flex-column'>
            {users?.length < 1 ? 'Nothing to see here...' : users?.map((user) => {
                return <User key={user.id} user={user} />
            })}
        </div>
    )
}