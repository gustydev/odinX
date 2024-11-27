const userQuery = {
    omit: { password: true },
    include: {
        _count: {
            select: {
                followers: true,
                following: true,
                posts: true,
                likes: true
            }
        },
        followers: { select: { id: true } },
        following: { select: { id: true } }
    }
}

const postInclude = {
    _count: {
        select: { replies: true, likes: true }
    },
    author: userQuery
}

module.exports = { userQuery, postInclude }