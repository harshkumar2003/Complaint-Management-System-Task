import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createComplaint } from "../services/api";
import "./SubmitComplaint.css";

export default function SubmitComplaint() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const res = await createComplaint({
        title,
        description,
        category,
      });

      // stop loading and show success
      setLoading(false);
      setMessage("✅ Complaint submitted successfully!");
      // clear form
      setTitle("");
      setDescription("");
      setCategory("General");

      // Redirect to complaints page after 1.5 seconds
      setTimeout(() => {
        navigate("/complaints");
      }, 1500);
    } catch (err) {
      // extract useful error info if available
      console.error("Submit complaint error:", err);
      let errMsg = "❌ Failed to submit complaint. Please try again.";
      if (err?.response?.data) {
        // common patterns: { message } or { error }
        errMsg = err.response.data.message || err.response.data.error || JSON.stringify(err.response.data);
      } else if (err?.message) {
        errMsg = err.message;
      }
      setError(errMsg);
      setLoading(false);
    }
  };

  const categoryOptions = [
    { value: "General", icon: "📋", description: "General inquiries and issues" },
    { value: "Infrastructure", icon: "🏗️", description: "Buildings, facilities, equipment" },
    { value: "Academics", icon: "📚", description: "Courses, exams, teaching" },
    { value: "Hostel", icon: "🏠", description: "Accommodation related" },
    { value: "Other", icon: "📌", description: "Everything else" },
  ];

  return (
    <div className="submit-container">
      <div className="submit-card">
        <div className="submit-header">
          <div className="header-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div>
            <h1 className="submit-title">Submit a Complaint</h1>
            <p className="submit-subtitle">Let us know about any issues you're facing</p>
          </div>
        </div>

        {message && <div className="success-alert">{message}</div>}
        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="submit-form">
          <div className="form-group">
            <label className="form-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Complaint Title
            </label>
            <input
              type="text"
              placeholder="Enter a brief title for your complaint"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Description
            </label>
            <textarea
              placeholder="Provide detailed information about your complaint..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="form-textarea"
              rows="6"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                <line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
              Category
            </label>
            <div className="category-grid">
              {categoryOptions.map((option) => (
                <label
                  key={option.value}
                  className={`category-option ${
                    category === option.value ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={option.value}
                    checked={category === option.value}
                    onChange={(e) => setCategory(e.target.value)}
                    className="category-radio"
                  />
                  <div className="category-content">
                    <span className="category-icon">{option.icon}</span>
                    <span className="category-name">{option.value}</span>
                  </div>
                  <span className="category-desc">{option.description}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/complaints")}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? (
                <>
                  <svg className="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 11 12 14 22 4"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                  Submit Complaint
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

