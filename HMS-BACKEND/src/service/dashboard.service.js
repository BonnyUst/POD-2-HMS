const Patient = require('../models/Patient.model')
const Employee = require('../models/Employee.model')

const User = require('../models/User.model')
const ApiError = require('../utils/ApiError')


exports.getDashboardStats = async () => {

    try {
        const [totalPatients,
            totalEmployees,
            pendingApprovals
        ] = await Promise.all([
            Patient.countDocuments(),
            Employee.countDocuments(),
            User.countDocuments({ isVerified: false})
        ]);

        return {
            totalPatients,
            totalEmployees,
            pendingApprovals
        }




    }
    catch (error) {
        throw new ApiError(500,error.message);
    }
}