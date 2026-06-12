import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await API.get("/accounts");
        setAccounts(res.data.data.accounts || []);
      } catch (err) {
        setMsg(
          err.response?.data?.message || "Failed to load accounts."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <h2>My Accounts</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>My Accounts</h2>

      {msg && <p>{msg}</p>}

      {!accounts.length ? (
        <p>No accounts found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Account Number</th>
              <th>Type</th>
              <th>Balance</th>
              <th>Currency</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {accounts.map((account) => (
              <tr key={account._id}>
                <td>{account.accountNumber}</td>
                <td>{account.accountType}</td>
                <td>
                  ₹{Number(account.balance).toLocaleString()}
                </td>
                <td>{account.currency}</td>
                <td>
                  {account.isActive ? "Active" : "Inactive"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}