const ApiError = require('../utils/ApiError')
const generateId = require('../utils/idGenerator');
const User = require('../models/User');
const Approval = require('../models/Approvals');
const Patient = require('../models/Patient')
const Roles = require('../models/Roles')
const ROLE_PERMISSIONS = require('../constants/rolePermissions')
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcrypt')
const jwt = require('../utils/jwt');
const crypto = require("crypto");
const ApiResponse = require('../utils/ApiResponse');
const {STATUS} = require('../constants/basic.constant')
const patientService = require('./patient.services');
const ROLES = require('../constants/role.constant');
const verifyUserByToken = async (token) => {

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

// const registerApproval = async (data) => {

//   const token = crypto.randomBytes(32).toString('hex');

//   const approval = await Approval.create({
//     ...data,
//     verificationToken: token,
//     isEmailVerified: false,
//     status: "PENDING"
//   });

//   await sendEmail(data.email, token);
//   return approval;
// };

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
  // 🔥 SEND EMAIL
  await sendEmail({
    to: data.email,
    subject: "Verify your Email - HMS",
    html: getVerificationTemplate(verificationLink, data.firstName)
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
    html: getVerificationTemplate(verificationLink, approval.firstName)
  });

  return { message: "Verification email resent" };
};

const getVerificationTemplate = (link, name) => {
  return `
  <div style="font-family: Arial; padding: 20px; background:#f4f6f8;">
    <div style="max-width: 500px; margin:auto; background:#fff; padding:20px; border-radius:10px;">

      <h2 style="color:#007bff;">Welcome to HMS 🏥</h2>

      <p>Hi ${name || 'User'},</p>

      <p>Thank you for registering with HMS.</p>

      <p>Please verify your email by clicking the button below:</p>

      <a href="${link}" 
         style="display:inline-block; padding:12px 20px; background:#007bff; color:#fff; text-decoration:none; border-radius:6px;">
         Verify Email
      </a>

      <p style="margin-top:20px;">Or copy this link:</p>
      <p style="word-break: break-all;">${link}</p>

      <hr/>

      <p style="font-size:12px; color:#888;">
        If you didn’t request this, please ignore this email.
      </p>

    </div>
  </div>
  `;
};

module.exports = {verifyUserByToken, loginUser,registerApproval,verifyEmail,resendVerificationEmail};