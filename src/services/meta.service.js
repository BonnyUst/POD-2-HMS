const Menu = require('../models/Menu');
const RoleMenu = require('../models/RoleMenu');
const ApiError = require('../utils/ApiError');
const Approval = require('../models/Approvals');
const User = require('../models/User');
const Departments = require('../models/Departments');
const { GENDER } = require('../constants/basic.constant');
const { BLOOD_GROUP } = require('../constants/hms.constant');
const ROLE_DEPT_MAP = require('../utils/roleDeptMap');
const ROLES = require('../constants/role.constant');


const getMenuByRole = async (roleName) => {

  const roleMenus = await RoleMenu.find({ roleName })
    .populate('menuId');





  const menus = roleMenus
    .map(rm => rm.menuId)
    .filter(m => m && m.isVisible);


  const parentMenus = menus.filter(m => !m.parentId);

  const finalMenus = parentMenus.map(parent => ({
    ...parent.toObject(),
    children: menus
      .filter(m => m.parentId?.toString() === parent._id.toString())
      .sort((a, b) => a.order - b.order)
  })).sort((a, b) => a.order - b.order);

  return finalMenus;
};



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



const deleteMenu = async (menuId) => {

  const menu = await Menu.findById(menuId);

  if (!menu) {
    throw new ApiError(404, "Menu not found");
  }


  await Menu.findByIdAndDelete(menuId);


  await RoleMenu.deleteMany({ menuId });
};



const toggleMenu = async (menuId) => {

  const menu = await Menu.findById(menuId);

  if (!menu) {
    throw new ApiError(404, "Menu not found");
  }

  menu.isVisible = !menu.isVisible;

  await menu.save();

  return menu;
};



const assignMenusToRole = async (roleName, menuIds) => {

  if (!roleName || !menuIds?.length) {
    throw new ApiError(400, "roleName and menuIds required");
  }


  await RoleMenu.deleteMany({ roleName });


  const roleMenus = menuIds.map(menuId => ({
    roleName,
    menuId
  }));

  await RoleMenu.insertMany(roleMenus);
};

const checkJoinUs = async (email) => {

  const user = await User.findOne({ email });
  if (user) {
    return { status: "EXISTS" , message : "User already exists." };
  }

  const approval = await Approval.findOne({ email });

  if (!approval) {
    return { status: "NEW", message : "" };
  }

  if (!approval.isEmailVerified) {
    return { status: "NOT_VERIFIED", message : "Kindly verify your account to proceed next!" };
  }

  if (approval.status === "PENDING") {
    return { status: "PENDING", userEmail : approval.email ,message : "Your account is waiting for admins approval!" };
  }

  if (approval.status === "APPROVED") {
    return { status: "APPROVED", message : "Already approved. Please login." };
  }

  if (approval.status === "REJECTED") {
    return { status: "REJECTED" , message : approval.message };
  }
};

const getMetaData = async()=>{
  const departments = await Departments.find().select('deptName deptId');
  return { 
    genders : Object.values(GENDER),
    bloodGroups : Object.values(BLOOD_GROUP),
    roleDeptMap : ROLE_DEPT_MAP,
    roleNames : ROLES,
    departments
  }
}

const getPatientMetaData = async()=>{
  return {
    genders : Object.values(GENDER),
    bloodGroups : Object.values(BLOOD_GROUP)
  }
}

module.exports = {
  getMenuByRole,
  createMenu,
  updateMenu,
  deleteMenu,
  toggleMenu,
  assignMenusToRole,
  checkJoinUs,
  getMetaData,
  getPatientMetaData
};

