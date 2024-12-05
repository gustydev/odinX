import { useForm } from 'react-hook-form'
import { useNavigate } from "react-router-dom";

export default function SearchForm() {
    const { register, handleSubmit, formState: {errors} } = useForm();
    const navigate = useNavigate();

    function onSearch(data) {
        if (data.q.trim() && !errors.q) {
            navigate(`/search?q=${data.q}`)
        }
    }

    return (
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
    )
}