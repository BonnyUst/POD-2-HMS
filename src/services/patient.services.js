const ApiError = require('../utils/ApiError')
const generateId = require('../utils/idGenerator');
const User = require('../models/User')
const Patient = require('../models/Patient')
const Roles = require('../models/Roles')

const createPatientByUserId = async(userId)=>{
    const role = await Roles.findOne({roleName : "PATIENT"});
    if(!role){
        throw new ApiError(404,'Role not found');
    }

    const UHID = await generateId(role.roleId);
    const existingPatient = await Patient.findOne({userId})
    if(existingPatient){
        throw new ApiError(409,'Patient already exists');
    }

    const patient = new Patient({
        userId,
        UHID
    });

    return await patient.save();
}

module.exports = {createPatientByUserId,}

