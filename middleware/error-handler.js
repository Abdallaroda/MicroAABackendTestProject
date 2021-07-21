module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    switch(true) {
        //404(not found) else: throw 400(bad request)
        case typeof err === 'string':
            const err404 = err.toLowerCase().endsWith('not found');
            const errCode = err404 ? 404 : 400;
            return res.status(errCode).json({ message: err });

        //401(unauthorized)
        case err.name === 'UnauthorizedError':
            return res.status(401).json({ message: 'Unauthorized'});

        //default: throw 500(internal server error)
        default:
            return res.status(500).json({ message: err.message })
    }
}
