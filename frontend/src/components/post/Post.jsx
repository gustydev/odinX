export default function Post( {post} ) {
    return (
        <div className='post'>
            <div className='authorInfo'>
                {/* <img src={data.author.profilePicUrl} alt={data.author.username + ' profile picture'} /> */}
                <p>{post.author.displayName} @{post.author.username}</p>
            </div>
            <div className='postContent'>
                {post.content}
            </div>
            <div className='postDate'>
                {new Date(post.postDate).toLocaleString()}
            </div>
            <div className='postStats btn-group'>
                <button className='btn btn-outline-dark rounded-0 border-0'>
                    ❤️ {post._count.likes} 
                </button> 
                <button className='btn btn-outline-dark rounded-0 border-0'>
                    🗫 {post._count.replies}
                </button>
            </div>
        </div>
    )
}