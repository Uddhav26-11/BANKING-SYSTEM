const express = require('express');
const router = express.Router();

const {
  deposit,
  withdraw,
  transfer,
  getMyTransactions,
  getTransactionById,
  getAllTransactions,
} = require('../controllers/transactionController');

const { protect, authorize } = require('../middleware/auth');
const { transactionLimiter } = require('../middleware/ratelimiter');

/*
=================================
All routes require authentication
=================================
*/
router.use(protect);

/*
=================================
MANAGER / EMPLOYEE
=================================
*/

// Deposit
router.post(
  '/deposit',
  authorize('manager', 'employee'),
  transactionLimiter,
  deposit
);

// Withdraw
router.post(
  '/withdraw',
  authorize('manager', 'employee'),
  transactionLimiter,
  withdraw
);

// Transfer
router.post(
  '/transfer',
  authorize('manager', 'employee'),
  transactionLimiter,
  transfer
);

/*
=================================
ALL LOGGED IN USERS
=================================
*/

// Customer → own transactions
// Employee → own transactions
// Manager → own transactions
router.get('/', getMyTransactions);

// Transaction details
router.get('/:id', getTransactionById);

/*
=================================
MANAGER ONLY
=================================
*/

// View all bank transactions
router.get(
  '/manager/all',
  authorize('manager'),
  getAllTransactions
);

module.exports = router;