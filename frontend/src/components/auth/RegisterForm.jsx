import { useForm } from 'react-hook-form';
import { registerUser } from "../../utils/apiRequests";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function RegisterForm() {
    const { register, handleSubmit, getValues, formState: { errors} } = useForm();
    const nav = useNavigate();

    async function onSubmit(data) {
        await registerUser(data, nav)
    }

    return (
        <form action="" onSubmit={handleSubmit(onSubmit)} className='auth-form mb-4'>
            <h2 className='align-self-center'>Register</h2>
            <div className='form-group'>
                <label htmlFor="username">Username*:</label>
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
                <label htmlFor="displayName">Display name (optional):</label>
                <input 
                    {...register('displayName', {
                        required: false,
                        minLength: { value: 2, message: 'Minimum length: 1 character' },
                        maxLength: { value: 30, message: 'Maximum length: 30 characters' }
                    })}
                    type="text"  id='displayName' name='displayName' placeholder='Display name' maxLength={30}
                    className={`form-control ${errors.displayName ? "is-invalid" : ""}`}
                />
                {errors.displayName && <span className="error">{errors.displayName.message}</span>}
            </div>
            <div className='form-group'>
                <label htmlFor="password">Password*:</label>
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
            <div className='form-group'>
                <label htmlFor="confirmPassword">Confirm password*:</label>
                <input 
                    {...register('confirmPassword', {
                        required: 'Required',
                        validate: value => value === getValues('password') || 'Passwords do not match'
                    })}
                    type="password" id='confirmPassword' name='confirmPassword' 
                    className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                />
                {errors.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}
            </div>
            <button type="submit" className='btn btn-primary'>Register</button>
            <Link to='/auth/login' className="btn btn-secondary">
                Return to login
            </Link>
        </form>
    )
}