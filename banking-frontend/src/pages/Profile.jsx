import { useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [msg, setMsg] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await API.patch("/users/change-password", passwords);
      setMsg("Password changed successfully.");
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="page">
      <h2>Profile</h2>
      <p><strong>Name:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>

      <h3>Change Password</h3>
      {msg && <p>{msg}</p>}
      <form onSubmit={handlePasswordChange}>
        <input
          type="password"
          placeholder="Current Password"
          onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
        />
        <input
          type="password"
          placeholder="New Password"
          onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
        />
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
}