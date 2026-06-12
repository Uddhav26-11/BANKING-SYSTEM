import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await API.post("/auth/register", form);

      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error("Register Error:", err.response?.data);

      setError(
        err.response?.data?.message ||
        "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="auth-page">
      <h2>Create Account</h2>

      {error && <p className="error">{error}</p>}

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
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password (min 8 characters)"
          value={form.password}
          onChange={handleChange}
          required
          minLength={8}
        />

        <button type="submit">Register</button>
      </form>

      <p>
        Already registered? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}