const Role = require('../models/role.model');
const Employee = require('../models/employee.model');
const getRoles = async () => {
    const roles = await Role.find(
        {
            name: { $nin: ['Administrator', 'Owner'] }
        },
        'name -_id'
    );

    return roles;
}
const getDepartments = async () => {
    const departments = await Employee.schema.path('department').enumValues;
    return departments;
}
module.exports = {
    getRoles,
    getDepartments,
}