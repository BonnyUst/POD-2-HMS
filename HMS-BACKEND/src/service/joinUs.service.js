const crypto = require('node:crypto');
const JoinUs = require('../models/joinUs.model');
const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcrypt')
const Role = require('../models/Role.model')
const Employee = require('../models/Employee.model')
const Doctor = require('../models/Doctor.model')
const sendMail = require('./mail.service');
const ms = require("ms");

const {
  getPagination,
  buildPaginationResponse
} = require('../utils/pagination');
const sendEmail = require('./mail.service');

const expiryText = process.env.JWT_EMAIL_VERIFICATION_EXPIRY;

const getVerificationExpiry = () =>
    new Date(Date.now() + ms(process.env.JWT_EMAIL_VERIFICATION_EXPIRY));

const sendJoinUsVerificationMail = async ({
    email,
    firstName,
    verificationLink
}) => {

    const html = `
    <div style="font-family: Arial, sans-serif; padding:20px;">

        <h2 style="color:#2563eb;">
            Verify Your Email
        </h2>

        <p>Hello <strong>${firstName}</strong>,</p>

        <p>
            Thank you for submitting your Join Us request.
        </p>

        <p>
            Please click the button below to verify your email.
        </p>

        <p style="margin:30px 0;">
            <a
                href="${verificationLink}"
                style="
                    background:#2563eb;
                    color:white;
                    padding:12px 22px;
                    text-decoration:none;
                    border-radius:6px;
                    display:inline-block;
                ">
                Verify Email
            </a>
        </p>
        <p>or click the link below to verify your account</p>
        <br>
        <p>
        <a href="${verificationLink}">
            ${verificationLink}
        </a>
        </p>

        <p>
            This verification link is valid for
            <strong>${expiryText}</strong>.
        </p>

        <p>
            If you did not request this, please ignore this email.
        </p>

        <br>

        <p>
            Regards,<br>
            <strong>Hospital Management System</strong>
        </p>

    </div>
    `;

    await sendEmail(
        email,
        'Verify Your Join Us Request',
        html
    );

};

exports.createJoinUsRequest = async (joinUsData) => {
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

        specialization,
        qualification,
        consultationFee,
        medicalRegistrationNo,
        availabilityStartTime,
        availabilityEndTime,
        experienceYears
    } = joinUsData;

    console.log("Check point 1");
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, 'Email already registered as user');
    }

    console.log("Check point 2");
    const existingRequest = await JoinUs.findOne({ email });


    if (existingRequest) {
        if (!existingRequest.isVerified) {
            const newToken = crypto.randomBytes(32).toString('hex');

            existingRequest.verificationToken = newToken;
            existingRequest.verificationTokenExpiry = getVerificationExpiry();

            await existingRequest.save();

            const verificationLink =
                `${process.env.FRONTEND_URL}/api/join-us/verify/${newToken}`;

            console.log('Verification Link Resent:', verificationLink);

            return {
                message: 'Verification email resent. Please verify your email.',
                data: existingRequest
            };
        }

        throw new ApiError(409, 'Join request already exists with this email');
    }
    console.log("Check point 3");
    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');//decide later on the jwt

    const joinUsRequest = await JoinUs.create({
        firstName,
        lastName,
        email,
        passwordHash,
        phone,
        role,
        department,
        designation,
        joiningDate,

        specialization: role === 'Doctor' ? specialization : undefined,
        qualification: role === 'Doctor' ? qualification : undefined,
        consultationFee: role === 'Doctor' ? consultationFee : undefined,
        medicalRegistrationNo: role === 'Doctor' ? medicalRegistrationNo : undefined,
        availabilityStartTime: role === 'Doctor' ? availabilityStartTime : undefined,
        availabilityEndTime: role === 'Doctor' ? availabilityEndTime : undefined,
        experienceYears: role === 'Doctor' ? experienceYears : undefined,

        isVerified: false,
        approvalStatus: 'PENDING',
        verificationToken,
        verificationTokenExpiry: getVerificationExpiry()
    });
    console.log("Check point 4");
    const verificationLink =
        `${process.env.FRONTEND_URL}/api/join-us/verify/${verificationToken}`;

    await sendJoinUsVerificationMail({
        email,
        firstName,
        verificationLink
    });
    console.log('Verification Link:', verificationLink);

    return {
        message: 'Join request submitted. Please verify your email.',
        data: joinUsRequest
    };
};

