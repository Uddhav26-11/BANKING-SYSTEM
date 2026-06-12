import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null; // Hide navbar on login/register pages

  return (
    <nav className="navbar">
      <span className="brand">BANDHAN BANK</span>
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/accounts">Accounts</Link>
        <Link to="/deposit">Deposit</Link>
        <Link to="/withdraw">Withdraw</Link>
        <Link to="/transfer">Transfer</Link>
        <Link to="/transactions">History</Link>
        <Link to="/profile">Profile</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}