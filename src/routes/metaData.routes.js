const { create } = require('../models/Roles');
const {createRouter,auth,errorValidate} = require('./routesServices/routes.header');
const authorize = require('../middleware/authorize.middleware');

const router = createRouter();
const {
  getMyMenus,
  createMenu,
  assignMenusToRole,
  updateMenu,
  toggleMenu,
  deleteMenu
} = require('../controllers/meta.controller');
router.post('/menu', auth, authorize("*"), createMenu);
router.post('/menu/assign', auth, authorize("*"), assignMenusToRole);
router.put('/menu/:id', auth, authorize("*"), updateMenu);
router.patch('/menu/:id/toggle', auth, authorize("*"), toggleMenu);
router.delete('/menu/:id', auth, authorize("*"), deleteMenu);
router.get('/menu', auth, getMyMenus);

module.exports = router;
