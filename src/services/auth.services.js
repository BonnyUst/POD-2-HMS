const ApiError = require('../utils/ApiError')
const generateId = require('../utils/idGenerator');
const User = require('../models/User');
const Approval = require('../models/Approvals');
const Patient = require('../models/Patient')
const Roles = require('../models/Roles')
const ROLE_PERMISSIONS = require('../constants/rolePermissions')
const sendEmail = require('../utils/sendEmail');
const { verifyEmailTemplate, resendVerificationTemplate, resetPasswordTemplate } = require('../utils/templates/emailTemplates')
const bcrypt = require('bcrypt')
const jwt = require('../utils/jwt');
const crypto = require("crypto");
const ApiResponse = require('../utils/ApiResponse');
const {STATUS} = require('../constants/basic.constant')
const patientService = require('./patient.services');
const ROLES = require('../constants/role.constant');
const verifyUserByToken = async (token) => {
const crypto = require('crypto')
    if (!token) {
        throw new ApiError(400, "Verification token is required");
    }

    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    const user = await User.findOne({
        verificationToken: hashedToken,
        verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
        throw new ApiError(400, 'Invalid or Expired verification token');
    }

    if (user.isVerified) {
        return {
            alreadyVerified: true,
            user
        };
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    user.status = STATUS.ACTIVE;

    const savedUser = await user.save();
    const patient = await patientService.createPatientByUserId(user._id);

    return {
        alreadyVerified: false,
        user: savedUser,
        patient
    };
};

const forgotPassword = async(email)=>{
  const user = await User.findOne({email}).select('+passwordHash');

  if(!user) throw new ApiError(404,"User not Found");

  const token = crypto.randomBytes(32).toString('hex');

  const tempPassword = Math.random().toString(36).slice(-8);

  const hashedPassword = await bcrypt.hash(tempPassword,10);
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    user.resetToken = hashedToken;
  user.resetTokenExpiry = Date.now() + 1000 * 60 * 15;
  user.passwordHash = hashedPassword;

  await user.save();
  
  const resetLink = `http://10.11.68.124:3000/auth/reset-password/${token}`;
  console.log(resetLink)

  await sendEmail({
    to : user.email,
    subject : "Reset Password - HMS",
    html : resetPasswordTemplate(resetLink,user.firstName,tempPassword)
  })

  return { message : "Reset password email sent"};
}

const resetPassword = async ({ token, email, newPassword }) => {

    const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

    const user = await User.findOne({
        resetToken: hashedToken,
        resetTokenExpiry: { $gt: Date.now() }
    }).select('+passwordHash');

    if (!user) {
        throw new Error("Invalid or expired token");
    }


    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.passwordHash = hashedPassword;


    user.resetToken = null;
    user.resetTokenExpiry = null;
    if(user.status === STATUS.INACTIVE){
        user.status = STATUS.ACTIVE;
    }
    await user.save();

    return { message: "Password reset successful" };
};


const loginUser = async({email,password})=>{
    const user = await User.findOne({email}).select("+passwordHash");
    if(!user){
        throw new ApiError(401,"Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password,user.passwordHash);
    if(!isMatch){
        throw new ApiError(401,"Invalid credentials");
    }
    if(!user.isVerified){
        throw new ApiError(403,'Verify email before logging in');
    }
    user.lastLoginAt = new Date();
    
    const role = await Roles.findById(user.roleId);
    const permissions = role.roleName === ROLES.OWNER.roleName?["*"]:ROLE_PERMISSIONS[role.roleName];

    const token = jwt.generateToken({
        payload : {
            userId : user._id,
            roleName : role.roleName,
            permissions
        },
        type : jwt.tokenType.ACCESS,
    });
    await user.save();
    return {token : token,roleName: role.roleName, permissions : permissions};
}
















const registerApproval = async (data) => {

  const token = crypto.randomBytes(32).toString('hex');

  const approval = await Approval.create({
    ...data,
    verificationToken: token,
    isEmailVerified: false,
    status: "PENDING"
  });

  const verificationLink = `http://localhost:5000/api/register-approval/verify/${token}`;

  console.log("VERIFICATION LINK : ",verificationLink);

  await sendEmail({
    to: data.email,
    subject: "Verify your Email - HMS",
    html : verifyEmailTemplate(verificationLink,data.firstName),
  });

  return approval;
};

const verifyEmail = async (token) => {
  const approval = await Approval.findOne({ verificationToken: token });

  if (!approval) throw new Error("Invalid token");

  approval.isEmailVerified = true;
  approval.verificationToken =  null;
  await approval.save();

  return approval;
};


const resendVerificationEmail = async (email) => {

    console.log("RESEND FUNCTION CALLS CORRECTLY")
  const approval = await Approval.findOne({ email });

  if (!approval) throw new Error("Not found");

  if (approval.isEmailVerified) {
    return { message: "Already verified" };
  }

  const token = crypto.randomBytes(32).toString('hex');

  approval.verificationToken = token;
  await approval.save();

    const verificationLink = `http://localhost:5000/api/register-approval/verify/${token}`;
  console.log("RESEND VERIFICATION LINK : ",verificationLink);
  await sendEmail({
    to: email,
    subject: "Resend Verification - HMS",
    html : resendVerificationTemplate(verificationLink, approval.firstName)
  });

  return { message: "Verification email resent" };
};


module.exports = {verifyUserByToken, loginUser,registerApproval,verifyEmail,resendVerificationEmail,forgotPassword, resetPassword};