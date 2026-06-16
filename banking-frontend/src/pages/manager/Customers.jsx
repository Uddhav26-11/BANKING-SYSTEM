import {
  useEffect,
  useState,
} from "react";

import API from "../../api/axios";
import toast from "react-hot-toast";

export default function Customers() {
  const [customers, setCustomers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers =
    async () => {
      try {
        const res =
          await API.get(
            "/manager/customers"
          );

        setCustomers(
          res.data.data.customers || []
        );
      } catch (err) {
        toast.error(
          err.response?.data?.message ||
          "Failed to load customers"
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
      <h1>Customers</h1>

      <table>
        <thead>
          <tr>
            <th>Name</th>

            <th>Email</th>

            <th>Aadhaar</th>

            <th>Account No.</th>

            <th>Type</th>

            <th>Balance</th>

            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => {
            const account =
              customer.accounts?.[0];

            return (
              <tr
                key={customer._id}
              >
                <td>
                  {customer.fullName}
                </td>

                <td>
                  {customer.email}
                </td>

                <td>
                  {customer.aadhaarNumber ||
                    "-"}
                </td>

                <td>
                  {account?.accountNumber ||
                    "-"}
                </td>

                <td>
                  {account?.accountType ||
                    "-"}
                </td>

                <td>
                  ₹
                  {account?.balance ??
                    0}
                </td>

                <td>
                  {customer.isActive
                    ? "Active"
                    : "Inactive"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}