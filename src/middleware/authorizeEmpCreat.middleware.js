const ApiError = require('../utils/ApiError');
const ROLES = require('../constants/role.constant');
const Employee = require('../models/Employee');

const authorizeEmployeeCreation = async (req, res, next) => {
  try {
    const user = req.user;
    console.log("Authorize error ")

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }
    if (user.roleName === ROLES.OWNER.roleName) {
      return next();
    }

    // Only ADMIN allowed
    if (user.roleName !== ROLES.ADMIN.roleName) {
      throw new ApiError(403, "Only ADMIN can create employees");
    }

    // Get admin employee record
    const adminEmployee = await Employee.findOne({ userId: user.userId });

    if (!adminEmployee) {
      throw new ApiError(404, "Admin employee record not found");
    }

    // Attach admin department to request
    req.adminDeptId = adminEmployee.departmentId;

    next();

  } catch (err) {
    next(err);
  }
};

module.exports = authorizeEmployeeCreation;