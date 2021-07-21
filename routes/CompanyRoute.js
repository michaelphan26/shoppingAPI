const express = require('express');
const {
  getCompanyList,
  addCompany,
  editCompany,
  deleteCompany,
} = require('../controllers/CompanyController');
const router = express.Router();
const { adminAuth } = require('../middlewares/AuthMiddleware');

router.get('/get-list', adminAuth, getCompanyList);

router.post('/add-company', adminAuth, addCompany);

router.put('/edit-company/:id', adminAuth, editCompany);

router.delete('/delete-company/:id', adminAuth, deleteCompany);

module.exports = router;
