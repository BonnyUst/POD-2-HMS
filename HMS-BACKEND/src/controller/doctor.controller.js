const ApiResponse = require('../utils/ApiResponse')
const doctorService = require('../service/doctor.service')

const createDoctorByAdmin = async (req, res) => {
    try {
        const doctor = await doctorService.createDoctorByAdmin(req.body);

        return res
            .status(201)
            .json(new ApiResponse(
                201,
                "Doctor Created Successfully",
                doctor
            ));
    }
    catch (error) {
        return res
            .status(error.statusCode || 500)
            .json({
                success: false,
                message: error.message || "Something went wrong"
            });

    }
}

module.exports = { createDoctorByAdmin }