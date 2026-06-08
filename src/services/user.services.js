const ApiError = require('../utils/ApiError')
const generateId = require('../utils/idGenerator');
const User = require('../models/User');
const Patient = require('../models/Patient')
const Roles = require('../models/Roles')
const Employee = require('../models/Employee')
const bcrypt = require('bcrypt')
const jwt = require('../utils/jwt');
const crypto = require("crypto");
const { STATUS } = require('../constants/basic.constant');
const ROLES = require('../constants/role.constant');
const sendEmail = require('../utils/sendEmail')

const createAuthUser = async (data) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        password
    } = data;


    const user = await createBasicUser({ firstName, lastName, email,phone, password });

    try {

        const role = await Roles.findOne({ roleId: ROLES.PATIENT.roleId });
        if (!role) {
            throw new ApiError(404, 'Role not found');
        }


        const verificationToken = crypto.randomBytes(32).toString('hex');

        const hashedToken = crypto
            .createHash('sha256')
            .update(verificationToken)
            .digest('hex');

        const verificationTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);


        user.phone = phone;
        user.roleId = role._id;
        user.verificationToken = hashedToken;
        user.verificationTokenExpiry = verificationTokenExpiry;

        await user.save();


        const verifyUrl = `${process.env.FRONTEND_URL}/api/auth/verify-email?token=${verificationToken}`;
        

        await sendEmail({
            to: email,
            subject: "HMS - Verify your email",
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 20px;">
                    
                    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 25px; border-radius: 8px;">
                        
                        <h2 style="color: #2c3e50;">
                            Dear ${firstName} ${lastName},
                        </h2>
                        
                        <h2 style="color: #2c3e50;">
                            Welcome to HMS
                        </h2>

                        <p style="color: #555;">
                            Your account has been successfully created, but your email address is not yet verified.
                        </p>

                        <p style="color: #555;">
                            Please click the button below to verify your account:
                        </p>

                        <div style="text-align: center; margin: 25px 0;">
                            <a href="${verifyUrl}" 
                            style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
                            Verify Email
                            </a>
                        </div>

                        <p style="color: #777; font-size: 14px;">
                            If the button doesn't work, copy and paste this link into your browser:
                        </p>

                        <p style="color: #4CAF50; word-break: break-all;">
                            ${verifyUrl}
                        </p>

                        <p style="color: #999; font-size: 12px;">
                            If you did not create this account, please contact support at <b>hmsadmin@gmail.com</b>.
                        </p>

                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

                        <p style="text-align: center; font-size: 12px; color: #aaa;">
                            © ${new Date().getFullYear()} HMS. All rights reserved.
                        </p>

                    </div>

                </div>
            `,
        });


        return user;

    } catch (err) {

        await User.findByIdAndDelete(user._id);
        throw err;
    }
};

const createBasicUser = async(userDetails)=>{
    const {
        firstName,
        lastName,
        email,
        phone,
        password,
    } = userDetails;
    const existingUser = await User.findOne({email});
    if(existingUser){
        throw new ApiError(409,"User already exists with this email");
    }
    const passwordHash = await bcrypt.hash(password,12);
    const newUser = new User({
        firstName,
        lastName,
        email,
        phone,
        passwordHash,
        status : STATUS.INACTIVE
    });
    return await newUser.save();
}
const getMyInfo = async(userId,role)=>{

    const user = await User.findById(userId);
    if(!user){
        throw new ApiError(404,"User not found");
    }
    const profile = await Patient.findOne({userId});
    if(!profile){
        throw new ApiError(404,'Profile not found');
    }
    return {user,profile};
}

const getMyProfile = async (userId) => {

  

  if (!userId) throw new Error("UserId missing");

  const user = await User.findById(userId)
    .populate('roleId', 'roleName')
    .lean();

  if (!user) throw new Error("User not found");

  

  const employee = await Employee.findOne({ userId: user._id })
    .populate('departmentId', 'deptName') // ✅ FIXED
    .lean();

  

  let doctor = null;

  if (
    user.roleId?.roleName === 'DOCTOR' &&
    employee &&
    employee.employeeId
  ) {
    doctor = await Doctor.findOne({
      employeeId: employee.employeeId
    }).lean();
  }

  

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,

    roleName: user.roleId?.roleName || "UNKNOWN",

    designation: employee?.designation || "",
    department: employee?.departmentId?.deptName || "",

    joiningDate: employee?.joiningDate || null,

    medRegNo: doctor?.medRegNo || "",
    specialization: doctor?.specialization || "",
    qualification: doctor?.qualification || "",
    consultationFee: doctor?.consultationFee || 0,
    expYears: doctor?.expYears || 0,
  };
};
module.exports = { createAuthUser,createBasicUser, getMyInfo, getMyProfile };