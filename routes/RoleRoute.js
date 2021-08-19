const express = require('express');
const router = express.Router();
const {
  getRoleList,
  addRole,
  editRole,
  deleteRole,
  getRoleInfo,
} = require('../controllers/RoleController');
const { adminAuth } = require('../middlewares/AuthMiddleware');

router.get('/role-info/:id', adminAuth, getRoleInfo);

router.get('/get-list', getRoleList);

module.exports = router;
