const ApiError = require('../utils/ApiError');
const employeeService = require('../services/employee.services');
const Departments = require('../models/Departments');
const User = require('../models/User')
const Roles = require('../models/Roles')
const crypto = require('crypto');
const ROLES = require('../constants/role.constant');
const ApiResponse = require('../utils/ApiResponse');
const Employee = require('../models/Employee');
const { STATUS,APPROVAL_STATUS } = require('../constants/basic.constant');
const sendEmail = require('../utils/sendEmail')
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointments')
const Approval = require('../models/Approvals');
const { adminAccountTemplate } = require('../utils/templates/emailTemplates');









































const addAdmin = async (adminDetails) => {
  try {

    const { deptName } = adminDetails;
    adminDetails.roleName = ROLES.ADMIN.roleName;

    const newEmployee = await employeeService.addEmployee(adminDetails);
    
    const departmentInfo = await Departments.findOne({
  deptName: new RegExp(`^${deptName}$`, 'i')
});

    if (!departmentInfo) {
      throw new ApiError(404, "Department not found");
    }
    

    const userId = newEmployee.userId;


    const alreadyExists = departmentInfo.adminIds.some(
      id => id.toString() === userId.toString()
    );
    

    if (!alreadyExists) {
      departmentInfo.adminIds.push(userId);
      await departmentInfo.save();
    }




    

    const newUser = await User.findById(userId);

    if (!newUser) {
      throw new ApiError(404, "User not found after creation");
    }
    

    newUser.isVerified = true;


    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');


    newUser.resetToken = hashedToken;

    newUser.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await newUser.save();
    


    const resetUrl = `${process.env.FRONTEND_URL}/api/auth/reset-password/${resetToken}`;

    console.log("EMAIL DATA:", {
      email: newUser.email,
      password: adminDetails.password,
      resetUrl
    });
    

    await sendEmail({
      to: newUser.email,
      subject: "HMS Admin Account Created - Set Your Password",
      html: adminAccountTemplate({
        name: newUser.firstName,
        email: newUser.email,
        password: adminDetails.password, // ✅ THIS IS THE TEMP PASSWORD
        resetUrl
      })
    });
    



    return newEmployee;

  } catch (error) {
    throw error;
  }
};

const updateAdmin = async(userId, data)=>{
  const {
    firstName,
    lastName,
    email,
    phone,
    deptName,
    designation,
    joiningDate
  } = data;


  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.phone = phone;

  await user.save();


  const employee = await Employee.findOne({ userId });
  if (!employee) throw new ApiError(404, "Employee not found");

  employee.designation = designation;
  employee.joiningDate = joiningDate;


  if (deptName) {
    const dept = await Departments.findOne({
      deptName: deptName.toUpperCase().trim()
    });

    if (!dept) throw new ApiError(404, "Department not found");

    employee.departmentId = dept._id;
  }

  await employee.save();

  return { message: "Admin updated successfully" };
}

const getAllAdmins = async(req,res)=>{

  const adminRole = await Roles.findOne({ roleName: ROLES.ADMIN.roleName });

  if (!adminRole) {
    throw new ApiError(404, "Admin role not found");
  }

  const employees = await Employee.find()
    .populate({
      path: 'userId',
      match: { roleId: adminRole._id },
      select: 'firstName lastName email status phone'
    })
    .populate({
      path: 'departmentId',
      select: 'deptName'
    })
    .lean();

  return employees
    .filter(e => e.userId) // remove non-admins
    .map(e => ({
      employeeId: e.employeeId,
      firstName: e.userId.firstName,
      lastName : e.userId.lastName,
      email: e.userId.email,
      phone : e.userId.phone,
      designation: e.designation,
      joiningDate: e.joiningDate,
      department: e.departmentId?.deptName || '',
      status: e.userId.status,
      userId: e.userId._id
    }));
}

const deleteAdmin = async(userId)=>{
  const user = await User.findById(userId);
  if(!user) throw new ApiError(404,"User not found");

  await Employee.findOneAndDelete({userId});
  await User.findByIdAndDelete(userId);
  return { status : "SUCCESS"};
}

const toggleAdminStatus = async(userId)=>{
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  user.status = user.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE;
  await user.save();

  return { status: user.status };
}

const getDashboardStats = async()=>{
  const totalEmployees = await Employee.countDocuments();

  const activeEmployees = await User.countDocuments({status : STATUS.ACTIVE});
  const inactiveEmployees = await User.countDocuments({status : STATUS.INACTIVE});

  const doctors = await Doctor.find().populate({
    path : 'employeeId',
    populate : {
      path : 'userId',
      select : 'status isVerified'
    }
  });

  const totalDoctors = doctors.filter(d =>
    d.employeeId?.userId?.status === STATUS.ACTIVE &&
    d.employeeId?.userId?.isVerified === true
  ).length;

  const patientRole = await Roles.findOne({roleName:ROLES.PATIENT.roleName});

  let totalPatients = 0;
  if (patientRole) {
    totalPatients = await User.countDocuments({
      roleId: patientRole._id,
      status: STATUS.ACTIVE,
      isVerified: true
    });
  }


  const totalAppointments = await Appointment.countDocuments({
    isDeleted: false
  });


  const totalApprovals = await Approval.countDocuments({
    status: APPROVAL_STATUS.PENDING
  });


  const totalDepartments = await Departments.countDocuments();


  const totalRoles = await Roles.countDocuments();

  return {
    totalEmployees,
    activeEmployees,
    inactiveEmployees,

    totalDoctors,
    totalPatients,

    totalAppointments,
    totalApprovals,

    totalDepartments,
    totalRoles
  };
}
module.exports = { addAdmin , getAllAdmins, getDashboardStats,updateAdmin, deleteAdmin, toggleAdminStatus};