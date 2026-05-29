const ApiError = require('../utils/ApiError');
const employeeService = require('../services/employee.services');
const Departments = require('../models/Departments');
const User = require('../models/User')
const Roles = require('../models/Roles')
const ROLES = require('../constants/role.constant');
const ApiResponse = require('../utils/ApiResponse');

const addAdmin = async (adminDetails) => {
  try {

    const {
      deptName
    } = adminDetails;

    // force ADMIN role
    adminDetails.roleName = ROLES.ADMIN.roleName;

    // create employee (this already creates user + role)
    const newEmployee = await employeeService.addEmployee(adminDetails);

    // ✅ normalize dept
    const departmentInfo = await Departments.findOne({
      deptName: deptName.toUpperCase().trim()
    });

    if (!departmentInfo) {
      throw new ApiError(404, "Department not found");
    }

    const userId = newEmployee.userId;

    // ✅ FIX: ObjectId comparison
    const alreadyExists = departmentInfo.adminIds.some(
      id => id.toString() === userId.toString()
    );

    if (!alreadyExists) {
      departmentInfo.adminIds.push(userId);
      await departmentInfo.save();
    }

    return newEmployee;

  } catch (error) {
    throw error;
  }
};

const getAllAdmins = async(req,res)=>{

}
module.exports = { addAdmin , getAllAdmins};