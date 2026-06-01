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
    // 🔥 STEP 1: Create employee using your existing logic
    const employee = await addEmployee(data);
    console.log('Check in before User check')

    // 🔥 STEP 2: Get created user
    const newUser = await User.findById(employee.userId);

    if (!newUser) {
        throw new ApiError(404, "User not found after creation");
    }
    console.log('Check in before token')

    // 🔥 STEP 3: Auto verify user (no email verification needed)
    newUser.isVerified = true;

    // 🔥 STEP 4: Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    newUser.resetToken = hashedToken;
    newUser.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    const savedUser = await newUser.save();

    // 🔥 STEP 5: Send email (password reset link)
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
    //add reset token and save the user
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
            // doctor fields
            medRegNo,
            specialization,
            qualification,
            consultationFee,
            avlblStartTime,
            avlblEndTime,
            expYears
        } = data;

        // ✅ Check user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ApiError(409, "User already exists");
        }
        console.log("Check point 1");
        // ✅ Create User
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
        // ✅ Get Role
        console.log("Check point 2");

        const employeeRole = await Roles.findOne({roleName: normalizedRole });
        
        console.log("ROLE FROM DB:", employeeRole);

        if (!employeeRole) {
            throw new ApiError(404, "Role not found");
        }

        newUser.roleId = employeeRole._id;
        await newUser.save();
        console.log("RAW roleName:", roleName);
        console.log("NORMALIZED roleName:", roleName?.toUpperCase()?.trim());


        // ✅ Generate Employee ID
        const genEmployeeId = await generateId(employeeRole.roleId);
        console.log("Check point 3");

        // ✅ Get Department
        let department;

        // 🔥 IF ADMIN CREATED EMPLOYEE → FORCE ADMIN DEPARTMENT
        if (data.adminDeptId) {

            department = await Departments.findById(data.adminDeptId);
            console.log("dept check point 1")
            if (!department) {
                throw new ApiError(404, "Invalid admin department");
            }

        } else {

            // fallback (manual creation / system use)
            department = await Departments.findOne({ deptName });
            console.log("dept check point 2",deptName)

            if (!department) {
                throw new ApiError(404, "Department not found");
            }
        }
        console.log("Check point 4");
        // ✅ Create Employee
        const newEmployee = await Employee.create({
            userId: newUser._id,
            employeeId: genEmployeeId,
            departmentId: department._id, // 🔥 FIXED
            designation,
            joiningDate
        });
        console.log("Check point 5");

        console.log("roleName:", roleName);
        console.log("DOCTOR ROLE:", ROLES.DOCTOR.roleName);

        // ✅ If role is DOCTOR → create Doctor
        if (roleName?.toUpperCase() === ROLES.DOCTOR.roleName) {
            if (
                !medRegNo ||
                !specialization ||
                !qualification ||
                consultationFee == null ||
                expYears == null
            ) {
                console.log("Error at role Name");
                throw new ApiError(400, "Doctor details are required");
            }
            console.log("Check point 6");

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
        // ⚠️ Rollback user if something fails
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
    fullName: `${emp.userId.firstName} ${emp.userId.lastName}`,
    email: emp.userId.email,
    phone: emp.userId.phone,
    roleName: emp.userId.roleId?.roleName || '',
    status: emp.userId.status,
    userId: emp.userId._id
  }));
}

const toggleEmployeeStatus = async(userId)=>{
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  user.status = user.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE;
  await user.save();

  return { message: "Status updated", status: user.status };
}
module.exports = { addEmployee,getEmployeeByDept,toggleEmployeeStatus,addEmployeeByAdmin };