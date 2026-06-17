import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Navbar({
  toggleSidebar,
}) {
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

        {user && (
          <button
            className="menu-toggle"
            onClick={toggleSidebar}
          >
            ☰
          </button>
        )}

        <div>
          {user ? (
            <>
              <h1>Welcome</h1>

              <p>
                Manage your banking operations securely
              </p>
            </>
          ) : (
            <>
              <h1>BANDHAN BANK</h1>

              <p>
                Aapka Bharosa, Hamara Vaada
              </p>
            </>
          )}
        </div>
      </div>

      <div className="navbar-right">
        {user ? (
          <>
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