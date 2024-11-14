import { useForm } from 'react-hook-form';

export default function LoginForm( {onSubmit} ) {
    const { register, handleSubmit, formState: { errors} } = useForm();
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="authForm">
            <div>
                <label htmlFor="username">Username*</label>
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
                <label htmlFor="password">Password*</label>
                <input
                    {...register("password", { 
                        required: 'Required', 
                        minLength: {value: 8, message: 'Minimum length: 8 characters'},
                        maxLength: {value: 100, message: 'Maximum length: 100 characters'} 
                    })}
                    type="password" id="password" name="password" 
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                />
                {errors.password && <span className="error">{errors.password.message}</span>}
            </div>
            <input type="submit" value="Log in" className="btn btn-primary" />
        </form>
    )
}