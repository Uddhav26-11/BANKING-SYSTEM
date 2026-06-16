const express = require('express');
const router = express.Router();

const {
  getMyAccounts,
  getAccountByNumber,
  getBalance,
} = require('../controllers/accountController');

const { protect } = require('../middleware/auth');

/*
=================================
All routes require authentication
=================================
*/
router.use(protect);

/*
=================================
CUSTOMER / EMPLOYEE / MANAGER
=================================
*/

// Get logged in user's accounts
router.get('/', getMyAccounts);

// Get account details
router.get('/:accountNumber', getAccountByNumber);

// Get account balance
router.get('/:accountNumber/balance', getBalance);

module.exports = router;