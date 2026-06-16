import { useNavigate } from "react-router-dom";

export default function RoleSelection() {
    const navigate = useNavigate();

    return (
        <div className="role-page">

            <div className="role-container">

                <div className="role-title">
                    <h2>BANDHAN BANK</h2>

                    <p>
                        Select Your Role
                    </p>
                </div>

                <div className="role-grid">

                    <div className="role-box">
                        <div className="role-icon manager-icon">
                            👨‍💼
                        </div>

                        <h3>Manager</h3>

                        <p>
                            Manage employees,
                            customers and bank operations.
                        </p>

                        <button
                            className="role-btn manager-btn"
                            onClick={() => navigate("/login/manager")}
                        >
                            Continue →
                        </button>
                    </div>


                    <div className="role-box">
                        <div className="role-icon employee-icon">
                            👨‍💻
                        </div>

                        <h3>Employee</h3>

                        <p>
                            Create and manage
                            customer accounts.
                        </p>

                        <button
                            className="role-btn employee-btn"
                            onClick={() => navigate("/login/employee")}
                        >
                            Continue →
                        </button>
                    </div>


                    <div className="role-box">
                        <div className="role-icon customer-icon">
                            👤
                        </div>

                        <h3>Customer</h3>

                        <p>
                            View your account
                            details and transactions.
                        </p>

                        <button
                            className="role-btn customer-btn"
                            onClick={() => navigate("/login/customer")}
                        >
                            Continue →
                        </button>
                    </div>

                </div>

                <div className="role-footer">
                    © 2024 Bandhan Bank. All rights reserved.
                </div>

            </div>

        </div>
    );
}