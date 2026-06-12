import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Transactions() {
  const [txns, setTxns] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await API.get("/transactions");

        setTxns(
          res.data.data.transactions ||
          res.data.data ||
          []
        );
      } catch (err) {
        setMsg(
          err.response?.data?.message ||
          "Failed to load transactions"
        );
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="page">
      <h2>Transaction History</h2>

      {msg && <p>{msg}</p>}

      {txns.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        txns.map((t) => (
          <div key={t._id} className="card">
            <p>
              <strong>
                {t.type?.toUpperCase()}
              </strong>{" "}
              — ₹{t.amount}
            </p>

            <p>
              {new Date(
                t.createdAt
              ).toLocaleString()}
            </p>

            <p>
              Status: {t.status}
            </p>
          </div>
        ))
      )}
    </div>
  );
}