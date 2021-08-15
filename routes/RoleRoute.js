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

router.post('/add-role', adminAuth, addRole);

router.delete('/delete-role/:id', adminAuth, deleteRole);

router.put('/edit-role/:id', adminAuth, editRole);

module.exports = router;
