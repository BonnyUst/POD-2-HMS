const Approval = require('../models/Approvals');
const userService = require('../services/user.services');
const employeeService = require('../services/employee.services');
const Departments = require("../models/Departments")
const { APPROVAL_STATUS } = require('../constants/basic.constant');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const approveEmployee = async (approvalId) => {

  console.log("serive of approval")
  const approval = await Approval.findById(approvalId);

  if (!approval || !approval.isEmailVerified) {
    throw new Error("Invalid approval");
  }

const department = await Departments.findById(approval.deptName);
console.log("Service point 1")
if (!department) {
  throw new Error("Department not found");
}


const employee = await employeeService.addEmployee({
  ...approval._doc,
  deptName: department.deptName, // ✅ FIX HERE
  roleName: approval.roleName
});



  await User.findOneAndUpdate(
    { email: approval.email },   // since you don’t have userId in Approval
    { status: STATUS.ACTIVE },
    { new: true }
  );

  approval.status = APPROVAL_STATUS.APPROVED;
  await approval.save();
  return employee;
};

const rejectEmployee = async (approvalId, reason) => {

  const approval = await Approval.findById(approvalId);

  if (!approval) {
    throw new Error("Approval not found");
  }

  approval.status = APPROVAL_STATUS.REJECTED;
  approval.message = reason;

  await approval.save();



  return { message: "Rejected successfully" };
};

const getApprovals = async (status) => {

  const filter = status ? { status } : {};

  const approvals = await Approval.find(filter)
    .sort({ createdAt: -1 });

  return approvals;
};


module.exports = {approveEmployee,rejectEmployee,getApprovals};
