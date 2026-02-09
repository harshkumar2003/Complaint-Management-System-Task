import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllComplaints } from "../services/api";
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
      const response = await getAllComplaints();
      setComplaints(response.data || []);
    } catch (err) {
      setError("Failed to load complaints.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "SUBMITTED":
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
      case "SUBMITTED":
        return "Pending";
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
      case "SUBMITTED":
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

              <div className="card-footer">
                <span className="category-tag">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                    <line x1="7" y1="7" x2="7.01" y2="7"/>
                  </svg>
                  {complaint.category}
                </span>
              </div>

              {complaint.remarks && (
                <div className="remarks-section">
                  <div className="remarks-header">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <strong>Admin Response</strong>
                  </div>
                  <p className="remarks-text">{complaint.remarks}</p>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

