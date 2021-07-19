const express = require("express");
const router = express.Router();
const {
  getCategoryList,
  addCategory,
  editCategory,
} = require("../controllers/CategoryController");
const { auth, adminAuth } = require("../middlewares/AuthMiddleware");

router.get("/category-list", auth, getCategoryList);

router.post("/add-category", adminAuth, addCategory);

// router.delete("/delete-category", adminAuth, deleteCategory);

router.put("/edit-category", adminAuth, editCategory);

module.exports = router;