exports.verifyJoinUsEmail = async (token) => {
    const joinUsRequest = await JoinUs.findOne({
        verificationToken: token,
        verificationTokenExpiry: { $gt: new Date() }
    });

    if (!joinUsRequest) {
        throw new ApiError(400, 'Invalid or expired verification token');
    }

    joinUsRequest.isVerified = true;
    joinUsRequest.verificationToken = undefined;
    joinUsRequest.verificationTokenExpiry = undefined;

    await joinUsRequest.save();

    return joinUsRequest;
};

exports.getAllJoinUsRequests = async (query = {}) => {
  const { page, limit, skip, sortBy, sortOrder } = getPagination(query);
  const search = query.search ? query.search.trim() : '';

  const allowedSortFields = [
    'createdAt',
    'firstName',
    'lastName',
    'email',
    'status'
  ];

  const finalSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : 'createdAt';

  const filter = {};

  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { role: { $regex: search, $options: 'i' } },
      { department: { $regex: search, $options: 'i' } },
      { designation: { $regex: search, $options: 'i' } },
      { status: { $regex: search, $options: 'i' } }
    ];
  }

  const totalRecords = await JoinUs.countDocuments(filter);

  const requests = await JoinUs.find(filter)
    .sort({ [finalSortBy]: sortOrder })
    .skip(skip)
    .limit(limit);

  return {
    requests,
    pagination: {
      ...buildPaginationResponse({
        page,
        limit,
        totalRecords
      }),
      sortBy: finalSortBy,
      sortOrder: sortOrder === 1 ? 'asc' : 'desc'
    }
  };
};

exports.getPendingJoinUsRequests = async (query = {}) => {
  const { page, limit, skip, sortBy, sortOrder } = getPagination(query);
  const search = query.search ? query.search.trim() : '';

  const allowedSortFields = [
    'createdAt',
    'firstName',
    'lastName',
    'email',
    'approvalStatus'
  ];

  const finalSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : 'createdAt';

  const filter = {
    isVerified: true,
    approvalStatus: 'PENDING'
  };

  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { role: { $regex: search, $options: 'i' } },
      { department: { $regex: search, $options: 'i' } },
      { designation: { $regex: search, $options: 'i' } }
    ];
  }

  const totalRecords = await JoinUs.countDocuments(filter);

  const requests = await JoinUs.find(filter)
    .sort({ [finalSortBy]: sortOrder })
    .skip(skip)
    .limit(limit);

  return {
    requests,
    pagination: {
      ...buildPaginationResponse({
        page,
        limit,
        totalRecords
      }),
      sortBy: finalSortBy,
      sortOrder: sortOrder === 1 ? 'asc' : 'desc'
    }
  };
};

exports.checkJoinUsEmail = async (email) => {

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, 'Email already registered as user');
    }

    const existingRequest = await JoinUs.findOne({ email });

    if (existingRequest) {

        if (!existingRequest.isVerified) {

            const newToken = crypto.randomBytes(32).toString('hex');

            existingRequest.verificationToken = newToken;
            existingRequest.verificationTokenExpiry = getVerificationExpiry();

            await existingRequest.save();

            const verificationLink =
                `${process.env.FRONTEND_URL}/api/join-us/verify/${newToken}`;

            console.log('Verification Link Resent:', verificationLink);

            await sendJoinUsVerificationMail({
                email:existingRequest.email,
                firstName: existingRequest.firstName,
                verificationLink
            });
            return {
                canContinue: false,
                resend: true,
                message: 'Verification link has been resent. Please verify your email.'
            };
        }

        return {
            canContinue: false,
            resend: false,
            message: 'Join request already exists with this email.'
        };
    }

    return {
        canContinue: true,
        message: 'Email available. Continue filling the form.'
    };
};

