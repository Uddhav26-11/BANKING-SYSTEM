import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await API.get("/accounts");
        setAccounts(res.data.data.accounts || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Failed to load accounts"
        );
      }
    };

    fetchAccounts();
  }, []);

  return (
    <div className="page">
      <h2>Welcome, {user?.fullName}</h2>

      <h3>Your Accounts</h3>

      {error && <p>{error}</p>}

      {accounts.length === 0 ? (
        <p>No accounts yet.</p>
      ) : (
        accounts.map((acc) => (
          <div key={acc._id} className="card">
            <p>
              <strong>Account No:</strong>{" "}
              {acc.accountNumber}
            </p>

            <p>
              <strong>Type:</strong>{" "}
              {acc.accountType}
            </p>

            <p>
              <strong>Balance:</strong> ₹
              {Number(acc.balance).toFixed(2)}
            </p>

            <p>
              <strong>Currency:</strong>{" "}
              {acc.currency}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {acc.isActive ? "Active" : "Inactive"}
            </p>
          </div>
        ))
      )}
    </div>
  );
}