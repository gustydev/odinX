import RegisterForm from "./RegisterForm";
import { Link } from "react-router-dom";

export default function Register() {
    return (
        <div>
            <h2>Register</h2>
            <RegisterForm/>
            <Link to='/auth/login'>
                <button className="btn btn-secondary">Return to login</button>
            </Link>
        </div>
    )
}