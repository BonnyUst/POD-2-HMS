const ApiError = require('../utils/ApiError');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const Patient = require('../models/patient.model')
const Employee = require('../models/employee.model');
const Role = require('../models/role.model');
const generateId = require('../utils/idGenerator');
const jwt = require('../utils/jwt');
const sendEmail = require('./mail.service');
const createUser = async (userData) => {
    const {
        firstName,
        lastName,
        email,
        password,
        phone,
        roleName,
        department,
        designation,
    } = userData;
    const role = await Role.findOne({ name: roleName });
    const roleId = role._id;
    const user = await createAuthUser({ firstName, lastName, email, password, phone, roleId })
    console.log('created user', user);
    const EMPID = await generateId(role.roleCode);
    const userId = user._id;
    const employee = await createEmployee({ userId, EMPID, department, designation })
    console.log('created emp');
    const token = generateVerificationToken(userId);
    await sendVerificationEmail(token,email);
    return {
        EMPID: employee.employeeCode,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        department: employee.department,
        designation: employee.designation,
        joiningDate: employee.joiningDate,
    };
}
const createAuthUser = async (userAuthData) => {
    const
        { firstName,
            lastName,
            email,
            password,
            phone,
            roleId
        } = userAuthData;
    const existingUser = await User.findOne({ email: userAuthData.email });
    if (existingUser) {
        throw new ApiError(409, 'User already exists with this email');
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        passwordHash,
        roleId
    });
    return user;
}
const createEmployee = async (employeeData) => {

    const {
        userId,
        EMPID,
        department,
        designation,
    } = employeeData;
    const employee = await Employee.create({
        userId,
        employeeCode: EMPID,
        department,
        designation,
        status: false,
        joiningDate: Date.now()
    });
    return employee;
}
const generateVerificationToken = (userId) => {
    return jwt.generateToken({
        payload: {
            userId,
        },
        type: jwt.tokenType.VERIFY_EMAIL,
    }
    );
}
const sendVerificationEmail = async (token,email) => {
    const verifyUrl = `http://localhost:3000/api/auth/verify?token=${token}`;
    console.log(`click this link to verify `, verifyUrl);
    sendEmail(email,'Verify email account',
        `<div style="
    margin-top: 32px;
    margin-bottom: 32px;
">
    
    <a
        href="${verifyUrl}"
        target="_blank"
        style="
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 48px;
            padding: 0 28px;
            background-color: #2563eb;
            color: #ffffff;
            text-decoration: none;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 600;
            font-family: Inter, Arial, sans-serif;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.18);
            transition: background-color 0.2s ease;
        "
    >
        Verify Email Address
    </a>

</div>

<p style="
    margin-top: 24px;
    color: #64748b;
    font-size: 14px;
    line-height: 1.7;
    font-family: Inter, Arial, sans-serif;
">
    If the button above does not work, copy and paste this link into your browser:
</p>

<p style="
    word-break: break-all;
    color: #2563eb;
    font-size: 14px;
    font-family: Inter, Arial, sans-serif;
">
    ${verifyUrl}
</p>`
    )
}
module.exports = {
    createUser,
    createAuthUser,
    createEmployee,
    generateVerificationToken,
    sendVerificationEmail,
}