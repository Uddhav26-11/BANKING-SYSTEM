import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { role } = useParams();

  const [form, setForm] = useState({
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
      const res = await API.post("/auth/login", {
        ...form,
        role,
      });

      const user = res.data.data.user;
      const token = res.data.data.token;

      login(user, token);

      if (user.role === "manager") {
        navigate("/manager");
      } else if (user.role === "employee") {
        navigate("/employee");
      } else {
        navigate("/customer");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed"
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>
          {role
            ? `${role.toUpperCase()} Sign In`
            : "Sign In"}
        </h2>

        <p className="login-subtitle">
          Access your secure banking portal
        </p>

        {error && (
          <p className="error">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}