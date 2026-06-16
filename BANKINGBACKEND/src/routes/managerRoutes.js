const express = require('express');
const router = express.Router();

const {
  createEmployee,
  createCustomer,
  getEmployees,
  getCustomers,
  getSummary,
} = require('../controllers/managerController');

const {
  protect,
  authorize,
} = require('../middleware/auth');

/*
=================================
All Manager Routes Protected
=================================
*/

router.use(protect);
router.use(authorize('manager'));

/*
=================================
EMPLOYEES
=================================
*/

// Create Employee
router.post(
  '/create-employee',
  createEmployee
);

// Get Employees
router.get(
  '/employees',
  getEmployees
);

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

/*
=================================
BANK SUMMARY
=================================
*/

router.get(
  '/summary',
  getSummary
);

module.exports = router;