const User = require('../models/User.model')
const RoleModel = require('../models/Role.model');
const Employee = require('../models/Employee.model')
const bcrypt = require('bcrypt');
const ApiError = require('../utils/ApiError');
const sendEmail = require('./mail.service')

exports.createEmployeeUser = async (userData) => {
    const {
        firstName,
        lastName,
        email,
        password,
        phone,
        role,
        department,
        designation,
        joiningDate,


    } = userData;

    const existingUser = await User.findOne({
        email
    });

    if (existingUser) {
        throw new ApiError(409, 'User already exists with this email');
    }

    const employeeRole = await RoleModel.findOne({ name: role });

    if (!employeeRole) {
        throw new ApiError(404, 'Employee role Not Found');
    }

    const passwordHash = await bcrypt.hash(password, 10);


    const user = await User.create({
        firstName,
        lastName,
        email,
        passwordHash,
        roleId: employeeRole._id,
        isVerified: true,
        status: 'ACTIVE',
        mustChangePassword: true
    });


    const employee = await Employee.create({
        userId: user._id,
        phone,
        department,
        designation,
        joiningDate,

    });
    let emailSent = false;
    try {
        await sendEmail(
            email,
            "HMS Employee Login Credentials",
            `
    <h2>Welcome to HMS</h2>

    <p>Hello ${firstName} ${lastName},</p>

    <p>Your employee account has been created successfully.</p>

    <p><strong>Login Email:</strong> ${email}</p>
    <p><strong>Temporary Password:</strong> ${password}</p>

    <p>Please login using the above credentials.</p>
    <p>For security reasons, you must change your password after first login.</p>

    <br/>
    <p>Regards,</p>
    <p>HMS Admin Team</p>
    `

        );
        emailSent = true;
    }
    catch (error) {
        console.log("Email sending failed, but account creation will continue");
        console.log(error.message);
    }
    return {
        employeeId: employee._id,
        employeeCode: employee.employeeCode,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: employee.phone,
        role: employeeRole.name,
        department: employee.department,
        designation: employee.designation,
        joiningDate: employee.joiningDate,
        isVerified: user.isVerified,
        status: user.status,
        mustChangePassword: user.mustChangePassword,
        emailSent

    };
}


exports.currentProfile = async (userId) => {
    const employeeProfile = await Employee.findOne({ userId })
        .populate({
            path: "userId",
            select: "-passwordHash",
            populate: {
                path: "roleId",
                select: "name roleCode"
            }
        });

    if (!employeeProfile) {
        throw new ApiError(404, "Employee profile not found");
    }

    return {

        userId: employeeProfile.userId._id,

        firstName: employeeProfile.userId.firstName,
        lastName: employeeProfile.userId.lastName,
        email: employeeProfile.userId.email,

        role: employeeProfile.userId.roleId.name,
        roleCode: employeeProfile.userId.roleId.roleCode,

        isVerified: employeeProfile.userId.isVerified,
        status: employeeProfile.userId.status,
        mustChangePassword: employeeProfile.userId.mustChangePassword,

        employeeId: employeeProfile._id,
        employeeCode: employeeProfile.employeeCode,
        phone: employeeProfile.phone,
        department: employeeProfile.department,
        designation: employeeProfile.designation,
        joiningDate: employeeProfile.joiningDate
    };
};

//to get all the employees

exports.getAllEmployees = async () => {
    const employees = await Employee.find()
        .populate({
            path: "userId",
            select: "firstName lastName email roleId isVerified status",
            populate: {
                path: "roleId",
                select: "name roleCode"
            }
        })
        .sort({ createdAt: -1 });

    return employees.map((employee) => ({
        employeeId: employee._id,
        employeeCode: employee.employeeCode,

        firstName: employee.userId.firstName,
        lastName: employee.userId.lastName,
        email: employee.userId.email,

        role: employee.userId.roleId.name,
        roleCode: employee.userId.roleId.roleCode,
        isVerified: employee.userId.isVerified,

        phone: employee.phone,
        department: employee.department,
        designation: employee.designation,
        joiningDate: employee.joiningDate,
        status: employee.status
    }));
};