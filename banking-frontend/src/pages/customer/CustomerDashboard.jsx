export default function CustomerDashboard() {
  return (
    <div className="dashboard-home">
      <div className="welcome-card">
        <h1>👋 Welcome to BANDHAN BANK</h1>

        <p>
          Access your accounts, monitor transactions,
          and enjoy secure digital banking.
        </p>

        <div className="welcome-info">
          <div className="info-box">
            <h3>🏦 My Accounts</h3>
            <p>
              View all your account details anytime.
            </p>
          </div>

          <div className="info-box">
            <h3>📜 Transactions</h3>
            <p>
              Track your complete transaction history.
            </p>
          </div>

          <div className="info-box">
            <h3>🔐 Secure Banking</h3>
            <p>
              Your data and money are protected with us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}