import useAuth from "../../hooks/useAuth/useAuth"

export default function TopBar() {
    const auth = useAuth();

    return (
        <>
        <h1>Odinbook</h1>
        {auth.token && (
            <>
            <p>Welcome back, @{auth.user.username}</p>
            <button onClick={auth.logOut} className='btn btn-outline-secondary'>
                Log out
            </button>
            </>
        )}
        </>
    )
}