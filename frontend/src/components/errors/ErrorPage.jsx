import { Link } from "react-router-dom"

export default function ErrorPage() {
    return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div>Oops! Page not found.</div>
        <div>Click <Link to='/'>here</Link> to return to the main page</div>
    </div>
    )
}