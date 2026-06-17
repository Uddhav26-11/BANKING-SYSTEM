import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({
  isOpen,
  setIsOpen,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const links = {
    manager: [
      { path: "/manager", icon: "📊", label: "Dashboard" },
      { path: "/manager/bank-summary", icon: "🏦", label: "Bank Summary" },
      { path: "/manager/employees", icon: "👨‍💼", label: "Employees" },
      { path: "/manager/customers", icon: "👥", label: "Customers" },
      { path: "/manager/create-employee", icon: "➕", label: "Create Employee" },
      { path: "/manager/create-customer", icon: "🧑", label: "Create Customer" },
    ],

    employee: [
      { path: "/employee", icon: "📊", label: "Dashboard" },
      { path: "/employee/customers", icon: "👥", label: "Customers" },
      { path: "/employee/create-customer", icon: "➕", label: "Create Customer" },
      { path: "/employee/profile", icon: "👤", label: "Profile" },
    ],

    customer: [
      { path: "/customer", icon: "📊", label: "Dashboard" },
      { path: "/customer/accounts", icon: "🏦", label: "Accounts" },
      { path: "/customer/transactions", icon: "📜", label: "Transactions" },
      { path: "/customer/profile", icon: "👤", label: "Profile" },
    ],
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${
          isOpen ? "show" : ""
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`sidebar ${
          isOpen ? "open" : ""
        }`}
      >
        <div className="sidebar-header">
          <h2>🏦 BANDHAN BANK</h2>
        </div>

        <div className="sidebar-links">
          {links[user?.role]?.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
              onClick={() => setIsOpen(false)}
            >
              <span>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </div>

        <button
          className="sidebar-logout"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>
      </aside>
    </>
  );
}