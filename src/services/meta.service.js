const Menu = require('../models/Menu');
const RoleMenu = require('../models/RoleMenu');
const ApiError = require('../utils/ApiError');

// ✅ GET MENU BY ROLE
const getMenuByRole = async (roleName) => {

  const roleMenus = await RoleMenu.find({ roleName })
    .populate('menuId');

  const menus = roleMenus
    .map(rm => rm.menuId)
    .filter(m => m && m.isVisible);

  // 🔥 build hierarchy
  const parentMenus = menus.filter(m => !m.parentId);

  const finalMenus = parentMenus.map(parent => ({
    ...parent.toObject(),
    children: menus
      .filter(m => m.parentId?.toString() === parent._id.toString())
      .sort((a, b) => a.order - b.order)
  })).sort((a, b) => a.order - b.order);

  return finalMenus;
};


// ✅ CREATE MENU
const createMenu = async (data) => {

  const { name, path, parentId, order } = data;

  if (!name || !path) {
    throw new ApiError(400, "Name and path are required");
  }

  const menu = await Menu.create({
    name,
    path,
    parentId: parentId || null,
    order: order || 0
  });

  return menu;
};


// ✅ UPDATE MENU
const updateMenu = async (menuId, data) => {

  const menu = await Menu.findByIdAndUpdate(
    menuId,
    data,
    { new: true }
  );

  if (!menu) {
    throw new ApiError(404, "Menu not found");
  }

  return menu;
};


// ✅ DELETE MENU
const deleteMenu = async (menuId) => {

  const menu = await Menu.findById(menuId);

  if (!menu) {
    throw new ApiError(404, "Menu not found");
  }

  // delete menu
  await Menu.findByIdAndDelete(menuId);

  // delete role mappings
  await RoleMenu.deleteMany({ menuId });
};


// ✅ TOGGLE MENU VISIBILITY
const toggleMenu = async (menuId) => {

  const menu = await Menu.findById(menuId);

  if (!menu) {
    throw new ApiError(404, "Menu not found");
  }

  menu.isVisible = !menu.isVisible;

  await menu.save();

  return menu;
};


// ✅ ASSIGN MENUS TO ROLE
const assignMenusToRole = async (roleName, menuIds) => {

  if (!roleName || !menuIds?.length) {
    throw new ApiError(400, "roleName and menuIds required");
  }

  // remove old mappings
  await RoleMenu.deleteMany({ roleName });

  // insert new mappings
  const roleMenus = menuIds.map(menuId => ({
    roleName,
    menuId
  }));

  await RoleMenu.insertMany(roleMenus);
};


module.exports = {
  getMenuByRole,
  createMenu,
  updateMenu,
  deleteMenu,
  toggleMenu,
  assignMenusToRole
};