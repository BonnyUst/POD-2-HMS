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
      firstName,
      lastName,
      email,
      phone,
      password,
      deptName,
      designation,
      joiningDate
    } = adminDetails;

    // role
    adminDetails.roleName = ROLES.ADMIN.roleName;

    // create employee
    const newEmployee = await employeeService.addEmployee(adminDetails);

    // department check
    const departmentInfo = await Departments.findOne({ deptName });

    if (!departmentInfo) {
      throw new ApiError(404, "Department not found");
    }

    console.log("Dept exists");

    // FIXED ROLE QUERY
    const adminRole = await Roles.findOne({
      roleName: ROLES.ADMIN.roleName
    });

    if (!adminRole) {
      throw new ApiError(404, "ADMIN role not found in Roles collection");
    }

    // assign role
    const userId = newEmployee.userId;
    const newUser = await User.findById(userId);

    if (!newUser) {
      throw new ApiError(404, "User not found");
    }

    newUser.roleId = adminRole._id;
    await newUser.save();   // ✅ FIX

    // department mapping
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