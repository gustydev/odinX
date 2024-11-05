exports.convertParams = function(req, res, next) {
    // Converts params to numbers to avoid repetition in writing queries with id's
    try {
        const params = ['userId', 'postId'];

        params.forEach(param => {
            if (req.params[param]) {
                req.params[param] = Number(req.params[param]);
            }
        })

        next();
    } catch (err) {
        next(err);
    }
}