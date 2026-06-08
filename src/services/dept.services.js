const Employee = require('../models/Employee')
const Departments = require('../models/Departments')

const getDepartmentEmployees = async ({ departmentId, page, limit, role }) => {

    const skip = (page - 1) * limit;

    let matchStage = {
        departmentId: departmentId
    };

    let employees = await Employee.find(matchStage)
        .populate({
            path: 'userId',
            select: 'firstName lastName email phone roleId status',
            populate: {
                path: 'roleId',
                select: 'roleName'
            }
        })
        .lean();


    if (role !== 'ALL') {
        employees = employees.filter(
            e => e.userId.roleId?.roleName === role
        );
    }

    const total = employees.length;

    const paginated = employees.slice(skip, skip + limit);

    return {
        data: paginated.map(emp => ({
            employeeId: emp.employeeId,
            name: `${emp.userId.firstName} ${emp.userId.lastName}`,
            email: emp.userId.email,
            phone: emp.userId.phone,
            roleName: emp.userId.roleId?.roleName,
            status: emp.userId.status,
            designation: emp.designation,
            userId: emp.userId._id
        })),
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

const getAllDepartments = async()=>{
    return await Departments.find({}, { deptName: 1, deptId: 1 });
}
module.exports = { getDepartmentEmployees, getAllDepartments };

