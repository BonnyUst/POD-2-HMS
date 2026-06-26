const {
  verifyAccessToken,
} = require("../utils/jwt");

const authMiddleware = (
  req,
  res,
  next
) => {
  try {
    const authHeader =
      req.headers.authorization;

    const bearerToken =
      authHeader?.startsWith("Bearer ")
        ? authHeader
            .slice(7)
            .trim()
        : null;

    const cookieToken =
      req.cookies?.accessToken;

    /*
     * React Native sends the access token
     * through the Authorization header.
     *
     * Angular/web uses the HTTP-only cookie.
     */
    const token =
      bearerToken || cookieToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        code:
          "AUTHENTICATION_REQUIRED",
        message:
          "Authentication required",
      });
    }

    const decoded =
      verifyAccessToken(token);

    req.user = decoded;

    return next();
  } catch (error) {
    if (
      error.name ===
      "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        code:
          "ACCESS_TOKEN_EXPIRED",
        message:
          "Access token expired",
      });
    }

    return res.status(401).json({
      success: false,
      code: "INVALID_TOKEN",
      message:
        error.message ||
        "Invalid access token",
    });
  }
};

module.exports = authMiddleware;