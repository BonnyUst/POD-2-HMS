const ApiError = require('../utils/ApiError');
const ROLES = require('../constants/role.constant');
const Employee = require('../models/Employee');
const Departments = require('../models/Departments');

const authorizeAppointment = (action) => {
  return async (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        throw new ApiError(401, "Unauthorized");
      }

      const role = user.roleName;

      if (role === ROLES.OWNER.roleName) return next();
      if (role === ROLES.RECEPTIONIST.roleName) return next();

      if (role === ROLES.ADMIN.roleName) {

        if (action === 'CREATE') {


          const employee = await Employee.findOne({ userId: user.userId });

          if (!employee) {
            throw new ApiError(404, "Employee not found");
          }

          const userDeptId = employee.departmentId;


          const department = await Departments.findOne({ deptName: req.body.deptName });

          if (!department) {
            throw new ApiError(404, "Department not found");
          }

          const requestDeptId = department._id;

          if (userDeptId.toString() !== requestDeptId.toString()) {
            throw new ApiError(403, "You can only create appointment for your department");
          }

          return next();
        }

        if (action === 'READ' || action === 'UPDATE') {
          return next();
        }
      }

      throw new ApiError(403, "Access Denied");

    } catch (err) {
      next(err);
    }
  };
};

module.exports = authorizeAppointment;