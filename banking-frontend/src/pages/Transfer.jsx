import { useState } from "react";
import API from "../api/axios";

export default function Transfer() {
  const [form, setForm] =
    useState({
      fromAccountNumber: "",
      toAccountNumber: "",
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
        "/transactions/transfer",
        {
          ...form,
          amount: Number(
            form.amount
          ),
        }
      );

      alert(res.data.message);

      setForm({
        fromAccountNumber: "",
        toAccountNumber: "",
        amount: "",
        description: "",
      });
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Transfer failed"
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Transfer</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="fromAccountNumber"
            placeholder="From Account"
            value={
              form.fromAccountNumber
            }
            onChange={handleChange}
            required
          />

          <input
            name="toAccountNumber"
            placeholder="To Account"
            value={
              form.toAccountNumber
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
            Transfer
          </button>
        </form>
      </div>
    </div>
  );
}