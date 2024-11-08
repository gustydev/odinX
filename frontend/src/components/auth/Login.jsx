import LoginForm from "./LoginForm";
import { Link } from "react-router-dom";
import useAuth from '../../hooks/useAuth/useAuth'

export default function Login() {
    const auth = useAuth();

    async function login(data) {
        await auth.userLogin(data)
    }

    async function loginDemo() {
        await login({
            username: import.meta.env.VITE_DEMO_USERNAME,
            password: import.meta.env.VITE_DEMO_PASSWORD
        })
    }

    return (
        <main className='login'>
            <h2>Welcome!</h2>
            <LoginForm onSubmit={login}/>
            <Link to='/auth/register'>
                <button className="btn btn-warning">Create an account</button>
            </Link>
            <button className='btn btn-success' onClick={loginDemo}>Use a demo account</button>
        </main>
    )
}