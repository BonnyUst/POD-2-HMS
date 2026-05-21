const RoleMenu = require('../models/RoleMenu');
const Menu = require('../models/Menu');
const ROLES = require('../constants/role.constant');

const seedRoleMenus = async () => {
  try {
    await RoleMenu.deleteMany(); // reset

    const menus = await Menu.find();

    // 🔍 helper
    const getMenu = (name) => menus.find(m => m.name === name);

    // =========================
    // 🔥 OWNER → ALL MENUS
    // =========================
    const ownerMenus = menus.map(menu => ({
      roleName: ROLES.OWNER.roleName,
      menuId: menu._id
    }));

    // =========================
    // 🔥 ADMIN → LIMITED MENUS
    // =========================
    const adminMenus = [
      getMenu("Employee"),
      getMenu("Patient"),
      getMenu("Departments")
    ].map(menu => ({
      roleName: ROLES.ADMIN.roleName,
      menuId: menu._id
    }));

    // =========================
    // 🔥 EMPLOYEE (GENERIC ROLE)
    // Example: Doctor/Nurse etc
    // =========================
    const employeeMenus = [
      getMenu("Patient")
    ].map(menu => ({
      roleName: ROLES.DOCTOR.roleName, // you can repeat for NURSE etc
      menuId: menu._id
    }));

    await RoleMenu.insertMany([
      ...ownerMenus,
      ...adminMenus,
      ...employeeMenus
    ]);

    console.log("✅ RoleMenu seeded");

  } catch (err) {
    console.error("❌ RoleMenu seed error:", err.message);
  }
};

module.exports = seedRoleMenus;