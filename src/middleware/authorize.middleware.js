const ROLE_PERMISSIONS = require('../constants/rolePermissions');
const ROLES = require('../constants/role.constant');
const ApiError = require('../utils/ApiError');

const authorize = (requiredPermission) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user || !user.roleName) {
        throw new ApiError(401,"Unauthorized");
      }

      const roleCode = user.roleName; // "OWN", "DOC", etc.

      console.log("USER ROLE:", user.roleName);
      console.log("REQUIRED:", requiredPermission);
      console.log("HAS:", ROLE_PERMISSIONS[user.roleName]);

      // 🔥 ✅ OWNER BYPASS
      if (roleCode === ROLES.OWNER.roleName) {
        return next();
      }

      const permissions = ROLE_PERMISSIONS[roleCode];

      if (!permissions || !permissions.includes(requiredPermission)) {
        return res.status(403).json({
          message: "Forbidden: No permission"
        });
      }

      next();

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
};

module.exports = authorize;