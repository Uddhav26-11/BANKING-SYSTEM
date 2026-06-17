import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);

  const [editData, setEditData] = useState({
    fullName: "",
    email: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await API.get(
        "/manager/employees"
      );

      setEmployees(
        res.data.data.employees || []
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to load employees"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employee) => {
    setEditingId(employee._id);

    setEditData({
      fullName: employee.fullName,
      email: employee.email,
    });
  };

  const handleCancel = () => {
    setEditingId(null);

    setEditData({
      fullName: "",
      email: "",
    });
  };

  const handleSave = async (id) => {
    try {
      await API.put(
        `/manager/employees/${id}`,
        editData
      );

      toast.success(
        "Employee updated successfully"
      );

      setEditingId(null);

      fetchEmployees();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to update employee"
      );
    }
  };

  const toggleStatus = async (id) => {
    try {
      await API.patch(
        `/manager/employees/${id}/status`
      );

      toast.success(
        "Status updated successfully"
      );

      fetchEmployees();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to update status"
      );
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        Loading...
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Employees</h1>

      <table>
        <thead>
          <tr>
            <th>Name</th>

            <th>Email</th>

            <th>Status</th>

            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td>
                {editingId ===
                employee._id ? (
                  <input
                    type="text"
                    value={
                      editData.fullName
                    }
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        fullName:
                          e.target.value,
                      })
                    }
                  />
                ) : (
                  employee.fullName
                )}
              </td>

              <td>
                {editingId ===
                employee._id ? (
                  <input
                    type="email"
                    value={
                      editData.email
                    }
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        email:
                          e.target.value,
                      })
                    }
                  />
                ) : (
                  employee.email
                )}
              </td>

              <td>
                {employee.isActive ? (
                  <span
                    style={{
                      color: "green",
                      fontWeight:
                        "bold",
                    }}
                  >
                    🟢 Active
                  </span>
                ) : (
                  <span
                    style={{
                      color: "red",
                      fontWeight:
                        "bold",
                    }}
                  >
                    🔴 Inactive
                  </span>
                )}
              </td>

              <td>
                {editingId ===
                employee._id ? (
                  <>
                    <button
                      className="btn btn-success"
                      onClick={() =>
                        handleSave(
                          employee._id
                        )
                      }
                    >
                      💾 Save
                    </button>

                    {" "}

                    <button
                      className="btn btn-danger"
                      onClick={
                        handleCancel
                      }
                    >
                      ❌ Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn"
                      onClick={() =>
                        handleEdit(
                          employee
                        )
                      }
                    >
                      ✏️ Edit
                    </button>

                    {" "}

                    <button
                      className={
                        employee.isActive
                          ? "btn btn-danger"
                          : "btn btn-success"
                      }
                      onClick={() =>
                        toggleStatus(
                          employee._id
                        )
                      }
                    >
                      {employee.isActive
                        ? "🔴 Deactivate"
                        : "🟢 Activate"}
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}