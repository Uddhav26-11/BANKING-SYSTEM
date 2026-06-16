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
    photo: "",
  });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      setForm({
        ...form,
        photo: files[0],
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        aadhaarNumber:
          form.aadhaarNumber,
        accountType:
          form.accountType,
        initialDeposit:
          Number(
            form.initialDeposit
          ),
      };

      const res = await API.post(
        "/manager/create-customer",
        payload
      );

      alert(res.data.message);

      setForm({
        fullName: "",
        email: "",
        password: "",
        aadhaarNumber: "",
        accountType: "savings",
        initialDeposit: "",
        photo: "",
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
            type="text"
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
            type="text"
            name="aadhaarNumber"
            placeholder="Aadhaar Number"
            value={form.aadhaarNumber}
            onChange={handleChange}
            maxLength={12}
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
            value={
              form.initialDeposit
            }
            onChange={handleChange}
            required
          />

          <input
            type="file"
            name="photo"
            accept="image/*"
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