const ApiError = require('../utils/ApiError');
const { verifyToken, tokenType } = require('../utils/jwt');

const jwtAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new ApiError(401, 'Token missing or invalid'));
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken({
            token,
            type: tokenType.ACCESS,
        });

        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (err) {
        next(new ApiError(401, 'Invalid or expired token'));
    }
};

module.exports = jwtAuth;