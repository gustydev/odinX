import { useForm } from "react-hook-form";
import { deleteUser } from "../../utils/apiRequests";

export default function DeleteForm( {auth, setDeleteFormActive, user} ) {
    const { register, handleSubmit, formState: { errors} } = useForm();

    async function submitDelete(data) {
        await deleteUser(user.id, auth.token, auth.logOut)
    }

    return (
        <form className='modal-form' onSubmit={handleSubmit(submitDelete)}>
            <button className='btn btn-dark btn-sm close-form-btn rounded-0' onClick={() => setDeleteFormActive(false)}>X</button>
            <h2>🗑 Delete account</h2>
            <div>
                <p className="mb-2">
                    Are you sure you want to delete your account?
                    You will lose:
                </p>
                <ul className="list-group list-group-flush mb-3">
                    <li className="list-group-item list-group-item-danger">{user._count.posts} posts</li>
                    <li className="list-group-item list-group-item-danger">{user._count.followers} followers</li>
                    <li className="list-group-item list-group-item-danger">{user._count.likes} likes</li>
                </ul>
                <strong>This can&apos;t be undone!</strong>
                </div>
            <div className='form-group'>
                <label htmlFor="confirm-delete" className='mb-2'>
                    Type &quot;DELETE&quot; below to confirm:
                </label>
                <input 
                {...register('delete', {
                    required: true,
                    validate: value => value === 'DELETE'
                })}
                id='delete' type="text" className={`form-control ${errors.delete ? "is-invalid" : ""}`} />
                {errors.delete && <span className="error">{errors.delete.message}</span>}
            </div>
            <button type="submit" className='btn btn-danger'>Delete</button>
        </form>
    )
}