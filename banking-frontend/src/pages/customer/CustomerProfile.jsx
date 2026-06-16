import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function CustomerProfile() {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const [profileRes, accountRes, txnRes] =
        await Promise.all([
          API.get("/auth/me"),
          API.get("/accounts"),
          API.get("/transactions"),
        ]);

      const profileUser =
        profileRes.data.data.user;

      setUser(profileUser);

      const accounts =
        accountRes.data.data.accounts || [];

      const totalBalance = accounts.reduce(
        (sum, acc) =>
          sum + Number(acc.balance || 0),
        0
      );

      setBalance(totalBalance);

      setTransactions(
        (txnRes.data.data.transactions || []).slice(
          0,
          5
        )
      );
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to load profile"
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
      <h1>My Profile</h1>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Customer Name</h3>

          <p>{user?.fullName}</p>

          <br />

          <h3>Email</h3>

          <p>{user?.email}</p>
        </div>

        <div className="card">
          <h3>Available Balance</h3>

          <h1>₹{balance}</h1>
        </div>
      </div>

      <h2 style={{ marginTop: "30px" }}>
        Recent Transactions
      </h2>

      {transactions.length > 0 ? (
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
                <td>
                  {txn.type}
                </td>

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
      ) : (
        <div className="card">
          <p>
            No transactions found.
          </p>
        </div>
      )}
    </div>
  );
}