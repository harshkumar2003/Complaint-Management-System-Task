import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome to CMS</h2>
          <p>Choose your portal to continue</p>
        </div>

        <div className="portal-selection">
          <button 
            className="portal-button user-portal"
            onClick={() => navigate("/login/user")}
          >
            <div className="portal-icon">👤</div>
            <h3>User Portal</h3>
            <p>Submit and track your complaints</p>
          </button>

          <button 
            className="portal-button admin-portal"
            onClick={() => navigate("/login/admin")}
          >
            <div className="portal-icon">⚙️</div>
            <h3>Admin Portal</h3>
            <p>Manage and resolve complaints</p>
          </button>
        </div>
      </div>
    </div>
  );
}