import LoginForm from "./LoginForm";
import useAuth from '../../hooks/useAuth/useAuth'
import { registerUser } from "../../utils/apiRequests";

export default function Login() {
    const auth = useAuth();

    async function login(data) {
        await auth.userLogin(data)
    }

    async function guestLogin(e) {
        e.preventDefault()
        
        const data = {
            username: import.meta.env.VITE_DEMO_USERNAME,
            password: import.meta.env.VITE_DEMO_PASSWORD,
            displayName: 'Guest User',
            confirmPassword: import.meta.env.VITE_DEMO_PASSWORD,
            demo: true
        }

        // Create the guest account, if it doesn't exist
        await registerUser(data);

        // Log in with it
        await login(data)
    }

    return (
        <main className='login'>
            <h1 className='mb-2'>Welcome to OdinX!</h1>
            <LoginForm onSubmit={login} guestLogin={guestLogin} />
        </main>
    )
}