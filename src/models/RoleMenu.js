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

}, { timestamps: true });

module.exports = mongoose.model('RoleMenu', roleMenuSchema);