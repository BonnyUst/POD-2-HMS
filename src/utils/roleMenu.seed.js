const RoleMenu = require('../models/RoleMenu');
const Menu = require('../models/Menu');

const seedRoleMenus = async () => {
  const menus = await Menu.find();

  const ownerMenus = menus.map(menu => ({
    roleName: "OWNER",
    menuId: menu._id
  }));

  const adminMenus = menus
    .filter(m => ["Employee", "Patient", "Departments"].includes(m.name))
    .map(menu => ({
      roleName: "ADMIN",
      menuId: menu._id
    }));

  await RoleMenu.insertMany([...ownerMenus, ...adminMenus]);

  console.log("Role Menu Mapping Done");
};

module.exports = seedRoleMenus;