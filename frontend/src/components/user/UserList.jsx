import UserInfo from "./UserInfo"

export default function UserList( {users, socket} ) {
    return (
        <ul className='d-flex flex-column list-group rounded-0'>
            {users?.length < 1 ? 'Nothing to see here...' : users?.map((user) => {
                return <UserInfo key={user.id} user={user} socket={socket} isListItem={true}/>
            })}
        </ul>
    )
}