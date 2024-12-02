import { useData } from "../../hooks/useData/useData";
import Loading from "../loading/Loading";
import FetchError from "../errors/FetchError";
import UserList from "../user/UserList";
import { useForm } from 'react-hook-form'
import { useNavigate } from "react-router-dom";

export default function RightSidebar( {socket} ) {
    const { data: users, loading, error } = useData('user/list?limit=5');
    const { register, handleSubmit, formState: {errors} } = useForm();
    const navigate = useNavigate();

    function onSearch(data) {
        if (data.q.trim() && !errors.q) {
            navigate(`/search?q=${data.q}`)
        }
    }
    
    if (loading) return <Loading />
    if (error) return <FetchError error={error} />

    return (
        <div className='right-sidebar'>
            <form className='search-form' onSubmit={handleSubmit(onSearch)}>
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
            <div className='mt-4'>
                <h2 className='mb-2'>Users</h2>
                <UserList users={users} socket={socket} />
            </div>
        </div>
    )
}