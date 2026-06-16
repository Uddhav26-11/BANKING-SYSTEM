import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function EmployeeProfile() {
  const [profile, setProfile] =
    useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get(
        "/users/profile"
      );

      setProfile(
        res.data.data.user
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to load profile"
      );
    }
  };

  if (!profile) {
    return (
      <div className="page-container">
        Loading...
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>My Profile</h1>

      <div className="card">
        <p>
          <strong>Name:</strong>{" "}
          {profile.fullName}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {profile.email}
        </p>

        <p>
          <strong>Role:</strong>{" "}
          {profile.role}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {profile.isActive
            ? "Active"
            : "Inactive"}
        </p>
      </div>
    </div>
  );
}