const Menu = require('../models/Menu');

const seedMenus = async () => {
  try {
    await Menu.deleteMany();

    // 🔥 DASHBOARD
    const dashboard = await Menu.create({
      name: "Dashboard",
      path: "dashboard",
      order: 0
    });

    // 🔥 MAIN MENUS
    const employee = await Menu.create({
      name: "Employee",
      path: "employee",
      order: 1
    });

    const patient = await Menu.create({
      name: "Patient",
      path: "patient",
      order: 2
    });

    const departments = await Menu.create({
      name: "Departments",
      path: "departments",
      order: 3
    });

    const approvals = await Menu.create({
      name: "Approvals",
      path: "approval",
      order: 4
    });

    const appointments = await Menu.create({
      name: "Appointments",
      path: "appointments",
      order: 5
    });

    // 🔥 SUB MENUS
    await Menu.insertMany([
      { name : 'Admin', path : "employee/admin", parentId: employee._id },
      { name: "Doctor", path: "employee/doctor", parentId: employee._id },
      { name: "Nurse", path: "employee/nurse", parentId: employee._id },
      { name: "Receptionist", path: "employee/receptionist", parentId: employee._id },
      { name: "Cashier", path: "employee/cashier", parentId: employee._id },
      { name: "Lab Technician", path: "employee/lab-tech", parentId: employee._id }
    ]);

    console.log("✅ Menus seeded");

  } catch (err) {
    console.error("❌ Menu seed error:", err.message);
  }
};

module.exports = seedMenus;

// const Menu = require('../models/Menu');

// const seedMenus = async () => {
//   try {
//     await Menu.deleteMany();

//     // 🔥 MAIN MENUS
//     const dashboard = await Menu.create({ name: "Dashboard", path: "dashboard", order: 0 });

//     const employee = await Menu.create({ name: "Employee", path: "employee", order: 1 });

//     const doctorMain = await Menu.create({
//       name: "Doctor",
//       path: "doctor",
//       order: 2
//     });

//     const patient = await Menu.create({ name: "Patient", path: "patient", order: 3 });
//     const approvals = await Menu.create({ name: "Approvals", path: "approval", order: 4 });
//     const appointments = await Menu.create({ name: "Appointments", path: "appointments", order: 5 });

//     // 🔥 SUB MENUS (UNDER EMPLOYEE)
//     await Menu.insertMany([
//       { name: "Admin", path: "employee/admin", parentId: employee._id },
//       { name: "Doctor", path: "employee/doctor", parentId: employee._id },
//       { name: "Nurse", path: "employee/nurse", parentId: employee._id },
//       { name: "Receptionist", path: "employee/receptionist", parentId: employee._id }
//     ]);

//     console.log("✅ Menus seeded");
//   } catch (err) {
//     console.error("❌ Menu seed error:", err.message);
//   }
// };

// module.exports = seedMenus;