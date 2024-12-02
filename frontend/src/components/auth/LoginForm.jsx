import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

export default function LoginForm( {onSubmit, guestLogin} ) {
    const { register, handleSubmit, formState: { errors} } = useForm();
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form mb-4">
            <h2 className='align-self-center'>Log in</h2>
            <div className='form-group'>
                <label htmlFor="username">Username*</label>
                <input
                    {...register("username", { 
                        required: 'Required', 
                        maxLength: {value: 30, message: 'Maximum length: 30 characters'}, 
                        minLength: {value: 4, message: 'Minimum length: 4 characters'},
                        pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Only alphanumeric characters (letters, numbers, underscores) allowed' }
                    })}
                    type="text" id="username" name="username" placeholder="Username" maxLength={30}
                    className={`form-control ${errors.username ? "is-invalid" : ""}`}
                />
                {errors.username && <span className="error">{errors.username.message}</span>}
            </div>
            <div className='form-group'>
                <label htmlFor="password">Password*</label>
                <input
                    {...register("password", { 
                        required: 'Required', 
                        minLength: {value: 8, message: 'Minimum length: 8 characters'},
                        maxLength: {value: 100, message: 'Maximum length: 100 characters'} 
                    })}
                    type="password" id="password" name="password" maxLength={100}
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                />
                {errors.password && <span className="error">{errors.password.message}</span>}
            </div>
            <input type="submit" value="Log in" className="btn btn-primary" />
            <button className='btn btn-success' onClick={guestLogin}>Log in as guest</button>
            <Link to='/auth/register' className='btn btn-warning'>
                Create account
            </Link>
        </form>
    )
}