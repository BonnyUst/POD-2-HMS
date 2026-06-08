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


    const ownerMenus = menus.map(menu => ({
      roleName: ROLES.OWNER.roleName,
      menuId: menu._id
    }));


    const adminMenus = mapMenus(
      ["Dashboard", "Employee","Doctor", "Patient", "Departments", "Approvals", "Appointments"],
      ROLES.ADMIN.roleName
    );


    const doctorMenus = mapMenus(
      ["Dashboard", "Patient","Appointments"],
      ROLES.DOCTOR.roleName
    );


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

    

  } catch (err) {
    console.error("❌ RoleMenu seed error:", err.message);
  }
};

module.exports = seedRoleMenus;














































































