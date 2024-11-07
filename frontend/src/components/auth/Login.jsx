import LoginForm from "./LoginForm";
import { Link } from "react-router-dom";

export default function Login() {
    return (
        <div className='login'>
            <h2>Welcome!</h2>
            <LoginForm/>
            <Link to='/auth/register'>
                <button className="btn btn-warning">Create an account</button>
            </Link>
            <button className='btn btn-success'>Use a demo account</button>
        </div>
    )
}