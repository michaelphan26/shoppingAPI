const express = require("express");
const router = express.Router();
const {
  getRoleList,
  addRole,
  editRole,
} = require("../controllers/RoleController");
const { auth, adminAuth } = require("../middlewares/AuthMiddleware");

router.get("/role-list", auth, getRoleList);

router.post("/add-role", adminAuth, addRole);

// router.delete("/delete-role", adminAuth, deleteRole);

router.put("/edit-role", adminAuth, editRole);

module.exports = router;
