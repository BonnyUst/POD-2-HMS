const departments = require('../constants/dept.constant')
const Departments = require('../models/Departments');
const seedDepartments = async () => {
    try {
        await Departments.insertMany(departments, { ordered: false });
        
    } catch (err) {
        if (err.code === 11000) {
            
        } else {
            
        }
    }
};
module.exports = seedDepartments;