// services/patient.service.js

const User = require("../models/User.model");

const Role = require("../models/Role.model");
const bcrypt = require("bcrypt");

const Patient = require('../models/Patient.model');
const ApiError = require('../utils/ApiError');
const { generateToken } = require('../utils/jwt')
const {
  getPagination,
  buildPaginationResponse
} = require('../utils/pagination');

const generateTemporaryPassword =
  require("../utils/passwordGenerator");

const mailService = require('../service/mail.service');
const sendEmail = require('../service/mail.service');
exports.createPatient = async (patientData, employeeId) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    gender,
    dob,
    bloodGroup,
    address,
    emergencyContactName,
    emergencyContactPhone,
  } = patientData;

  const normalizedEmail = email.trim().toLowerCase();

  // Check whether the email already exists in users collection
  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new ApiError(
      409,
      "A user is already registered with this email"
    );
  }

  // Use the same role lookup used in self-registration
  const patientRole = await Role.findOne({
    name: "Patient",
  });

  if (!patientRole) {
    throw new ApiError(
      500,
      "Patient role not configured"
    );
  }

  // Generate and hash the temporary password
  const temporaryPassword =
    generateTemporaryPassword();

  const passwordHash = await bcrypt.hash(
    temporaryPassword,
    10
  );

  let user;
  let patient;

  try {
    /*
     * Create the patient's login account
     * in the users collection.
     */
    user = await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      passwordHash,
      roleId: patientRole._id,

      /*
       * The account is created by an authorised admin,
       * so separate email verification is not required.
       */
      isVerified: true,
      status: "ACTIVE",
      mustChangePassword: true,
    });

    /*
     * Create the patient profile and link it
     * to the newly created User.
     */
    patient = await Patient.create({
      userId: user._id,

      firstName,
      lastName,
      phone,
      gender,
      dob,
      bloodGroup,
      address,
      emergencyContactName,
      emergencyContactPhone,

      // The logged-in admin who created this patient
      createdBy: employeeId,
    });
  } catch (error) {
    /*
     * If Patient creation fails after User creation,
     * remove the incomplete User record.
     */
    if (patient?._id) {
      await Patient.findByIdAndDelete(
        patient._id
      ).catch(() => {});
    }

    if (user?._id) {
      await User.findByIdAndDelete(
        user._id
      ).catch(() => {});
    }

    throw error;
  }

  let credentialsEmailSent = false;

  try {
    const subject =
      "Your HMS Patient Account";

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Welcome to HMS</h2>

        <p>Hi ${firstName},</p>

        <p>
          Your patient account has been created successfully
          by the hospital administrator.
        </p>

        <p>
          You can log in using the following credentials:
        </p>

        <p>
          <strong>Email:</strong>
          ${normalizedEmail}
        </p>

        <p>
          <strong>Temporary password:</strong>
          ${temporaryPassword}
        </p>

        <p>
          For security, please change your temporary password
          immediately after logging in.
        </p>

        <p>
          Regards,<br>
          Hospital Management System
        </p>
      </div>
    `;

    /*
     * Existing mail.service.js signature:
     * sendEmail(to, subject, html)
     */
    await sendEmail(
      normalizedEmail,
      subject,
      html
    );

    credentialsEmailSent = true;
  } catch (emailError) {
    console.error(
      "Patient created, but credentials email failed:",
      emailError.message
    );
  }

  return {
    patientId: patient._id,
    userId: user._id,
    email: normalizedEmail,
    credentialsEmailSent,
  };
};
exports.getAllPatients = async (query = {}) => {
  const { page, limit, skip, sortBy, sortOrder } = getPagination(query);
  const search = query.search ? query.search.trim() : '';

  const allowedSortFields = ['createdAt', 'firstName', 'lastName', 'UHID'];
  const finalSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : 'createdAt';

  const filter = {};

  if (search) {
    filter.$or = [
      { UHID: { $regex: search, $options: 'i' } },
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { gender: { $regex: search, $options: 'i' } },
      { bloodGroup: { $regex: search, $options: 'i' } },
      { 'address.city': { $regex: search, $options: 'i' } },
      { 'address.state': { $regex: search, $options: 'i' } },
      { 'address.pincode': { $regex: search, $options: 'i' } }
    ];
  }

  const totalRecords = await Patient.countDocuments(filter);

  const patients = await Patient.find(filter)
    .populate({
      path: 'createdBy',
      select: 'firstName lastName email roleId',
      populate: {
        path: 'roleId',
        select: 'name roleCode',
      },
    })
    .sort({ [finalSortBy]: sortOrder })
    .skip(skip)
    .limit(limit);

  const formattedPatients = patients.map((patient) => ({
    patientId: patient._id,
    UHID: patient.UHID,

    firstName: patient.firstName,
    lastName: patient.lastName,
    phone: patient.phone,

    gender: patient.gender,
    dob: patient.dob,
    bloodGroup: patient.bloodGroup,

    city: patient.address?.city,
    state: patient.address?.state,
    pincode: patient.address?.pincode,

    emergencyContactName: patient.emergencyContactName,
    emergencyContactPhone: patient.emergencyContactPhone,

    createdByName:
      `${patient.createdBy?.firstName || ''} ${patient.createdBy?.lastName || ''}`.trim() ||
      patient.createdBy?.email ||
      'Unknown User',

    createdByEmail: patient.createdBy?.email,
    createdByRole: patient.createdBy?.roleId?.name,
    createdByRoleCode: patient.createdBy?.roleId?.roleCode,

    createdAt: patient.createdAt,
  }));

  return {
    patients: formattedPatients,
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

exports.registerPatient = async (body) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    gender,
    dob,
    bloodGroup,
    address,
    emergencyContactName,
    emergencyContactPhone,
  } = body;

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, "Email already registered");

  const patientRole = await Role.findOne({ name: "Patient" });
  if (!patientRole) throw new ApiError(500, "Patient role not configured");

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    firstName,
    lastName,
    email,
    passwordHash,
    roleId: patientRole._id,
    isVerified: false,//will later implement the email verification
    status: "ACTIVE",
    mustChangePassword: true

  });
  if(!user)
  {
    throw new ApiError(404,"User not Found");
  }
  const userId = user._id;
  const token = await generateToken({ userId });
  const verifyLink = `http://localhost:5000/api/auth/verify-email/${token}`
  const html = `
    <h2>Welcome to HMS 👋</h2>

    <p>Hi ${firstName},</p>

    <p>Please verify your email to activate your account.</p>

    <a href="${verifyLink}"
       style="display:inline-block;padding:10px 20px;background:#4CAF50;color:#fff;text-decoration:none;border-radius:5px;">
       Verify Email
    </a>

    <p>Or copy and paste this link:</p>
    <p>${verifyLink}</p>

    <p>This link will expire in 24 hours.</p>
  `;
  sendEmail(
    email,
    "Welcome to HMS 🎉",
    html
  );
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  const patient = await Patient.create({
    userId: user._id,
    firstName,
    lastName,
    phone,
    gender,
    dob,
    bloodGroup,
    address,
    emergencyContactName,
    emergencyContactPhone,
    createdBy: user._id,
  });

  return { message: "Registration successful", patientId: patient._id };
};