exports.approveJoinUsRequest = async (requestId, approvedBy) => {
    const joinUsRequest = await JoinUs.findById(requestId).select('+passwordHash');

    if (!joinUsRequest) {
        throw new ApiError(404, 'Join request not found');
    }

    if (!joinUsRequest.isVerified) {
        throw new ApiError(400, 'Email is not verified yet');
    }

    if (joinUsRequest.approvalStatus !== 'PENDING') {
        throw new ApiError(400, 'Join request is already processed');
    }

    if (!joinUsRequest.passwordHash) {
        throw new ApiError(400, 'Password hash missing in join request. Please create a new join request.');
    }

    const existingUser = await User.findOne({ email: User.email });

    if (existingUser) {
        throw new ApiError(409, 'User already exists with this email');
    }

    const role = await Role.findOne({ name: joinUsRequest.role });

    if (!role) {
        throw new ApiError(404, 'Role not found');
    }

    const newUser = await User.create({
        firstName: joinUsRequest.firstName,
        lastName: joinUsRequest.lastName,
        email: joinUsRequest.email,
        passwordHash: joinUsRequest.passwordHash,
        phone: joinUsRequest.phone,
        roleId: role._id,
        isVerified: true,
        status: 'ACTIVE'
    });

    if (!joinUsRequest) {
        return res.status(400).json({ success: false, message: "Request not found" });
    }

    if(!newUser){
        return res.status(400).json({ success: false, message: "User not found" });
    }

    const newEmployee = await Employee.create({
        userId: newUser._id,
        phone: joinUsRequest.phone,
        department: joinUsRequest.department,
        designation: joinUsRequest.designation,
        joiningDate: joinUsRequest.joiningDate
    });

    let newDoctor = null;

    const isDoctor = joinUsRequest.role?.toLowerCase() === 'doctor';

    if (isDoctor) {
        newDoctor = await Doctor.create({
            userId: newUser._id,
            employeeId: newEmployee._id,
            specialization: joinUsRequest.specialization,
            qualification: joinUsRequest.qualification,
            consultationFee: joinUsRequest.consultationFee,
            medicalRegistrationNo: joinUsRequest.medicalRegistrationNo,
            availabilityStartTime: joinUsRequest.availabilityStartTime,
            availabilityEndTime: joinUsRequest.availabilityEndTime,
            experienceYears: joinUsRequest.experienceYears
        });
    }

    joinUsRequest.approvalStatus = 'APPROVED';
    joinUsRequest.approvedAt = new Date();

    if (approvedBy) {
        joinUsRequest.approvedBy = approvedBy;
    }

    await joinUsRequest.save();

    const userResponse = newUser.toObject();
    delete userResponse.passwordHash;

    return {
        message: 'Join request approved successfully',
        data: {
            user: userResponse,
            employee: newEmployee,
            doctor: newDoctor
        }
    };
};

exports.rejectJoinUsRequest = async (requestId, rejectedBy, reason) => {
  const request = await JoinUs.findById(requestId);

  if (!request) {
    throw new ApiError(404, "Join request not found");
  }

  if (request.approvalStatus === "APPROVED") {
    throw new ApiError(400, "Cannot reject an already approved request");
  }

  if (request.approvalStatus === "REJECTED") {
    throw new ApiError(400, "Request is already rejected");
  }

  request.approvalStatus = "REJECTED";
  request.rejectionReason = reason?.trim() || "No reason provided";

  await JoinUs.findByIdAndDelete(requestId);

  return {
    message: "Join request rejected successfully",
    data: request,
  };
};