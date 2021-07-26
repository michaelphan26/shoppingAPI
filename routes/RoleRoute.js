const express = require('express');
const router = express.Router();
const {
  getRoleList,
  addRole,
  editRole,
  deleteRole,
} = require('../controllers/RoleController');
const { adminAuth } = require('../middlewares/AuthMiddleware');

router.get('/role-list', getRoleList);

router.post('/add-role', adminAuth, addRole);

router.delete('/delete-role/:id', adminAuth, deleteRole);

router.put('/edit-role/:id', adminAuth, editRole);

module.exports = router;
