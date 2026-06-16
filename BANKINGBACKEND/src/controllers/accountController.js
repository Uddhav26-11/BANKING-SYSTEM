const Account = require('../models/Account');
const User = require('../models/User');
const { apiResponse } = require('../utils/helpers');

/*
=================================
GET MY ACCOUNTS
GET /api/accounts
=================================
Customer -> apne accounts
Manager/Employee -> sab customer accounts
*/
const getMyAccounts = async (req, res, next) => {
  try {
    let accounts;

    if (req.user.role === 'customer') {
      accounts = await Account.find({
        userId: req.user._id,
      }).sort({ createdAt: -1 });
    } else {
      accounts = await Account.find()
        .populate(
          'userId',
          'fullName email aadhaarNumber'
        )
        .sort({ createdAt: -1 });
    }

    return apiResponse(
      res,
      200,
      'Accounts retrieved.',
      { accounts }
    );
  } catch (error) {
    next(error);
  }
};

/*
=================================
GET ACCOUNT BY NUMBER
GET /api/accounts/:accountNumber
=================================
*/
const getAccountByNumber = async (
  req,
  res,
  next
) => {
  try {
    let query = {
      accountNumber: req.params.accountNumber,
    };

    if (req.user.role === 'customer') {
      query.userId = req.user._id;
    }

    const account = await Account.findOne(
      query
    ).populate(
      'userId',
      'fullName email aadhaarNumber'
    );

    if (!account) {
      return apiResponse(
        res,
        404,
        'Account not found.'
      );
    }

    return apiResponse(
      res,
      200,
      'Account retrieved.',
      { account }
    );
  } catch (error) {
    next(error);
  }
};

/*
=================================
CREATE ACCOUNT
DISABLED
=================================
Only customer creation workflow
creates accounts.
*/
const createAccount = async (
  req,
  res
) => {
  return apiResponse(
    res,
    403,
    'Accounts can only be created while creating a customer.'
  );
};

/*
=================================
GET BALANCE
GET /api/accounts/:accountNumber/balance
=================================
*/
const getBalance = async (
  req,
  res,
  next
) => {
  try {
    let query = {
      accountNumber: req.params.accountNumber,
    };

    if (req.user.role === 'customer') {
      query.userId = req.user._id;
    }

    const account = await Account.findOne(
      query
    );

    if (!account) {
      return apiResponse(
        res,
        404,
        'Account not found.'
      );
    }

    return apiResponse(
      res,
      200,
      'Balance retrieved.',
      {
        accountNumber:
          account.accountNumber,
        balance: account.balance,
        currency: account.currency,
        accountType:
          account.accountType,
        isActive: account.isActive,
      }
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyAccounts,
  getAccountByNumber,
  createAccount,
  getBalance,
};