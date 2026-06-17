import { useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import API from "../api/axios";

export default function Login() {
  const navigate = useNavigate();

  const { role } = useParams();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      setError("");

      setLoading(true);

      try {
        const res =
          await API.post(
            "/auth/login",
            {
              ...form,
              role,
            }
          );

        /*
        OTP sent successfully
        */

        navigate(
          "/verify-otp",
          {
            state: {
              email:
                res.data.data
                  .email,

              role,
            },
          }
        );
      } catch (err) {
        setError(
          err.response?.data
            ?.message ||
            "Login failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1 className="login-role">
          {role
            ? role.toUpperCase()
            : "LOGIN"}
        </h1>

        <h2 className="login-heading">
          Sign In
        </h2>

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <form
          onSubmit={
            handleSubmit
          }
        >
          <label className="input-label">
            Email
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter Email Address"
            value={
              form.email
            }
            onChange={
              handleChange
            }
            required
          />

          <label className="input-label">
            Password
          </label>

          <div className="password-wrapper">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Enter Password"
              value={
                form.password
              }
              onChange={
                handleChange
              }
              required
            />

            <span
              className="toggle-password"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              {showPassword
                ? "🙈"
                : "👁"}
            </span>
          </div>

          <button
            type="submit"
            disabled={
              loading
            }
          >
            {loading
              ? "Sending OTP..."
              : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}