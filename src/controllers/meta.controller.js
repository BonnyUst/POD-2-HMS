const metaService = require('../services/meta.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('express-async-handler');

// ✅ GET MENUS (ROLE BASED)
exports.getMyMenus = asyncHandler(async (req, res) => {

 console.log("USER:", req.user);
  console.log("ROLE:", req.user.roleName);
  const roleName = req.user.roleName;

  const menus = await metaService.getMenuByRole(roleName);

  return res.status(200).send(
    new ApiResponse(200, menus, "Menus fetched successfully")
  );
});


// ✅ CREATE MENU
exports.createMenu = asyncHandler(async (req, res) => {

  const menu = await metaService.createMenu(req.body);

  return res.status(201).send(
    new ApiResponse(201, menu)
  );
});


// ✅ UPDATE MENU
exports.updateMenu = asyncHandler(async (req, res) => {

  const updatedMenu = await metaService.updateMenu(
    req.params.id,
    req.body
  );

  return res.status(200).send(
    new ApiResponse(200, updatedMenu, "Menu updated successfully")
  );
});


// ✅ DELETE MENU
exports.deleteMenu = asyncHandler(async (req, res) => {

  await metaService.deleteMenu(req.params.id);

  return res.status(200).send(
    new ApiResponse(200, null, "Menu deleted successfully")
  );
});


// ✅ TOGGLE MENU VISIBILITY
exports.toggleMenu = asyncHandler(async (req, res) => {

  const menu = await metaService.toggleMenu(req.params.id);

  return res.status(200).send(
    new ApiResponse(200, menu, "Menu visibility updated")
  );
});


// ✅ ASSIGN MENUS TO ROLE
exports.assignMenusToRole = asyncHandler(async (req, res) => {

  const { roleName, menuIds } = req.body;

  await metaService.assignMenusToRole(roleName, menuIds);

  return res.status(200).send(
    new ApiResponse(200, null, "Menus assigned successfully")
  );
});

exports.checkJoinUs = asyncHandler(async(req,res)=>{
  const {email} = req.body;
  const result = await metaService.checkJoinUs(email);
  return res.status(200).send(new ApiResponse(200,result));
})

exports.getMetaData = asyncHandler(async(req,res)=>{
  const metaData = await metaService.getMetaData();
  return res.status(200).send(new ApiResponse(200,metaData));
})

exports.getPatientMetaData = asyncHandler(async(req,res)=>{
  const patientMetaData = await metaService.getPatientMetaData();
  return res.status(200).send(new ApiResponse(200,patientMetaData));
})
