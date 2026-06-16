import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const hideBackButton = [
    "/manager",
    "/employee",
    "/customer",
  ].includes(location.pathname);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1>BANDHAN BANK</h1>

        <p>Aapka Bharosa, Hamara Vaada</p>
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            {/* MANAGER */}
            {user.role === "manager" && (
              <>
                <Link to="/manager">
                  Dashboard
                </Link>

                <Link to="/manager/employees">
                  Employees
                </Link>

                <Link to="/manager/customers">
                  Customers
                </Link>

                <Link to="/manager/bank-summary">
                  Bank Summary
                </Link>
              </>
            )}

            {/* EMPLOYEE */}
            {user.role === "employee" && (
              <>
                <Link to="/employee">
                  Dashboard
                </Link>

                <Link to="/employee/customers">
                  Customers
                </Link>

                <Link to="/employee/profile">
                  Profile
                </Link>
              </>
            )}

            {/* CUSTOMER */}
            {user.role === "customer" && (
              <>
                <Link to="/customer">
                  Dashboard
                </Link>

                <Link to="/customer/accounts">
                  Accounts
                </Link>

                <Link to="/customer/transactions">
                  Transactions
                </Link>

                <Link to="/customer/profile">
                  Profile
                </Link>
              </>
            )}

            {!hideBackButton && (
              <button
                className="btn"
                onClick={handleBack}
              >
                ← Back
              </button>
            )}

            <button
              className="btn btn-danger"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <span className="secure-text">
            🔒 Secure Banking
          </span>
        )}
      </div>
    </nav>
  );
}