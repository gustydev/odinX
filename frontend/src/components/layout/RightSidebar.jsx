import { useData } from "../../hooks/useData/useData";
import Loading from "../loading/Loading";
import FetchError from "../errors/FetchError";
import UserList from "../user/UserList";
import { useForm } from 'react-hook-form'
import { useNavigate } from "react-router-dom";

export default function RightSidebar() {
    const { data: users, loading, error } = useData('user/list');
    const { register, handleSubmit, formState: {errors} } = useForm();
    const navigate = useNavigate();

    function onSubmit(data) {
        if (data.q.trim() && !errors.q) {
            navigate(`/search?q=${data.q}`)
        }
    }
    
    if (loading) return <Loading />
    if (error) return <FetchError error={error} />

    return (
        <div className='right-sidebar'>
            <form className='search-form' onSubmit={handleSubmit(onSubmit)}>
                <div className='d-flex gap-2'>
                    <input
                    {...register('q', {
                        required: 'Required',
                        minLength: 1,
                        maxLength: { value: 50, message: 'Max: 50 characters' },
                        validate: value => value.trim().length > 0 || 'Min: 1 character'
                    })}
                    className={`form-control ${errors.q ? 'is-invalid' : ''}`}
                    type="search" name='q' id='q' required minLength={1} maxLength={50} placeholder='Search' />
                    <input type="submit" value="🔍" className='btn btn-primary btn-sm' />
                </div>
                {errors.q && <span className='error'>{errors.q?.message}</span>}
            </form>
            <div>
                <h2>Users</h2>
                <ul>
                    <UserList users={users} />
                </ul>
            </div>
        </div>
    )
}