const mongoose = require('mongoose');
const { APPROVAL_STATUS } = require('../constants/basic.constant');

const approvalSchema = new mongoose.Schema(
{
  email: { type: String, required: true, unique: true },

  firstName: String,
  lastName: String,
  phone: String,
  password: String,

  roleName: String,


  gender: String,
  bloodGroup: String,

  deptName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },

  designation: String,
  joiningDate: Date,


  isDoctor: Boolean,
  medRegNo: String,
  specialization: String,
  qualification: String,
  consultationFee: Number,
  avlblStartTime: String,
  avlblEndTime: String,
  expYears: Number,

  isEmailVerified: {
    type: Boolean,
    default: false
  },

  status: {
    type: String,
    enum: Object.values(APPROVAL_STATUS),
    default: APPROVAL_STATUS.PENDING
  },

  verificationToken: String,
  message : String,
},
{ timestamps: true }
);

module.exports = mongoose.model('Approval', approvalSchema);