exports.getPatientProfile = async (userId) => {
  const patientProfile = await Patient.findOne({ userId })
    .populate({
      path: "userId",
      select: "-passwordHash",
      populate: {
        path: "roleId",
        select: "name roleCode"
      }
    });

  if (!patientProfile) {
    throw new ApiError(404, "Patient profile not found");
  }

  return {
    userId: patientProfile.userId._id,

    firstName: patientProfile.userId.firstName,
    lastName: patientProfile.userId.lastName,
    email: patientProfile.userId.email,

    role: patientProfile.userId.roleId.name,
    roleCode: patientProfile.userId.roleId.roleCode,

    isVerified: patientProfile.userId.isVerified,
    status: patientProfile.userId.status,
    mustChangePassword: patientProfile.userId.mustChangePassword,

    patientId: patientProfile._id,
    UHID: patientProfile.UHID,
    phone: patientProfile.phone,
    gender: patientProfile.gender,
    dob: patientProfile.dob,
    bloodGroup: patientProfile.bloodGroup,

    address: patientProfile.address,

    emergencyContactName: patientProfile.emergencyContactName,
    emergencyContactPhone: patientProfile.emergencyContactPhone
  };
};

exports.updatePatientProfile = async (userId, updateData) => {
  const patient = await Patient.findOne({ userId });

  if (!patient) {
    throw new ApiError(404, 'Patient profile not found');
  }

  const patientAllowedFields = [
    'phone',
    'gender',
    'dob',
    'bloodGroup',
    'address',
    'emergencyContactName',
    'emergencyContactPhone'
  ];

  patientAllowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      patient[field] = updateData[field];
    }
  });

  if (updateData.firstName !== undefined || updateData.lastName !== undefined) {
    await User.findByIdAndUpdate(userId, {
      ...(updateData.firstName !== undefined && {
        firstName: updateData.firstName
      }),
      ...(updateData.lastName !== undefined && {
        lastName: updateData.lastName
      })
    });
  }

  if (updateData.firstName !== undefined) {
    patient.firstName = updateData.firstName;
  }

  if (updateData.lastName !== undefined) {
    patient.lastName = updateData.lastName;
  }

  await patient.save();

  return await Patient.findById(patient._id).populate(
    'userId',
    'firstName lastName email'
  );
};
