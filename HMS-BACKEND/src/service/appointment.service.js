const Appointment = require('../models/Appointment.model');
const Patient = require('../models/Patient.model');
const Employee = require('../models/Employee.model');
const ApiError = require('../utils/ApiError');

exports.createAppointment = async (appointmentData, loggedInUserId) => {
    const {
        patientId,
        doctorId,
        appointmentDate,
        timeSlot,
        reason
    } = appointmentData;

    const patient = await Patient.findById(patientId);

    if (!patient) {
        throw new ApiError(404, 'Patient not found');
    }

    const doctor = await Employee.findById(doctorId).populate({
        path: 'userId',
        populate: {
            path: 'roleId'
        }
    });

    if (!doctor) {
        throw new ApiError(404, 'Doctor not found');
    }

    if (doctor.userId?.roleId?.name !== 'Doctor') {
        throw new ApiError(400, 'Selected employee is not a doctor');
    }

    const existingAppointment = await Appointment.findOne({
        doctorId,
        appointmentDate,
        timeSlot,
        status: 'BOOKED'
    });

    if (existingAppointment) {
        throw new ApiError(409, 'Doctor already has an appointment in this time slot');
    }

    const appointment = await Appointment.create({
        patientId,
        doctorId,
        appointmentDate,
        timeSlot,
        reason,
        createdBy: loggedInUserId
    });

    return appointment;
};

exports.getAppointments = async () => {
    const appointments = await Appointment.find()
        .populate('patientId')
        .populate({
            path: 'doctorId',
            populate: {
                path: 'userId',
                select: 'firstName lastName email'
            }
        })
        .populate('createdBy', 'firstName lastName email')
        .sort({ createdAt: -1 });

    return appointments;
};