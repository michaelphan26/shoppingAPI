const mongoose = require('mongoose');
const { Company } = require('../database/CompanyModel');
const { errorResponse, successResponse } = require('../models/ResponseAPI');
const { validateCompany } = require('../validators/CompanyValidator');
const { IOProductDetail } = require('../database/IOProductDetailModel');
const { checkID } = require('./CommonController');

async function getCompanyList(req, res, next) {
  const companyList = await Company.find({});

  if (!companyList) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Cannot get company list'));
  } else if (companyList.length === 0) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Company list is empty'));
  }

  return res
    .status(200)
    .json(successResponse(res.statusCode, 'Ok', companyList));
}

async function addCompany(req, res, next) {
  const validateResult = validateCompany(req.body);
  if (validateResult.error) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, validateResult.error.message));
  }

  reg = new RegExp(`^${req.body.name.trim()}$`, 'i');
  const nameCheck = await Company.findOne({ name: reg });
  if (nameCheck) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Company name existed'));
  }

  const dbCompany = new Company({
    name: req.body.name.trim(),
    phone: req.body.phone.trim(),
    address: req.body.address.trim(),
    tax_number: req.body.tax_number.trim(),
  });

  const result = await dbCompany.save();
  if (!result) {
    return res
      .status(500)
      .json(errorResponse(res.statusCode, 'Cannot add company'));
  }

  return res.status(200).json(successResponse(res.statusCode, 'Ok', dbCompany));
}

async function editCompany(req, res, next) {
  const id = await checkID(req.params.id);
  if (!id) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid company id'));
  }

  const validateResult = validateCompany(req.body);
  if (validateResult.error) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, validateResult.error.message));
  }

  reg = new RegExp(`^${req.body.name.trim()}$`, 'i');
  const nameCheck = await Company.findOne({ name: reg });
  if (nameCheck) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Company name existed'));
  }

  const result = await Company.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        name: req.body.name.trim(),
        phone: req.body.phone.trim(),
        address: req.body.address.trim(),
        tax_number: req.body.tax_number.trim(),
      },
    },
    { new: true }
  );

  if (!result) {
    return res
      .status(500)
      .json(
        errorResponse(
          res.statusCode,
          'Cannot edit company or company not exist'
        )
      );
  }

  return res.status(200).json(successResponse(res.statusCode, 'Ok', result));
}

async function deleteCompany(req, res, next) {
  const id = await checkID(req.params.id);
  if (!id) {
    return res
      .status(404)
      .json(errorResponse(res.statusCode, 'Invalid company id'));
  }

  const dbCheck = await IOProductDetail.findOne({ id_company: id });
  if (dbCheck) {
    return res
      .status(400)
      .json(errorResponse(res.statusCode, 'Cannot delete this company'));
  }

  const result = await Company.findOneAndDelete({ _id: id });
  if (!result) {
    return res
      .status(500)
      .json(errorResponse(res.statusCode, 'Cannot delete this company'));
  }

  return res.status(200).json(successResponse(res.statusCode, 'Ok'));
}

module.exports = { getCompanyList, addCompany, editCompany, deleteCompany };
