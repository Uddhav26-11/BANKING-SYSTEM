const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const { apiResponse } = require('../utils/helpers');

/*
=================================
CREATE CUSTOMER
POST /api/employee/create-customer
=================================
*/
const createCustomer = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      password,
      aadhaarNumber,
      photo,
      accountType,
      initialDeposit,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !password ||
      !aadhaarNumber
    ) {
      return apiResponse(
        res,
        400,
        'Full name, email, password and Aadhaar are required.'
      );
    }

    const existingEmail = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingEmail) {
      return apiResponse(
        res,
        409,
        'Customer already exists.'
      );
    }

    const existingAadhaar = await User.findOne({
      aadhaarNumber,
    });

    if (existingAadhaar) {
      return apiResponse(
        res,
        409,
        'Aadhaar already registered.'
      );
    }

    const customer = await User.create({
      fullName,
      email,
      password,
      aadhaarNumber,
      role: 'customer',
      photo: photo || '',
      createdBy: req.user._id,
    });

    const account = await Account.create({
      userId: customer._id,
      accountType: accountType || 'savings',
      currency: 'INR',
      balance: 0,
    });

    const depositAmount =
      Number(initialDeposit) || 0;

    if (depositAmount > 0) {
      account.balance = depositAmount;

      await account.save();

      await Transaction.create({
        type: 'deposit',
        amount: depositAmount,

        receiverAccountId: account._id,
        receiverAccountNumber:
          account.accountNumber,

        balanceAfterTransaction:
          account.balance,

        description:
          'Initial account deposit',

        status: 'completed',
      });
    }

    return apiResponse(
      res,
      201,
      'Customer created successfully.',
      {
        customer,
        account,
      }
    );
  } catch (error) {
    next(error);
  }
};

/*
=================================
GET CUSTOMERS
GET /api/employee/customers
=================================
*/
const getCustomers = async (
  req,
  res,
  next
) => {
  try {
    const customers = await User.find({
      role: 'customer',
    })
      .select('-password')
      .populate({
        path: 'accounts',
        select:
          'accountNumber balance accountType isActive',
      })
      .sort({ createdAt: -1 });

    return apiResponse(
      res,
      200,
      'Customers retrieved.',
      {
        customers,
      }
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCustomer,
  getCustomers,
};