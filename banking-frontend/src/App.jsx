import { Toaster } from "react-hot-toast";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/RoleRoute";
import Layout from "./components/Layout";

import RoleSelection from "./pages/RoleSelection";
import Login from "./pages/Login";
import VerifyOTP from "./pages/VerifyOTP";

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

          <Route
            path="/verify-otp"
            element={<VerifyOTP />}
          />

          {/* MANAGER */}
          <Route
            path="/manager"
            element={
              <PrivateRoute>
                <RoleRoute
                  allowedRoles={["manager"]}
                >
                  <Layout>
                    <ManagerDashboard />
                  </Layout>
                </RoleRoute>
              </PrivateRoute>
            }
          />

          <Route
            path="/manager/employees"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["manager"]}>
                  <Layout>
                    <Employees />
                  </Layout>
                </RoleRoute>
              </PrivateRoute>
            }
          />

          <Route
            path="/manager/customers"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["manager"]}>
                  <Layout>
                    <Customers />
                  </Layout>
                </RoleRoute>
              </PrivateRoute>
            }
          />

          <Route
            path="/manager/create-employee"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["manager"]}>
                  <Layout>
                    <CreateEmployee />
                  </Layout>
                </RoleRoute>
              </PrivateRoute>
            }
          />

          <Route
            path="/manager/create-customer"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["manager"]}>
                  <Layout>
                    <CreateCustomer />
                  </Layout>
                </RoleRoute>
              </PrivateRoute>
            }
          />

          <Route
            path="/manager/bank-summary"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["manager"]}>
                  <Layout>
                    <BankSummary />
                  </Layout>
                </RoleRoute>
              </PrivateRoute>
            }
          />

          {/* EMPLOYEE */}
          <Route
            path="/employee"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["employee"]}>
                  <Layout>
                    <EmployeeDashboard />
                  </Layout>
                </RoleRoute>
              </PrivateRoute>
            }
          />

          <Route
            path="/employee/customers"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["employee"]}>
                  <Layout>
                    <CustomerList />
                  </Layout>
                </RoleRoute>
              </PrivateRoute>
            }
          />

          <Route
            path="/employee/create-customer"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["employee"]}>
                  <Layout>
                    <EmployeeCreateCustomer />
                  </Layout>
                </RoleRoute>
              </PrivateRoute>
            }
          />

          <Route
            path="/employee/profile"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["employee"]}>
                  <Layout>
                    <EmployeeProfile />
                  </Layout>
                </RoleRoute>
              </PrivateRoute>
            }
          />

          {/* CUSTOMER */}
          <Route
            path="/customer"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["customer"]}>
                  <Layout>
                    <CustomerDashboard />
                  </Layout>
                </RoleRoute>
              </PrivateRoute>
            }
          />

          <Route
            path="/customer/accounts"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["customer"]}>
                  <Layout>
                    <MyAccounts />
                  </Layout>
                </RoleRoute>
              </PrivateRoute>
            }
          />

          <Route
            path="/customer/transactions"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["customer"]}>
                  <Layout>
                    <MyTransactions />
                  </Layout>
                </RoleRoute>
              </PrivateRoute>
            }
          />

          <Route
            path="/customer/profile"
            element={
              <PrivateRoute>
                <RoleRoute allowedRoles={["customer"]}>
                  <Layout>
                    <CustomerProfile />
                  </Layout>
                </RoleRoute>
              </PrivateRoute>
            }
          />

          {/* TRANSACTIONS */}
          <Route
            path="/deposit"
            element={
              <PrivateRoute>
                <Deposit />
              </PrivateRoute>
            }
          />

          <Route
            path="/withdraw"
            element={
              <PrivateRoute>
                <Withdraw />
              </PrivateRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={<Navigate to="/" />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}