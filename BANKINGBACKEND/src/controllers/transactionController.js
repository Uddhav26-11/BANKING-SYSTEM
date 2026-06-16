const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const { apiResponse, getPagination } = require('../utils/helpers');

/*
=================================
DEPOSIT
Manager/Employee only
=================================
*/
const deposit = async (req, res, next) => {
  try {
    if (
      !['manager', 'employee'].includes(
        req.user.role
      )
    ) {
      return apiResponse(
        res,
        403,
        'Customers cannot perform deposits.'
      );
    }

    const { accountNumber, amount, description } =
      req.body;

    if (!accountNumber || !amount) {
      return apiResponse(
        res,
        400,
        'Account number and amount are required.'
      );
    }

    const parsedAmount = Number(amount);

    if (
      isNaN(parsedAmount) ||
      parsedAmount <= 0
    ) {
      return apiResponse(
        res,
        400,
        'Amount must be positive.'
      );
    }

    const account = await Account.findOne({
      accountNumber,
      isActive: true,
    });

    if (!account) {
      return apiResponse(
        res,
        404,
        'Account not found.'
      );
    }

    account.balance += parsedAmount;
    await account.save();

    const transaction =
      await Transaction.create({
        type: 'deposit',
        amount: parsedAmount,

        receiverAccountId: account._id,
        receiverAccountNumber:
          account.accountNumber,

        balanceAfterTransaction:
          account.balance,

        description:
          description || 'Deposit',

        status: 'completed',
      });

    return apiResponse(
      res,
      201,
      'Deposit successful.',
      {
        transaction,
        newBalance: account.balance,
      }
    );
  } catch (error) {
    next(error);
  }
};

/*
=================================
WITHDRAW
Manager/Employee only
=================================
*/
const withdraw = async (
  req,
  res,
  next
) => {
  try {
    if (
      !['manager', 'employee'].includes(
        req.user.role
      )
    ) {
      return apiResponse(
        res,
        403,
        'Customers cannot withdraw.'
      );
    }

    const { accountNumber, amount, description } =
      req.body;

    const parsedAmount = Number(amount);

    if (
      !accountNumber ||
      isNaN(parsedAmount) ||
      parsedAmount <= 0
    ) {
      return apiResponse(
        res,
        400,
        'Invalid request.'
      );
    }

    const account = await Account.findOne({
      accountNumber,
      isActive: true,
    });

    if (!account) {
      return apiResponse(
        res,
        404,
        'Account not found.'
      );
    }

    if (account.balance < parsedAmount) {
      return apiResponse(
        res,
        422,
        'Insufficient balance.'
      );
    }

    account.balance -= parsedAmount;

    await account.save();

    const transaction =
      await Transaction.create({
        type: 'withdrawal',
        amount: parsedAmount,

        senderAccountId: account._id,
        senderAccountNumber:
          account.accountNumber,

        balanceAfterTransaction:
          account.balance,

        description:
          description || 'Withdrawal',

        status: 'completed',
      });

    return apiResponse(
      res,
      201,
      'Withdrawal successful.',
      {
        transaction,
        newBalance: account.balance,
      }
    );
  } catch (error) {
    next(error);
  }
};

/*
=================================
TRANSFER
Manager/Employee only
=================================
*/
const transfer = async (
  req,
  res,
  next
) => {
  try {
    if (
      !['manager', 'employee'].includes(
        req.user.role
      )
    ) {
      return apiResponse(
        res,
        403,
        'Customers cannot transfer money.'
      );
    }

    const {
      fromAccountNumber,
      toAccountNumber,
      amount,
      description,
    } = req.body;

    const parsedAmount = Number(amount);

    if (
      !fromAccountNumber ||
      !toAccountNumber ||
      isNaN(parsedAmount) ||
      parsedAmount <= 0
    ) {
      return apiResponse(
        res,
        400,
        'Invalid request.'
      );
    }

    if (
      fromAccountNumber ===
      toAccountNumber
    ) {
      return apiResponse(
        res,
        400,
        'Cannot transfer to same account.'
      );
    }

    const sender =
      await Account.findOne({
        accountNumber:
          fromAccountNumber,
        isActive: true,
      });

    const receiver =
      await Account.findOne({
        accountNumber:
          toAccountNumber,
        isActive: true,
      });

    if (!sender || !receiver) {
      return apiResponse(
        res,
        404,
        'Account not found.'
      );
    }

    if (
      sender.balance < parsedAmount
    ) {
      return apiResponse(
        res,
        422,
        'Insufficient balance.'
      );
    }

    sender.balance -= parsedAmount;
    receiver.balance += parsedAmount;

    await sender.save();
    await receiver.save();

    const transaction =
      await Transaction.create({
        type: 'transfer',
        amount: parsedAmount,

        senderAccountId:
          sender._id,
        senderAccountNumber:
          sender.accountNumber,

        receiverAccountId:
          receiver._id,
        receiverAccountNumber:
          receiver.accountNumber,

        balanceAfterTransaction:
          sender.balance,

        description:
          description || 'Transfer',

        status: 'completed',
      });

    return apiResponse(
      res,
      201,
      'Transfer successful.',
      {
        transaction,
        senderBalance:
          sender.balance,
      }
    );
  } catch (error) {
    next(error);
  }
};

/*
=================================
MY TRANSACTIONS
Customer -> Own
Employee/Manager -> All
=================================
*/
const getMyTransactions = async (
  req,
  res,
  next
) => {
  try {
    let filter = {};

    if (req.user.role === 'customer') {
      const accounts =
        await Account.find({
          userId: req.user._id,
        }).select('_id');

      const ids = accounts.map(
        (a) => a._id
      );

      filter = {
        $or: [
          {
            senderAccountId: {
              $in: ids,
            },
          },
          {
            receiverAccountId: {
              $in: ids,
            },
          },
        ],
      };
    }

    const {
      page,
      limit,
      skip,
    } = getPagination(req.query);

    const [transactions, total] =
      await Promise.all([
        Transaction.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),

        Transaction.countDocuments(
          filter
        ),
      ]);

    return apiResponse(
      res,
      200,
      'Transactions retrieved.',
      {
        transactions,
      },
      {
        page,
        limit,
        total,
        totalPages: Math.ceil(
          total / limit
        ),
      }
    );
  } catch (error) {
    next(error);
  }
};

/*
=================================
TRANSACTION BY ID
=================================
*/
const getTransactionById =
  async (req, res, next) => {
    try {
      const transaction =
        await Transaction.findById(
          req.params.id
        );

      if (!transaction) {
        return apiResponse(
          res,
          404,
          'Transaction not found.'
        );
      }

      return apiResponse(
        res,
        200,
        'Transaction retrieved.',
        { transaction }
      );
    } catch (error) {
      next(error);
    }
  };

/*
=================================
ALL TRANSACTIONS
Manager only
=================================
*/
const getAllTransactions =
  async (req, res, next) => {
    try {
      if (
        req.user.role !== 'manager'
      ) {
        return apiResponse(
          res,
          403,
          'Access denied.'
        );
      }

      const transactions =
        await Transaction.find().sort({
          createdAt: -1,
        });

      return apiResponse(
        res,
        200,
        'All transactions retrieved.',
        { transactions }
      );
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  deposit,
  withdraw,
  transfer,
  getMyTransactions,
  getTransactionById,
  getAllTransactions,
};