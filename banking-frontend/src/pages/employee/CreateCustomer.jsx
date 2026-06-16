import { useState } from "react";
import API from "../../api/axios";

export default function CreateCustomer() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    aadhaarNumber: "",
    accountType: "savings",
    initialDeposit: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await API.post(
        "/employee/create-customer",
        {
          ...form,
          initialDeposit: Number(form.initialDeposit),
        }
      );

      alert(res.data.message);

      setForm({
        fullName: "",
        email: "",
        password: "",
        aadhaarNumber: "",
        accountType: "savings",
        initialDeposit: "",
      });
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to create customer"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Customer</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <input
            name="aadhaarNumber"
            placeholder="Aadhaar Number"
            value={form.aadhaarNumber}
            onChange={handleChange}
            required
          />

          <select
            name="accountType"
            value={form.accountType}
            onChange={handleChange}
          >
            <option value="savings">
              Savings
            </option>

            <option value="current">
              Current
            </option>
          </select>

          <input
            type="number"
            name="initialDeposit"
            placeholder="Initial Deposit"
            value={form.initialDeposit}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Customer"}
          </button>
        </form>
      </div>
    </div>
  );
}