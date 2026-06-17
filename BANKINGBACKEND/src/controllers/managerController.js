const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const { apiResponse } = require('../utils/helpers');

/*
=================================
CREATE EMPLOYEE
POST /api/manager/create-employee
=================================
*/
const createEmployee = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      password,
      photo,
    } = req.body;

    if (!fullName || !email || !password) {
      return apiResponse(
        res,
        400,
        'Full name, email and password are required.'
      );
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return apiResponse(
        res,
        409,
        'Employee already exists.'
      );
    }

    const employee = await User.create({
      fullName,
      email,
      password,
      role: 'employee',
      photo: photo || '',
      createdBy: req.user._id,
    });

    return apiResponse(
      res,
      201,
      'Employee created successfully.',
      { employee }
    );
  } catch (error) {
    next(error);
  }
};

/*
=================================
UPDATE EMPLOYEE
PUT /api/manager/employees/:id
=================================
*/
const updateEmployee = async (
  req,
  res,
  next
) => {
  try {
    const { fullName, email } =
      req.body;

    const employee =
      await User.findOne({
        _id: req.params.id,
        role: 'employee',
      });

    if (!employee) {
      return apiResponse(
        res,
        404,
        'Employee not found.'
      );
    }

    employee.fullName =
      fullName || employee.fullName;

    employee.email =
      email || employee.email;

    await employee.save();

    return apiResponse(
      res,
      200,
      'Employee updated successfully.',
      { employee }
    );
  } catch (error) {
    next(error);
  }
};

/*
=================================
ACTIVATE / DEACTIVATE EMPLOYEE
PATCH /api/manager/employees/:id/status
=================================
*/
const toggleEmployeeStatus =
  async (req, res, next) => {
    try {
      const employee =
        await User.findOne({
          _id: req.params.id,
          role: 'employee',
        });

      if (!employee) {
        return apiResponse(
          res,
          404,
          'Employee not found.'
        );
      }

      employee.isActive =
        !employee.isActive;

      await employee.save();

      return apiResponse(
        res,
        200,
        `Employee ${
          employee.isActive
            ? 'activated'
            : 'deactivated'
        } successfully.`,
        { employee }
      );
    } catch (error) {
      next(error);
    }
  };

/*
=================================
CREATE CUSTOMER
POST /api/manager/create-customer
=================================
*/
const createCustomer = async (
  req,
  res,
  next
) => {
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

    const existingEmail =
      await User.findOne({
        email: email.toLowerCase(),
      });

    if (existingEmail) {
      return apiResponse(
        res,
        409,
        'Customer already exists.'
      );
    }

    const existingAadhaar =
      await User.findOne({
        aadhaarNumber,
      });

    if (existingAadhaar) {
      return apiResponse(
        res,
        409,
        'Aadhaar already registered.'
      );
    }

    const customer =
      await User.create({
        fullName,
        email,
        password,
        aadhaarNumber,
        role: 'customer',
        photo: photo || '',
        createdBy: req.user._id,
      });

    const account =
      await Account.create({
        userId: customer._id,
        accountType:
          accountType || 'savings',
        currency: 'INR',
        balance: 0,
      });

    const depositAmount =
      Number(initialDeposit) || 0;

    if (depositAmount > 0) {
      account.balance =
        depositAmount;

      await account.save();

      await Transaction.create({
        type: 'deposit',
        amount: depositAmount,
        receiverAccountId:
          account._id,
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
UPDATE CUSTOMER
PUT /api/manager/customers/:id
=================================
*/
const updateCustomer =
  async (req, res, next) => {
    try {
      const {
        fullName,
        email,
        aadhaarNumber,
      } = req.body;

      const customer =
        await User.findOne({
          _id: req.params.id,
          role: 'customer',
        });

      if (!customer) {
        return apiResponse(
          res,
          404,
          'Customer not found.'
        );
      }

      customer.fullName =
        fullName ||
        customer.fullName;

      customer.email =
        email || customer.email;

      customer.aadhaarNumber =
        aadhaarNumber ||
        customer.aadhaarNumber;

      await customer.save();

      return apiResponse(
        res,
        200,
        'Customer updated successfully.',
        { customer }
      );
    } catch (error) {
      next(error);
    }
  };

/*
=================================
ACTIVATE / DEACTIVATE CUSTOMER
PATCH /api/manager/customers/:id/status
=================================
*/
const toggleCustomerStatus =
  async (req, res, next) => {
    try {
      const customer =
        await User.findOne({
          _id: req.params.id,
          role: 'customer',
        });

      if (!customer) {
        return apiResponse(
          res,
          404,
          'Customer not found.'
        );
      }

      customer.isActive =
        !customer.isActive;

      await customer.save();

      return apiResponse(
        res,
        200,
        `Customer ${
          customer.isActive
            ? 'activated'
            : 'deactivated'
        } successfully.`,
        { customer }
      );
    } catch (error) {
      next(error);
    }
  };

/*
=================================
GET EMPLOYEES
=================================
*/
const getEmployees = async (
  req,
  res,
  next
) => {
  try {
    const employees =
      await User.find({
        role: 'employee',
      })
        .select('-password')
        .sort({ createdAt: -1 });

    return apiResponse(
      res,
      200,
      'Employees retrieved.',
      { employees }
    );
  } catch (error) {
    next(error);
  }
};

/*
=================================
GET CUSTOMERS
=================================
*/
const getCustomers = async (
  req,
  res,
  next
) => {
  try {
    const customers =
      await User.find({
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
      { customers }
    );
  } catch (error) {
    next(error);
  }
};

/*
=================================
BANK SUMMARY
=================================
*/
const getSummary = async (
  req,
  res,
  next
) => {
  try {
    const totalCustomers =
      await User.countDocuments({
        role: 'customer',
      });

    const totalEmployees =
      await User.countDocuments({
        role: 'employee',
      });

    const totalAccounts =
      await Account.countDocuments();

    const totalTransactions =
      await Transaction.countDocuments();

    const accounts =
      await Account.find().select(
        'balance'
      );

    const totalBalance =
      accounts.reduce(
        (sum, acc) =>
          sum + acc.balance,
        0
      );

    return apiResponse(
      res,
      200,
      'Bank summary retrieved.',
      {
        totalCustomers,
        totalEmployees,
        totalAccounts,
        totalTransactions,
        totalBalance,
      }
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEmployee,
  updateEmployee,
  toggleEmployeeStatus,

  createCustomer,
  updateCustomer,
  toggleCustomerStatus,

  getEmployees,
  getCustomers,
  getSummary,
};