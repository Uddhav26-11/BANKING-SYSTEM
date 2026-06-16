import { Link } from "react-router-dom";

export default function EmployeeDashboard() {
  return (
    <div className="page-container">
      <h1>👨‍💼Employee Dashboard</h1>

      <div className="dashboard-cards">

        <Link
          to="/employee/create-customer"
          className="card"
        >
          <h2>👤Create Customer</h2>
          <p>Open a new customer account</p>
        </Link>

        <Link
          to="/employee/customers"
          className="card"
        >
          <h2>👥 Customer List</h2>
          <p>View all customers</p>
        </Link>

        <Link
          to="/employee/profile"
          className="card"
        >
          <h2>👨‍💼My Profile</h2>
          <p>View your details</p>
        </Link>

        <Link
          to="/employee/deposit"
          className="card"
        >
          <h2>💰Deposit</h2>
          <p>Deposit money into customer accounts</p>
        </Link>

        <Link
          to="/employee/withdraw"
          className="card"
        >
          <h2>💸 Withdraw</h2>
          <p>Withdraw money from customer accounts</p>
        </Link>

      </div>
    </div>
  );
}