const ApiError = require('../utils/ApiError');
const employeeService = require('../services/employee.services');
const Departments = require('../models/Departments');
const ROLES = require('../constants/role.constant');
const ApiResponse = require('../utils/ApiResponse');

const addAdmin = async (adminDetails) => {
  try {

    const {
      firstName,
      lastName,
      email,
      password,
      deptName,
      designation,
      joiningDate
    } = adminDetails;

    // 🔥 Ensure roleName is ADMIN
    adminDetails.roleName = ROLES.ADMIN.roleName;

    // ✅ Create Employee (reusing your logic)
    const newEmployee = await employeeService.addEmployee(adminDetails);

    // ✅ Get Department
    const departmentInfo = await Departments.findOne({ deptName });

    if (!departmentInfo) {
      throw new ApiError(404, "Department not found");
    }

    // 🔥 IMPORTANT FIX → store USER ID
    const userId = newEmployee.userId;

    // avoid duplicate push
    if (!departmentInfo.adminIds.includes(userId)) {
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