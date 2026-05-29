const RoleMenu = require('../models/RoleMenu');
const Menu = require('../models/Menu');
const ROLES = require('../constants/role.constant');

const seedRoleMenus = async () => {
  try {
    await RoleMenu.deleteMany();

    const menus = await Menu.find();

    const getMenu = (name) => menus.find(m => m.name === name);

    const mapMenus = (menuNames, roleName) =>
      menuNames
        .map(name => getMenu(name))
        .filter(Boolean)
        .map(menu => ({
          roleName,
          menuId: menu._id
        }));

    // OWNER → ALL
    const ownerMenus = menus.map(menu => ({
      roleName: ROLES.OWNER.roleName,
      menuId: menu._id
    }));

    // ADMIN
    const adminMenus = mapMenus(
      ["Dashboard", "Employee", "Patient", "Departments", "Approvals", "Appointments"],
      ROLES.ADMIN.roleName
    );

    // DOCTOR
    const doctorMenus = mapMenus(
      ["Dashboard", "Patient"],
      ROLES.DOCTOR.roleName
    );

    // RECEPTIONIST
    const receptionistMenus = mapMenus(
      ["Dashboard", "Patient", "Appointments"],
      ROLES.RECEPTIONIST.roleName
    );

    await RoleMenu.insertMany([
      ...ownerMenus,
      ...adminMenus,
      ...doctorMenus,
      ...receptionistMenus
    ]);

    console.log("✅ RoleMenu seeded");

  } catch (err) {
    console.error("❌ RoleMenu seed error:", err.message);
  }
};

module.exports = seedRoleMenus;

// const RoleMenu = require('../models/RoleMenu');
// const Menu = require('../models/Menu');
// const ROLES = require('../constants/role.constant');

// const seedRoleMenus = async () => {
//   try {
//     await RoleMenu.deleteMany();

//     const menus = await Menu.find();

//     const getMenu = (name) =>
//       menus.find(m => m.name === name && !m.parentId);

//     // =========================
//     // 👑 OWNER
//     // =========================
//     const ownerMenus = [
//       "Dashboard",
//       "Employee",
//       "Patient",
//       "Approvals"
//     ]
//       .map(name => getMenu(name))
//       .filter(Boolean)
//       .map(menu => ({
//         roleName: ROLES.OWNER.roleName,
//         menuId: menu._id
//       }));


//     // =========================
//     // 🛠 ADMIN
//     // =========================
//     const adminMenus = [
//       "Dashboard",
//       "Employee",
//       "Doctor", // ✅ separate
//       "Patient",
//       "Appointments",
//       "Approvals"
//     ]
//       .map(name => getMenu(name))
//       .filter(Boolean)
//       .map(menu => ({
//         roleName: ROLES.ADMIN.roleName,
//         menuId: menu._id
//       }));


//     // =========================
//     // 👨‍⚕️ DOCTOR
//     // =========================
//     const doctorMenus = [
//       "Dashboard",
//       "Patient"
//     ]
//       .map(name => getMenu(name))
//       .filter(Boolean)
//       .map(menu => ({
//         roleName: ROLES.DOCTOR.roleName,
//         menuId: menu._id
//       }));


//     await RoleMenu.insertMany([
//       ...ownerMenus,
//       ...adminMenus,
//       ...doctorMenus
//     ]);

//     console.log("✅ RoleMenu seeded");

//   } catch (err) {
//     console.error("❌ RoleMenu seed error:", err.message);
//   }
// };

// module.exports = seedRoleMenus;