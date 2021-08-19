const express = require('express');
const {
  getCompanyList,
  addCompany,
  editCompany,
  deleteCompany,
  getCompanyDetail,
} = require('../controllers/CompanyController');
const router = express.Router();
const { adminAuth } = require('../middlewares/AuthMiddleware');

router.get('/get-list', adminAuth, getCompanyList);

router.get('/:id', adminAuth, getCompanyDetail);

module.exports = router;
