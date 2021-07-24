const mongoose = require('mongoose');
const { errorResponse } = require('../models/ResponseAPI');

async function checkID(id) {
  try {
    id = new mongoose.Types.ObjectId(id);
    return id;
  } catch (err) {
    return null;
  }
}

module.exports = { checkID };
