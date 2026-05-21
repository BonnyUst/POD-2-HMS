const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  path: {
    type: String,
    required: true
  },

  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    default: null
  },

  order: {
    type: Number,
    default: 0
  },

  isVisible: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);