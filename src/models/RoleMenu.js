const mongoose = require('mongoose');

const roleMenuSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: true
  },
  menuId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    required: true
  }
});

module.exports = mongoose.model('RoleMenu', roleMenuSchema);