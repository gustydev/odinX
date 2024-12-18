import { useForm } from "react-hook-form";
import { editProfile } from "../../utils/apiRequests";

export default function EditProfileForm( {auth, setEditFormActive, user} ) {
    const { register, handleSubmit, formState: { errors} } = useForm({
        defaultValues: {
            displayName: user.displayName,
            bio: user.bio
        }
    });

    async function submitEdit(data) {
        await editProfile(auth.user.id, data.pic ? {...data, pic: data.pic[0]} : data, auth.token)
    }

    return (
        <form className='modal-form' onSubmit={handleSubmit(submitEdit)} encType="multipart/form-data">
            <button className='btn btn-dark btn-sm close-form-btn rounded-0' onClick={() => setEditFormActive(false)}>X</button>
            <h2>🖉 Edit Profile</h2>
            <div className="form-group">
                <label htmlFor="displayName">
                    <h3>Display name:</h3>
                </label>

                <input 
                {...register('displayName', {
                    required: false,
                    minLength: { value: 1, message: 'Minimum: 1 character' },
                    maxLength: { value: 30, message: 'Maximum: 30 characters'}
                })}
                type="text" name='displayName' id='displayName' placeholder='John Doe' maxLength={30}
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
            <div className='form-group'>
                <label htmlFor="pic">
                    <h3>Profile picture (up to 3MB):</h3>
                </label>

                <input 
                {...register('pic', {
                    required: false
                })}
                className='form-control' type="file" name="pic" id="pic"
                />
            </div>
            {user.profilePicUrl && 
            <div className='form-group d-flex gap-1'>
                <label htmlFor="deletePic">
                    <h3>Remove profile picture?</h3>
                </label>

                <input 
                {...register('deletePic', {
                    required: false
                })}
                type="checkbox" name='deletePic' id='deletePic' 
                />
            </div>
            }
            <button type="submit" className='btn btn-dark'>Update</button>
        </form>
    )
}