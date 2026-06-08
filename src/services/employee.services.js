const ApiError = require('../utils/ApiError');
const generateId = require('../utils/idGenerator');
const User = require('../models/User');
const Roles = require('../models/Roles');
const Employee = require('../models/Employee');
const Doctor = require('../models/Doctor');
const userService = require('./user.services');
const Departments = require('../models/Departments');
const ROLES = require('../constants/role.constant');
const { STATUS } = require('../constants/basic.constant');

const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail'); // assuming you have this

const addEmployeeByAdmin = async (data) => {

    console.log('Check in before add Employee')

    const employee = await addEmployee(data);
    console.log('Check in before User check')


    const newUser = await User.findById(employee.userId);

    if (!newUser) {
        throw new ApiError(404, "User not found after creation");
    }
    console.log('Check in before token')


    newUser.isVerified = true;


    const resetToken = crypto.randomBytes(32).toString('hex');

    const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    newUser.resetToken = hashedToken;
    newUser.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    const savedUser = await newUser.save();


    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    console.log("check point for admin creation")
    await sendEmail({
        to: newUser.email,
        subject: "HMS Account Created - Set Your Password",
        html: `
            <h3>Welcome ${newUser.firstName}</h3>
            <p>Your account has been created by admin.</p>
            <p>Please set your password using the link below:</p>

            <a href="${resetUrl}">Reset Password</a>
            <p>Email : ${newUser.email}</p>
            <p>Password : ${data.password}</p>

            <p>This link expires in 1 hour.</p>
        `
    });

    return {
        user: savedUser,
        employee
    };
};

const addResetToken = async(userId)=>{

}
const addEmployee = async (data) => {
    console.log("Add Employee service layer running")
    let newUser;

    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            password,
            roleName,
            deptName,
            designation,
            joiningDate,
            adminDeptId,

            medRegNo,
            specialization,
            qualification,
            consultationFee,
            avlblStartTime,
            avlblEndTime,
            expYears
        } = data;


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ApiError(409, "User already exists");
        }
        

        console.log("Password",password)
        newUser = await userService.createBasicUser({
            firstName,
            lastName,
            email,
            phone,
            password
        });

        if (!roleName) {
            throw new ApiError(400, "roleName is required");
        }

        const normalizedRole = roleName?.toUpperCase()?.trim();

        

        const employeeRole = await Roles.findOne({roleName: normalizedRole });
        
        

        if (!employeeRole) {
            throw new ApiError(404, "Role not found");
        }

        newUser.roleId = employeeRole._id;
        await newUser.save();
        
        



        const genEmployeeId = await generateId(employeeRole.roleId);
        


        let department;


        if (data.adminDeptId) {

            department = await Departments.findById(data.adminDeptId);
            console.log("dept check point 1")
            if (!department) {
                throw new ApiError(404, "Invalid admin department");
            }

        } else {


            department = await Departments.findOne({ deptName });
            console.log("dept check point 2",deptName)

            if (!department) {
                throw new ApiError(404, "Department not found");
            }
        }
        

        const newEmployee = await Employee.create({
            userId: newUser._id,
            employeeId: genEmployeeId,
            departmentId: department._id, // 🔥 FIXED
            designation,
            joiningDate
        });
        

        
        


        if (roleName?.toUpperCase() === ROLES.DOCTOR.roleName) {
            if (
                !medRegNo ||
                !specialization ||
                !qualification ||
                consultationFee == null ||
                expYears == null
            ) {
                
                throw new ApiError(400, "Doctor details are required");
            }
            

            await Doctor.create({
                employeeId: newEmployee._id, // 🔥 correct reference
                medRegNo,
                specialization,
                qualification,
                consultationFee,
                avlblStartTime,
                avlblEndTime,
                expYears
            });
        }

        return newEmployee;

    } catch (error) {

        if (newUser) {
            await User.findByIdAndDelete(newUser._id);
        }
        throw error;
    }
};

const getEmployeeByDept = async(adminDeptId)=>{
    const employees = await Employee.find({ departmentId: adminDeptId })
    .populate({
      path: 'userId',
      select: 'firstName lastName email phone roleId status',
      populate: {
        path: 'roleId',
        select: 'roleName'
      }
    })
    .lean();

  return employees.map(emp => ({

    employeeId: emp.employeeId,
    email: emp.userId.email,
    phone: emp.userId.phone,
    roleName: emp.userId.roleId?.roleName || '',
    status: emp.userId.status,
    userId: emp.userId._id,


    firstName: emp.userId.firstName,
    lastName: emp.userId.lastName,


    designation: emp.designation,
    joiningDate: emp.joiningDate
  }));
}

const toggleEmployeeStatus = async(userId)=>{
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  user.status = user.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE;
  await user.save();

  return { message: "Status updated", status: user.status };
}

const updateEmployee = async (userId, data) => {
    console.log("Update service in employee")
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");


  user.firstName = data.firstName;
  user.lastName = data.lastName;
  user.phone = data.phone;

  await user.save();


  const employee = await Employee.findOne({ userId });

  if (!employee) throw new ApiError(404, "Employee not found");

  employee.designation = data.designation;
  employee.joiningDate = data.joiningDate;

  await employee.save();


  if (data.roleName === "DOCTOR") {
    const doctor = await Doctor.findOne({ employeeId: employee._id });

    if (doctor) {
      doctor.specialization = data.specialization || doctor.specialization;
      doctor.qualification = data.qualification || doctor.qualification;
      doctor.consultationFee = data.consultationFee || doctor.consultationFee;
      doctor.avlblStartTime = data.avlblStartTime || doctor.avlblStartTime;
      doctor.avlblEndTime = data.avlblEndTime || doctor.avlblEndTime;
      doctor.expYears = data.expYears || doctor.expYears;

      await doctor.save();
    }
  }

  return { message: "Employee updated" };
};

module.exports = { addEmployee,getEmployeeByDept,toggleEmployeeStatus,updateEmployee,addEmployeeByAdmin };