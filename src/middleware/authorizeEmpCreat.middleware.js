const ApiError = require('../utils/ApiError');
const ROLES = require('../constants/role.constant');
const Employee = require('../models/Employee');

const authorizeEmployeeCreation = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }
    if (user.roleName === ROLES.OWNER.roleName) {
      return next();
    }


    if (user.roleName !== ROLES.ADMIN.roleName) {
      throw new ApiError(403, "Only ADMIN can create employees");
    }


    const adminEmployee = await Employee.findOne({ userId: user.userId });

    if (!adminEmployee) {
      throw new ApiError(404, "Admin employee record not found");
    }


    req.adminDeptId = adminEmployee.departmentId;

    next();

  } catch (err) {
    next(err);
  }
};

module.exports = authorizeEmployeeCreation;