import { useState } from "react";
import useAuth from "../../hooks/useAuth/useAuth";
import { useData } from "../../hooks/useData/useData"
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { newPost } from "../../utils/apiRequests";

const buttonStyle = 'btn btn-outline-dark fw-bold rounded-0';

export default function LeftSidebar() {
    const [postFormActive, setPostFormActive] = useState(false);
    const { data: users } = useData('user/list');
    const navigate = useNavigate();
    const auth = useAuth();
    const { register, handleSubmit, formState: { errors} } = useForm();

    async function handleNewPost(data) {
        await newPost(data, auth.token)
    }

    return (
        <div className="left-sidebar">
            <div className="btn-group d-flex">
                <button onClick={() => navigate('/')} className={buttonStyle}>
                    🏠 Homepage
                </button>
                <button onClick={() => navigate(`/user/${auth.user.id}`)} className={buttonStyle}>
                    👤 Profile
                </button>
            </div>
            <button className={buttonStyle} onClick={() => setPostFormActive(true)}>
                🖉 New Post
            </button>
            <div>
                <h2>Users</h2>
                <ul>
                    {users?.map((user) => {
                        return <li key={user.id}>{user.displayName} @{user.username}</li>
                    })}
                </ul>
            </div>
            <div className={"modal " + (postFormActive ? 'd-block' : 'd-none')}>
            {postFormActive && (
                <form className='post-form' onSubmit={handleSubmit(handleNewPost)}>
                    <button className='btn btn-dark btn-sm close-form-btn rounded-0' onClick={() => setPostFormActive(false)}>X</button>
                    <div className='form-group'>
                        <label htmlFor="content" className='mb-3'>
                            <h2>Write a post:</h2>
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

                        {errors.content && <span className="error">{errors.content.message}</span>}
                    </div>
                    <button type="submit" className='btn btn-dark'>Post</button>
                </form>
            )}
            </div>
        </div>
    )
}