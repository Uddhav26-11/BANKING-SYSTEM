import { useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function Withdraw() {
  const [form, setForm] = useState({
    accountNumber: "",
    amount: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post(
        "/transactions/withdraw",
        {
          ...form,
          amount: Number(form.amount),
        }
      );

      toast.success(
        `${res.data.message}\nNew Balance: ₹${res.data.data.newBalance}`
      );

      setForm({
        accountNumber: "",
        amount: "",
        description: "",
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Withdrawal failed"
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Withdraw Money</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="accountNumber"
            placeholder="Account Number"
            value={form.accountNumber}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            required
          />

          <input
            name="description"
            placeholder="Description (Optional)"
            value={form.description}
            onChange={handleChange}
          />

          <button type="submit">
            Withdraw
          </button>
        </form>
      </div>
    </div>
  );
}