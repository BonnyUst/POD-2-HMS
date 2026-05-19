const departments = require('../constants/dept.constant')
const Departments = require('../models/Departments');
const seedDepartments = async () => {
    try {
        await Departments.insertMany(departments, { ordered: false });
        console.log('Departments added successfully');
    } catch (err) {
        if (err.code === 11000) {
            console.log('Departments already exist');
        } else {
            console.log("Error seeding departments", err.message);
        }
    }
};
module.exports = seedDepartments;