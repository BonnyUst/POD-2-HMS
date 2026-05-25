const appointmentService = require('../service/appointment.service');

exports.createAppointment = async (req, res, next) => {
    try {
        const appointment = await appointmentService.createAppointment(
            req.body,
            req.user?._id
        );

        return res.status(201).json({
            success: true,
            message: 'Appointment created successfully',
            data: appointment
        });
    } catch (error) {
        next(error);
    }
};

exports.getAppointments = async (req, res, next) => {
    try {
        const appointments = await appointmentService.getAppointments();

        return res.status(200).json({
            success: true,
            message: 'Appointments fetched successfully',
            data: appointments
        });
    } catch (error) {
        next(error);
    }
};