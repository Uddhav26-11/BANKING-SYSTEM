console.log("🚀 SERVER FILE LOADED");

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT:', err.stack);
});

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./src/config/database');

const {
  generalLimiter,
} = require('./src/middleware/ratelimiter');

const {
  errorHandler,
  notFound,
} = require('./src/middleware/errorHandler');

/*
=================================
ROUTES
=================================
*/

const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const accountRoutes = require('./src/routes/accountRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');

const managerRoutes = require('./src/routes/managerRoutes');
const employeeRoutes = require('./src/routes/employeeRoutes');

console.log("🔥 Manager Routes Imported");
console.log("🔥 Employee Routes Imported");

/*
=================================
Connect MongoDB
=================================
*/
connectDB();

const app = express();

/*
=================================
Global Middleware
=================================
*/
app.use(cors());

app.use(
  express.json({
    limit: '10kb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

// app.use(generalLimiter);

/*
=================================
Health Check
=================================
*/
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Banking API is running',
    timestamp: new Date().toISOString(),
    environment:
      process.env.NODE_ENV ||
      'development',
  });
});

/*
=================================
Request Logger
=================================
*/
app.use((req, res, next) => {
  console.log(
    `${req.method} ${req.originalUrl}`
  );

  next();
});

/*
=================================
API ROUTES
=================================
*/

app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

app.use('/api/accounts', accountRoutes);

app.use(
  '/api/transactions',
  transactionRoutes
);

/*
=================================
MANAGER ROUTES
=================================
*/

app.use(
  '/api/manager',
  managerRoutes
);

/*
=================================
EMPLOYEE ROUTES
=================================
*/

app.use(
  '/api/employee',
  employeeRoutes
);

/*
=================================
404
=================================
*/

app.use(notFound);

/*
=================================
Global Error Handler
=================================
*/

app.use(errorHandler);

/*
=================================
Start Server
=================================
*/

const PORT =
  process.env.PORT || 5000;

const server = app.listen(
  PORT,
  () => {
    console.log(
      `🚀 Server running on port ${PORT}`
    );

    console.log(
      `📋 Health Check: http://localhost:${PORT}/health`
    );
  }
);

/*
=================================
Unhandled Promise Rejections
=================================
*/

process.on(
  'unhandledRejection',
  (err) => {
    console.error(
      '❌ Unhandled Error:',
      err.message
    );

    server.close(() =>
      process.exit(1)
    );
  }
);

module.exports = app;