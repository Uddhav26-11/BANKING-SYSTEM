import {
  useEffect,
  useState,
} from "react";

import API from "../../api/axios";

export default function Employees() {
  const [employees, setEmployees] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees =
    async () => {
      try {
        const res =
          await API.get(
            "/manager/employees"
          );

        setEmployees(
          res.data.data.employees ||
            []
        );
      } catch (err) {
        alert(
          err.response?.data
            ?.message ||
            "Failed to load employees"
        );
      } finally {
        setLoading(false);
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
          </tr>
        </thead>

        <tbody>
          {employees.map(
            (employee) => (
              <tr
                key={employee._id}
              >
                <td>
                  {
                    employee.fullName
                  }
                </td>

                <td>
                  {employee.email}
                </td>

                <td>
                  {employee.isActive
                    ? "Active"
                    : "Inactive"}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}