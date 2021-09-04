const mongoose = require('mongoose');
const { Category } = require('../database/CategoryModel');
const { Product } = require('../database/ProductModel');
const { Receipt } = require('../database/ReceiptModel');
const { ReceiptType } = require('../database/ReceiptTypeModel');
const { Role } = require('../database/RoleModel');
const { User } = require('../database/UserModel');
const { IOProduct } = require('../database/IOProductModel');
const { IOType } = require('../database/IOTypeModel');
const { Company } = require('../database/CompanyModel');
const { successResponse, errorResponse } = require('../models/ResponseAPI');

async function checkID(id) {
  try {
    id = new mongoose.Types.ObjectId(id.trim());
    return id;
  } catch (err) {
    return null;
  }
}

async function getSummary(req, res) {
  try {
    const categoryNum = await Category.countDocuments({}).catch((err) => {
      throw new Error();
    });
    const productNum = await Product.countDocuments({}).catch((err) => {
      throw new Error();
    });
    const receiptNum = await Receipt.countDocuments({}).catch((err) => {
      throw new Error();
    });
    const receiptTypeNum = await ReceiptType.countDocuments({}).catch((err) => {
      throw new Error();
    });
    const accountNum = await User.countDocuments({}).catch((err) => {
      throw new Error();
    });
    const roleNum = await Role.countDocuments({}).catch((err) => {
      throw new Error();
    });
    const ioNum = await IOProduct.countDocuments({}).catch((err) => {
      throw new Error();
    });
    const ioTypeNum = await IOType.countDocuments({}).catch((err) => {
      throw new Error();
    });
    const companyNum = await Company.countDocuments({}).catch((err) => {
      throw new Error();
    });

    const summaryList = [
      {
        id: 'adminCategory',
        title: 'Danh mục SP',
        count: categoryNum,
      },
      {
        id: 'adminProduct',
        title: 'Sản phẩm',
        count: productNum,
      },
      {
        id: 'adminReceipt',
        title: 'Hóa đơn',
        count: receiptNum,
      },
      {
        id: 'adminReceiptType',
        title: 'Loại hóa đơn',
        count: receiptTypeNum,
      },
      {
        id: 'adminAccount',
        title: 'Tài khoản',
        count: accountNum,
      },
      {
        id: 'adminRole',
        title: 'Chức vụ',
        count: roleNum,
      },
      {
        id: 'adminIOProduct',
        title: 'Nhập xuất',
        count: ioNum,
      },
      {
        id: 'adminIOType',
        title: 'Loại nhập xuất',
        count: ioTypeNum,
      },
      {
        id: 'adminCompany',
        title: 'Đối tác',
        count: companyNum,
      },
    ];

    return res
      .status(200)
      .json(successResponse(res.statusCode, 'Ok', summaryList));
  } catch (err) {
    return res
      .status(500)
      .json(errorResponse(res.statusCode, 'Cannot get summary'));
  }
}

module.exports = { checkID, getSummary };
