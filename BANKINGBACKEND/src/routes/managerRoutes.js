console.log("🔥 MANAGER ROUTES LOADED");
const express = require('express');
const router = express.Router();

const {
  createEmployee,
  updateEmployee,
  toggleEmployeeStatus,

  createCustomer,
  updateCustomer,
  toggleCustomerStatus,

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

// Update Employee
router.put(
  '/employees/:id',
  updateEmployee
);

// Activate / Deactivate Employee
router.patch(
  '/employees/:id/status',
  toggleEmployeeStatus
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

// Update Customer
router.put(
  '/customers/:id',
  updateCustomer
);

// Activate / Deactivate Customer
router.patch(
  '/customers/:id/status',
  toggleCustomerStatus
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