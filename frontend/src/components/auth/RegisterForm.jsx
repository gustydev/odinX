import { useForm } from 'react-hook-form';
import { apiRequest, API_URL } from '../../utils/api';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

export default function RegisterForm() {
    const { register, handleSubmit, getValues, formState: { errors} } = useForm();
    const nav = useNavigate();

    async function onSubmit(data) {
        try {
            await apiRequest(`${API_URL}/api/auth/register`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            toast.success(`User ${data.username} registered successfully! Proceed to log in`)
            nav('/auth/login')
        } catch (err) {
            err.details.forEach((e) => {
                toast.error(e.msg);
            })
        }
    } 

    return (
        <form action="" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="username">Username*:</label>
                <input
                    {...register("username", { 
                        required: 'Required', 
                        maxLength: {value: 30, message: 'Maximum length: 30 characters'}, 
                        minLength: {value: 4, message: 'Minimum length: 4 characters'},
                        pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Only alphanumeric characters (letters, numbers, underscores) allowed' }
                    })}
                    type="text" id="username" name="username" placeholder="Username" 
                    className={`form-control ${errors.username ? "is-invalid" : ""}`}
                />
                {errors.username && <span className="error">{errors.username.message}</span>}
            </div>
            <div>
                <label htmlFor="displayName">Display name (optional):</label>
                <input 
                    {...register('displayName', {
                        required: false,
                        minLength: { value: 2, message: 'Minimum length: 2 characters' },
                        maxLength: { value: 30, message: 'Maximum length: 30 characters' }
                    })}
                    type="text"  id='displayName' name='displayName' placeholder='Display name' 
                    className={`form-control ${errors.displayName ? "is-invalid" : ""}`}
                />
                {errors.displayName && <span className="error">{errors.displayName.message}</span>}
            </div>
            <div>
                <label htmlFor="password">Password*:</label>
                <input 
                    {...register("password", { 
                        required: 'Required', 
                        minLength: {value: 8, message: 'Minimum length: 8 characters'} 
                    })}
                    type="password" id="password" name="password" 
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                />
                {errors.password && <span className="error">{errors.password.message}</span>}
            </div>
            <div>
                <label htmlFor="confirmPassword">Confirm password:</label>
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
        </form>
    )
}