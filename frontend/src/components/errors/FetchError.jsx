import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"

export default function FetchError( {error} ) {
    const location = useLocation()
    
    return (
        <div className='fetchError'>
            <h2>Error</h2>
            <div>
                {error?.message ? error.message : 'Failed to fetch data. Please try again later.'}
            </div>
            {error?.statusCode && (
                <div>Status: {error.statusCode}</div>
            )}
            {location.pathname !== '/' && <Link to='/'><button className="btn btn-secondary">Return to homepage</button></Link>}
        </div>
    )
}