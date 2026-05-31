const Appointment = require('../models/Appointment.model');
const Patient = require('../models/Patient.model');
const Employee = require('../models/Employee.model');
const ApiError = require('../utils/ApiError');
const Doctor=require('../models/Doctor.model')
const generateTimeSlots = (startTime, endTime) => {
    const slots = [];

    const parseTime = (timeStr) => {
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        return hours * 60 + minutes;
    };

    const formatTime = (totalMinutes) => {
        let hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        // Determine AM or PM
        const period = hours >= 12 ? 'PM' : 'AM';

        // Convert to 12 hour format
        if (hours === 0) hours = 12;        // midnight
        else if (hours > 12) hours -= 12;   // 13 → 1, 14 → 2 etc

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
    };

    const startMinutes = parseTime(startTime);
    const endMinutes = parseTime(endTime);

    for (let i = startMinutes; i < endMinutes; i += 30) {
        slots.push(formatTime(i));
    }

    return slots;
};


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

    const employeeRecord = await Employee.findById(doctorId).populate({
        path: 'userId',
        populate: {
            path: 'roleId'
        }
    });

    if (!employeeRecord) {
        throw new ApiError(404, 'Doctor not found');
    }

    if (employeeRecord.userId?.roleId?.name !== 'Doctor') {
        throw new ApiError(400, 'Selected employee is not a doctor');
    }

        // Validate time slot is within doctor's availability
    const doctor = await Doctor.findOne({ employeeId: doctorId });

    if (doctor) {
        const availableSlots = generateTimeSlots(
            doctor.availabilityStartTime,
            doctor.availabilityEndTime
        );

        if (!availableSlots.includes(timeSlot)) {
            throw new ApiError(400,
                `Doctor is only available from ${doctor.availabilityStartTime} to ${doctor.availabilityEndTime}`
            );
        }
    }

    // Check if slot is already booked
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



exports.getAvailableSlots = async (doctorId, appointmentDate) => {
    // Find doctor to get availability
    const doctor = await Doctor.findOne({ employeeId: doctorId });

    if (!doctor) {
        throw new ApiError(404, 'Doctor not found');
    }

    // Generate all possible slots from doctor's availability
    const allSlots = generateTimeSlots(
        doctor.availabilityStartTime,
        doctor.availabilityEndTime
    );

    // Find booked slots for this doctor on this date
    const bookedAppointments = await Appointment.find({
        doctorId,
        appointmentDate,
        status: 'BOOKED'
    }).select('timeSlot');

    const bookedSlots = bookedAppointments.map(apt => apt.timeSlot);

    // Filter out booked slots
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    return {
        availabilityStart: doctor.availabilityStartTime,
        availabilityEnd: doctor.availabilityEndTime,
        totalSlots: allSlots.length,
        bookedCount: bookedSlots.length,
        availableSlots
    };
};