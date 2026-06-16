import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function BankSummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await API.get("/manager/summary");

      setSummary(res.data.data);
    } catch (err) {
      console.log(err);
      alert(
        err.response?.data?.message ||
        "Failed to load summary"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        Loading...
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Bank Summary</h1>

      <div className="dashboard-cards">
        <div className="card">
          <h2>Total Customers</h2>

          <h1>
            {summary?.totalCustomers || 0}
          </h1>
        </div>

        <div className="card">
          <h2>Total Employees</h2>

          <h1>
            {summary?.totalEmployees || 0}
          </h1>
        </div>

        <div className="card">
          <h2>Total Accounts</h2>

          <h1>
            {summary?.totalAccounts || 0}
          </h1>
        </div>

        <div className="card">
          <h2>Total Balance</h2>

          <h1>
            ₹
            {summary?.totalBalance || 0}
          </h1>
        </div>
      </div>
    </div>
  );
}