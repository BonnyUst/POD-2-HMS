const Employee = require('../models/Employee')
const Appointment = require('../models/Appointments')
const Approval = require('../models/Approvals')

const getAdminDashboard = async(userId)=>{

  const employee = await Employee.findOne({ userId });

  if (!employee) throw new Error("Employee not found");

  const departmentId = employee.departmentId;


  const totalEmployees = await Employee.countDocuments({
    departmentId
  });


  const totalAppointments = await Appointment.countDocuments({
    departmentId
  });


  const totalApprovals = await Approval.countDocuments({
    deptName: departmentId
  });

  return {
    totalEmployees,
    totalAppointments,
    totalApprovals
  };
  
}

module.exports = { getAdminDashboard, }