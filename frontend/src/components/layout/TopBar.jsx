import useAuth from "../../hooks/useAuth/useAuth"

export default function TopBar() {
    const auth = useAuth();

    return (
        <div className='topbar'>
            <h1>Odin-X</h1>
            {auth.token && (
                <button onClick={auth.logOut} className='btn btn-outline-secondary'>
                    Log out
                </button>
            )}
        </div>
    )
}