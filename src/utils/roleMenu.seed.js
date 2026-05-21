const RoleMenu = require('../models/RoleMenu');
const Menu = require('../models/Menu');
const ROLES = require('../constants/role.constant');

const seedRoleMenus = async () => {
  try {
    await RoleMenu.deleteMany();

    const menus = await Menu.find();

    if (!menus.length) {
      throw new Error("No menus found. Seed menus first.");
    }

    // 🔍 helper
    const getMenu = (name) => menus.find(m => m.name === name);

    // =========================
    // OWNER → ALL MENUS
    // =========================
    const ownerMenus = menus.map(menu => ({
      roleName: ROLES.OWNER.roleName,
      menuId: menu._id
    }));

    // =========================
    // ADMIN → LIMITED MENUS
    // =========================
    const adminMenuNames = ["Employee", "Patient", "Departments"];

    const adminMenus = adminMenuNames
      .map(name => getMenu(name))
      .filter(menu => menu) 
      .map(menu => ({
        roleName: ROLES.ADMIN.roleName,
        menuId: menu._id
      }));

    // =========================
    // EMPLOYEE (Doctor example)
    // =========================
    const employeeMenus = ["Patient"]
      .map(name => getMenu(name))
      .filter(menu => menu) // 🔥 IMPORTANT FIX
      .map(menu => ({
        roleName: ROLES.DOCTOR.roleName,
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