import { Toaster } from "react-hot-toast";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/RoleRoute";

import RoleSelection from "./pages/RoleSelection";
import Login from "./pages/Login";

/* MANAGER */
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import Employees from "./pages/manager/Employees";
import Customers from "./pages/manager/Customers";
import CreateEmployee from "./pages/manager/CreateEmployee";
import CreateCustomer from "./pages/manager/CreateCustomer";
import BankSummary from "./pages/manager/BankSummary";

/* EMPLOYEE */
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import CustomerList from "./pages/employee/CustomerList";
import EmployeeCreateCustomer from "./pages/employee/CreateCustomer";
import EmployeeProfile from "./pages/employee/EmployeeProfile";

/* CUSTOMER */
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import MyAccounts from "./pages/customer/MyAccounts";
import MyTransactions from "./pages/customer/MyTransactions";
import CustomerProfile from "./pages/customer/CustomerProfile";

/* TRANSACTIONS */
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />

        <Navbar />

        <Routes>
          {/* PUBLIC */}
          <Route
            path="/"
            element={<RoleSelection />}
          />

          <Route
            path="/login/:role"
            element={<Login />}
          />

          {/* PRIVATE */}
          <Route element={<PrivateRoute />}>

            {/* MANAGER */}
            <Route
              element={
                <RoleRoute
                  allowedRoles={["manager"]}
                />
              }
            >
              <Route
                path="/manager"
                element={<ManagerDashboard />}
              />

              <Route
                path="/manager/employees"
                element={<Employees />}
              />

              <Route
                path="/manager/customers"
                element={<Customers />}
              />

              <Route
                path="/manager/create-employee"
                element={<CreateEmployee />}
              />

              <Route
                path="/manager/create-customer"
                element={<CreateCustomer />}
              />

              <Route
                path="/manager/bank-summary"
                element={<BankSummary />}
              />

              {/* NEW */}
              <Route
                path="/manager/deposit"
                element={<Deposit />}
              />

              <Route
                path="/manager/withdraw"
                element={<Withdraw />}
              />
            </Route>

            {/* EMPLOYEE */}
            <Route
              element={
                <RoleRoute
                  allowedRoles={["employee"]}
                />
              }
            >
              <Route
                path="/employee"
                element={<EmployeeDashboard />}
              />

              <Route
                path="/employee/customers"
                element={<CustomerList />}
              />

              <Route
                path="/employee/create-customer"
                element={<EmployeeCreateCustomer />}
              />

              <Route
                path="/employee/profile"
                element={<EmployeeProfile />}
              />

              {/* NEW */}
              <Route
                path="/employee/deposit"
                element={<Deposit />}
              />

              <Route
                path="/employee/withdraw"
                element={<Withdraw />}
              />
            </Route>

            {/* CUSTOMER */}
            <Route
              element={
                <RoleRoute
                  allowedRoles={["customer"]}
                />
              }
            >
              <Route
                path="/customer"
                element={<CustomerDashboard />}
              />

              <Route
                path="/customer/accounts"
                element={<MyAccounts />}
              />

              <Route
                path="/customer/transactions"
                element={<MyTransactions />}
              />

              <Route
                path="/customer/profile"
                element={<CustomerProfile />}
              />
            </Route>
          </Route>

          {/* FALLBACK */}
          <Route
            path="*"
            element={<Navigate to="/" />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}