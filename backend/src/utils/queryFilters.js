exports.postInclude = {
    _count: {
        select: { replies: true, likes: true }
    },
    author: {
        select: { displayName: true, username: true, profilePicUrl: true }
    }
}

exports.userQuery = {
    omit: {password: true},
    include: {
        _count: {
            select: {
                followers: true,
                following: true
            }
        },
        followers: { select: { id: true } },
        following: { select: { id: true } }
    }
}