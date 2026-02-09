import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyComplaints } from "../services/api";
import "./ComplaintList.css";

export default function ComplaintList() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getMyComplaints();
      setComplaints(response.data || []);
    } catch (err) {
      setError("Failed to load complaints.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN":
        return "#fbbf24"; // yellow
      case "IN_PROGRESS":
        return "#60a5fa"; // blue
      case "RESOLVED":
        return "#34d399"; // green
      default:
        return "#9ca3af"; // gray
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "OPEN":
        return "Open";
      case "IN_PROGRESS":
        return "In Progress";
      case "RESOLVED":
        return "Resolved";
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "OPEN":
        return "⏳";
      case "IN_PROGRESS":
        return "🔄";
      case "RESOLVED":
        return "✅";
      default:
        return "📝";
    }
  };

  return (
    <div className="complaintList-container">
      <div className="header-section">
        <div className="header-content">
          <h1 className="page-title">My Complaints</h1>
          <p className="page-subtitle">Track and manage all your submitted complaints</p>
        </div>
        <button 
          className="cta-button"
          onClick={() => navigate("/submit")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Submit a Complaint
        </button>
      </div>

      {loading && <div className="loading-state">Loading complaints...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && complaints.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No complaints submitted yet</h3>
          <p>Start by submitting your first complaint</p>
          <button 
            className="cta-button"
            onClick={() => navigate("/submit")}
          >
            Submit a Complaint
          </button>
        </div>
      )}

      <div className="complaints-grid">
        {!loading &&
          complaints.map((complaint) => (
            <div key={complaint.id} className="complaint-card">
              <div className="card-header">
                <h3 className="complaint-title">{complaint.title}</h3>
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(complaint.status) }}
                >
                  <span className="status-icon">{getStatusIcon(complaint.status)}</span>
                  {getStatusLabel(complaint.status)}
                </span>
              </div>
              
              <p className="complaint-description">{complaint.description}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

