import { useForm } from "react-hook-form";
import { newPost, editPost } from "../../utils/apiRequests";

export default function PostForm( {auth, setFormActive, editing, post} ) {
    const { register, handleSubmit, watch, formState: { errors} } = useForm({
        defaultValues: {
            content: post?.content
        }
    });

    async function handlePost(data) {
        const formData = {...data, attachment: data.attachment[0]}

        if (editing) {
            await editPost(post.id, formData, auth.token)
        } else {
            await newPost(formData, auth.token)
        }
    }

    const hasAttachment = watch('attachment')?.length > 0;

    return (
        <form className='modal-form' onSubmit={handleSubmit(handlePost)} encType="multipart/form-data">
            <button className='btn btn-dark btn-sm close-form-btn rounded-0' onClick={() => setFormActive(false)}>X</button>
            <div className='form-group'>
                <label htmlFor="content" className='mb-3'>
                    <h2>🖉 {editing ? 'Edit' : 'New'} Post</h2>
                </label>

                <textarea 
                    {...register('content', {
                        required: hasAttachment ? false : 'Post must have text content or an attachment',
                        minLength: 1,
                        maxLength: {value: 500, message: 'Post cannot surpass 500 characters'}
                    })} 
                    type="text" id="content" name="content" placeholder="Speak what's on your mind..." minLength={1} maxLength={500} rows={5}
                    className={`form-control ${errors.content ? "is-invalid" : ""}`}    
                />
                {errors.content && <span className="error">{errors.content.message}</span>}
            </div>
            <div className='form-group'>
                <label htmlFor="attachment">
                    <h3>Attach image/video (up to 3MB):</h3>
                </label>

                <input 
                {...register('attachment', {
                    required: false
                })}
                type="file" name="attachment" id="attachment" 
                className={`form-control ${errors.content ? "is-invalid" : ""}`}    
                />
            </div>
            <button type="submit" className='btn btn-dark'>Post</button>
        </form>
    )
}