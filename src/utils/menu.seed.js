const Menu = require('../models/Menu');

const seedMenus = async () => {
  // MAIN MENUS
  const admin = await Menu.create({ name: "Admin", path: "/admin" });
  const employee = await Menu.create({ name: "Employee", path: "/employee" });
  const patient = await Menu.create({ name: "Patient", path: "/patient" });

  // SUB MENUS (Employee)
  await Menu.insertMany([
    { name: "Doctor", path: "/employee/doctor", parentId: employee._id },
    { name: "Nurse", path: "/employee/nurse", parentId: employee._id },
    { name: "Receptionist", path: "/employee/receptionist", parentId: employee._id },
    { name: "Cashier", path: "/employee/cashier", parentId: employee._id },
    { name: "Lab Technician", path: "/employee/lab-tech", parentId: employee._id }
  ]);

  console.log("Menus Seeded");
};

module.exports = seedMenus;