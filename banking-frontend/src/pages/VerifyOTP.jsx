import { useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const email =
    location.state?.email;

  const role =
    location.state?.role;

  const [otp, setOtp] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  if (!email) {
    navigate("/");
    return null;
  }

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      setError("");
      setLoading(true);

      try {
        const res =
          await API.post(
            "/auth/verify-otp",
            {
              email,
              otp,
            }
          );

        const user =
          res.data.data.user;

        const token =
          res.data.data.token;

        login(user, token);

        if (
          user.role ===
          "manager"
        ) {
          navigate("/manager");
        } else if (
          user.role ===
          "employee"
        ) {
          navigate("/employee");
        } else {
          navigate("/customer");
        }
      } catch (err) {
        setError(
          err.response?.data
            ?.message ||
            "Invalid OTP"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>
          Verify OTP
        </h2>

        <p>
          OTP sent to:
          <br />
          <strong>
            {email}
          </strong>
        </p>

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
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) =>
              setOtp(
                e.target.value
              )
            }
            maxLength={6}
            required
          />

          <button
            type="submit"
            disabled={
              loading
            }
          >
            {loading
              ? "Verifying..."
              : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}