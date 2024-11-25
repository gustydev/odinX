import Post from "./Post"

export default function PostList( {posts} ) {
    const userPosts = posts?.filter(p => p.postType === 'userPost');
    // Excludes system posts (placeholders for deleted posts)

    return (
        <div className='posts d-flex flex-column gap-4'>
            {userPosts.length < 1 ? 'Nothing to see here...' : userPosts.map((post) => {
                return <Post key={post.id} post={post} />
            })}
        </div>
    )
}