import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function MyAccounts() {
  const [accounts, setAccounts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await API.get(
        "/accounts"
      );

      setAccounts(
        res.data.data.accounts || []
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to load accounts"
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
      <h1>My Accounts</h1>

      <table>
        <thead>
          <tr>
            <th>Account No.</th>
            <th>Type</th>
            <th>Balance</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {accounts.map((acc) => (
            <tr key={acc._id}>
              <td>
                {acc.accountNumber}
              </td>

              <td>
                {acc.accountType}
              </td>

              <td>
                ₹{acc.balance}
              </td>

              <td>
                {acc.isActive
                  ? "Active"
                  : "Inactive"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}