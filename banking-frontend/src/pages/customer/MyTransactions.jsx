import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function MyTransactions() {
  const [transactions, setTransactions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await API.get(
        "/transactions"
      );

      setTransactions(
        res.data.data.transactions || []
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to load transactions"
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
      <h1>My Transactions</h1>

      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((txn) => (
            <tr key={txn._id}>
              <td>{txn.type}</td>

              <td>
                ₹{txn.amount}
              </td>

              <td>
                {txn.status}
              </td>

              <td>
                {new Date(
                  txn.createdAt
                ).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}