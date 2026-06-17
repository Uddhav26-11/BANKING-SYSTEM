export default function EmployeeDashboard() {
  return (
    <div className="dashboard-home">
      <div className="welcome-card">
        <h1>👨‍💻 Welcome to BANDHAN BANK</h1>

        <p>
          Manage customer services and daily banking
          operations efficiently through the sidebar.
        </p>

        <div className="welcome-info">
          <div className="info-box">
            <h3>👥 Customer Management</h3>
            <p>
              Access and manage customer details quickly.
            </p>
          </div>

          <div className="info-box">
            <h3>⚡ Daily Operations</h3>
            <p>
              Perform banking tasks smoothly and efficiently.
            </p>
          </div>

          <div className="info-box">
            <h3>🤝 Customer Support</h3>
            <p>
              Provide a better banking experience to customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}