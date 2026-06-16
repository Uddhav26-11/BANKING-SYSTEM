import { useState } from "react";
import API from "../api/axios";

export default function Deposit() {
  const [form, setForm] =
    useState({
      accountNumber: "",
      amount: "",
      description: "",
    });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post(
        "/transactions/deposit",
        {
          ...form,
          amount: Number(
            form.amount
          ),
        }
      );

      alert(res.data.message);

      setForm({
        accountNumber: "",
        amount: "",
        description: "",
      });
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Deposit failed"
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Deposit</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="accountNumber"
            placeholder="Account Number"
            value={
              form.accountNumber
            }
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
            placeholder="Description"
            value={
              form.description
            }
            onChange={handleChange}
          />

          <button type="submit">
            Deposit
          </button>
        </form>
      </div>
    </div>
  );
}