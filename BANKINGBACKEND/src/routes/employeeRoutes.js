const express = require('express');
const router = express.Router();

const {
  createCustomer,
  getCustomers,
} = require('../controllers/employeeController');

const {
  protect,
  authorize,
} = require('../middleware/auth');

/*
=================================
All Employee Routes Protected
=================================
*/

router.use(protect);
router.use(authorize('employee'));

/*
=================================
CUSTOMERS
=================================
*/

// Create Customer
router.post(
  '/create-customer',
  createCustomer
);

// Get Customers
router.get(
  '/customers',
  getCustomers
);

module.exports = router;