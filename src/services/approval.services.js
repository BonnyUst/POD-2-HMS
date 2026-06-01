const Approval = require('../models/Approvals');
const userService = require('../services/user.services');
const employeeService = require('../services/employee.services');
const Departments = require("../models/Departments")
const { APPROVAL_STATUS } = require('../constants/basic.constant');

const approveEmployee = async (approvalId) => {

  console.log("serive of approval")
  const approval = await Approval.findById(approvalId);

  if (!approval || !approval.isEmailVerified) {
    throw new Error("Invalid approval");
  }

  // ✅ Create User
  // const user = await userService.createBasicUser({
  //   firstName: approval.firstName,
  //   lastName: approval.lastName,
  //   email: approval.email,
  //   phone: approval.phone,
  //   password: approval.password
  // });

  // ✅ Create Employee
  // 🔥 Step 1: Get actual department
const department = await Departments.findById(approval.deptName);
console.log("Service point 1")
if (!department) {
  throw new Error("Department not found");
}

// 🔥 Step 2: Replace deptName with actual string
const employee = await employeeService.addEmployee({
  ...approval._doc,
  deptName: department.deptName, // ✅ FIX HERE
  roleName: approval.roleName
});
console.log("Service point 2")

  // ✅ Update approval
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
