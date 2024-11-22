import { useForm } from "react-hook-form";
import { newPost, editPost } from "../../utils/apiRequests";

export default function PostForm( {auth, setFormActive, editing, post} ) {
    const { register, handleSubmit, formState: { errors} } = useForm({
        defaultValues: {
            content: post?.content
        }
    });

    async function handlePost(data) {
        if (editing) {
            await editPost(post.id, data, auth.token)
        } else {
            await newPost(data, auth.token)
        }
    }

    return (
        <form className='modal-form' onSubmit={handleSubmit(handlePost)}>
            <button className='btn btn-dark btn-sm close-form-btn rounded-0' onClick={() => setFormActive(false)}>X</button>
            <div className='form-group'>
                <label htmlFor="content" className='mb-3'>
                    <h2>🖉 {editing ? 'Edit' : 'New'} Post</h2>
                </label>

                <textarea 
                    {...register('content', {
                        required: true,
                        minLength: 1,
                        maxLength: {value: 500, message: 'Post cannot surpass 500 characters'}
                    })} 
                    type="text" id="content" name="content" placeholder="Speak what's on your mind..." minLength={1} maxLength={500} rows={5}
                    className={`form-control ${errors.content ? "is-invalid" : ""}`}    
                />
            </div>
            <button type="submit" className='btn btn-dark'>Post</button>
        </form>
    )
}