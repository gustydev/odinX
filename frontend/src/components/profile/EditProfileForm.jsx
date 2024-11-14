import { useForm } from "react-hook-form";

export default function EditProfileForm( {auth, setEditFormActive} ) {
    const { register, handleSubmit, formState: { errors} } = useForm();

    return (
        <form className='modal-form'>
            <button className='btn btn-dark btn-sm close-form-btn rounded-0' onClick={() => setEditFormActive(false)}>X</button>
            <h2>🖉 Edit Profile</h2>
            <div className="form-group">
                <label htmlFor="displayName">
                    <h3>Display name:</h3>
                </label>

                <input 
                {...register('displayName', {
                    required: false,
                    minLength: 2,
                    maxLength: { value: 30, message: 'Maximum: 30 characters'}
                })}
                type="text" name='displayName' id='displayName' placeholder='John Doe' minLength={2} maxLength={30} 
                className={`form-control ${errors.displayName ? "is-invalid" : ""}`}   
                />
                {errors.displayName && <span className="error">{errors.displayName.message}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="bio">
                    <h3>Bio:</h3>
                </label>
                    
                <textarea 
                {...register('bio', {
                    required: false,
                    minLength: 1,
                    maxLength: { value: 250, message: 'Maximum: 250 characters'}
                })}
                name="bio" id="bio" placeholder="Describe yourself..." minLength={1} maxLength={250}
                className={`form-control ${errors.bio ? "is-invalid" : ""}`}   
                />
                {errors.bio && <span className="error">{errors.bio.message}</span>}
            </div>
            <button type="submit" className='btn btn-dark'>Update</button>
        </form>
    )
}