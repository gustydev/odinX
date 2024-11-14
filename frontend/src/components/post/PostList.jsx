import Post from "./Post"

export default function PostList( {posts} ) {
    return (
        <div className='posts d-flex flex-column gap-4 mt-4'>
            {posts?.map((post) => {
                return <Post key={post.id} post={post} />
            })}
        </div>
    )
}