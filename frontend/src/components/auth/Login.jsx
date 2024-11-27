import LoginForm from "./LoginForm";
import { Link } from "react-router-dom";
import useAuth from '../../hooks/useAuth/useAuth'
import { registerUser } from "../../utils/apiRequests";

export default function Login() {
    const auth = useAuth();

    async function login(data) {
        await auth.userLogin(data)
    }

    async function demo() {
        const data = {
            username: import.meta.env.VITE_DEMO_USERNAME,
            password: import.meta.env.VITE_DEMO_PASSWORD,
            displayName: 'Demo Man',
            confirmPassword: import.meta.env.VITE_DEMO_PASSWORD,
            demo: true
        }

        // Create the demo account, if it doesn't exist
        await registerUser(data);

        // Log in with it
        await login(data)
    }

    return (
        <main className='login'>
            <h2>Welcome!</h2>
            <LoginForm onSubmit={login}/>
            <Link to='/auth/register'>
                <button className="btn btn-warning">Create an account</button>
            </Link>
            <button className='btn btn-success' onClick={demo}>Use a demo account</button>
        </main>
    )
}