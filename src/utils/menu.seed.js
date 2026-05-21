const Menu = require('../models/Menu');

const seedMenus = async () => {
  try {
    await Menu.deleteMany(); // optional reset

    // 🔥 MAIN MENUS
    const admin = await Menu.create({
      name: "Admin",
      path: "/admin",
      order: 1
    });

    const employee = await Menu.create({
      name: "Employee",
      path: "/employee",
      order: 2
    });

    const patient = await Menu.create({
      name: "Patient",
      path: "/patient",
      order: 3
    });

    const roles = await Menu.create({
      name: "Roles",
      path: "/roles",
      order: 4
    });

    const departments = await Menu.create({
      name: "Departments",
      path: "/departments",
      order: 5
    });

    // 🔥 SUB MENUS (Employee)
    await Menu.insertMany([
      {
        name: "Doctor",
        path: "/employee/doctor",
        parentId: employee._id,
        order: 1
      },
      {
        name: "Nurse",
        path: "/employee/nurse",
        parentId: employee._id,
        order: 2
      },
      {
        name: "Receptionist",
        path: "/employee/receptionist",
        parentId: employee._id,
        order: 3
      },
      {
        name: "Cashier",
        path: "/employee/cashier",
        parentId: employee._id,
        order: 4
      },
      {
        name: "Lab Technician",
        path: "/employee/lab-tech",
        parentId: employee._id,
        order: 5
      }
    ]);

    console.log("✅ Menus seeded");

  } catch (err) {
    console.error("❌ Menu seed error:", err.message);
  }
};

module.exports = seedMenus;