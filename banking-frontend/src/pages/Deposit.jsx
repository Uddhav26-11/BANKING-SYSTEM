import { useState, useEffect } from "react";
import API from "../api/axios";

export default function Deposit() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    accountNumber: "",
    amount: "",
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await API.get("/accounts");
        setAccounts(res.data.data.accounts || []);
      } catch (err) {
        setMsg(
          err.response?.data?.message ||
          "Failed to load accounts"
        );
      }
    };

    fetchAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/transactions/deposit", {
        accountNumber: form.accountNumber,
        amount: Number(form.amount),
      });

      setMsg("Deposit successful!");

      setForm({
        accountNumber: "",
        amount: "",
      });
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="page">
      <h2>Deposit Money</h2>

      {msg && <p>{msg}</p>}

      <form onSubmit={handleSubmit}>
        <select
          value={form.accountNumber}
          onChange={(e) =>
            setForm({
              ...form,
              accountNumber: e.target.value,
            })
          }
          required
        >
          <option value="">Select Account</option>

          {accounts.map((a) => (
            <option
              key={a._id}
              value={a.accountNumber}
            >
              {a.accountNumber} — ₹{a.balance}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) =>
            setForm({
              ...form,
              amount: e.target.value,
            })
          }
          required
        />

        <button type="submit">
          Deposit
        </button>
      </form>
    </div>
  );
}