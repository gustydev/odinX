import { useForm } from 'react-hook-form';

export default function LoginForm() {
    const { register, handleSubmit, formState: { errors} } = useForm();

    const onSubmit = (data) => console.log(data); // instead of this, send a post request to the API of course
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="authForm">
            <div>
                <label htmlFor="username">Username*</label>
                <input
                    {...register("username", { 
                        required: 'This field is required', 
                        maxLength: {value: 30, message: 'Maximum length: 30 characters'}, 
                        minLength: {value: 4, message: 'Minimum length: 4 characters'} 
                    })}
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Username"
                    className={`form-control ${errors.username ? "is-invalid" : ""}`}
                />
                {errors.username && <span className="error">{errors.username.message}</span>}
            </div>
            <div>
                <label htmlFor="password">Password*</label>
                <input
                    {...register("password", { 
                        required: 'This field is required', 
                        minLength: {value: 8, message: 'Minimum length: 8 characters'} 
                    })}
                    type="password"
                    id="password"
                    name="password"
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                />
                {errors.password && <span className="error">{errors.password.message}</span>}
            </div>
            <input type="submit" value="Log in" className="btn btn-primary" />
        </form>
    )
}