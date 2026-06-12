import { useState } from "react";
import API from "../api/axios";

export default function Transfer() {
  const [form, setForm] = useState({
    fromAccount: "",
    toAccount: "",
    amount: "",
  });

  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/transactions/transfer", {
        fromAccount: form.fromAccount,
        toAccount: form.toAccount,
        amount: Number(form.amount),
      });

      setMsg("Transfer successful!");

      setForm({
        fromAccount: "",
        toAccount: "",
        amount: "",
      });
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="page">
      <h2>Transfer Money</h2>

      {msg && <p>{msg}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="From Account No."
          value={form.fromAccount}
          onChange={(e) =>
            setForm({ ...form, fromAccount: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="To Account No."
          value={form.toAccount}
          onChange={(e) =>
            setForm({ ...form, toAccount: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
        />

        <button type="submit">Transfer</button>
      </form>
    </div>
  );
}