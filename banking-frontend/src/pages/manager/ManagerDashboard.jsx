import { Link } from "react-router-dom";

export default function ManagerDashboard() {
  return (
    <div className="page-container">
      <h1>Manager Dashboard</h1>

      <p>
        Welcome to Bandhan Bank Manager Panel
      </p>

      <div className="dashboard-cards">

        <Link
          to="/manager/bank-summary"
          className="card"
        >
          <h2>🏦Bank Summary</h2>
          <p>View bank statistics</p>
        </Link>

        <Link
          to="/manager/create-employee"
          className="card"
        >
          <h2>👨‍💼Create Employee</h2>
          <p>Add new employees</p>
        </Link>

        <Link
          to="/manager/create-customer"
          className="card"
        >
          <h2>👤Create Customer</h2>
          <p>Open customer accounts</p>
        </Link>

        <Link
          to="/manager/employees"
          className="card"
        >
          <h2>👥Employees</h2>
          <p>View all employees</p>
        </Link>

        <Link
          to="/manager/customers"
          className="card"
        >
          <h2>🧑‍🤝‍🧑Customers</h2>
          <p>View all customers</p>
        </Link>

        <Link
          to="/manager/deposit"
          className="card"
        >
          <h2>💰Deposit</h2>
          <p>Deposit money into accounts</p>
        </Link>

        <Link
          to="/manager/withdraw"
          className="card"
        >
          <h2>💸Withdraw</h2>
          <p>Withdraw money from accounts</p>
        </Link>

      </div>
    </div>
  );
}