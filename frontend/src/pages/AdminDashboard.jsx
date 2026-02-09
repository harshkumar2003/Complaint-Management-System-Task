import { useEffect, useMemo, useState } from "react";
import { getAdminComplaints, updateComplaintStatus } from "../services/api";
import "./AdminDashboard.css";

function statusKey(s) {
  if (!s) return "open";
  const k = String(s).toLowerCase();
  if (k.includes("resolv")) return "resolved";
  if (k.includes("progress")) return "in_progress";
  return "open";
}

function statusLabel(s) {
  if (!s) return "Open";
  const k = String(s).toUpperCase();
  if (k === "IN_PROGRESS") return "In Progress";
  if (k === "RESOLVED") return "Resolved";
  return "Open";
}

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [updatingMap, setUpdatingMap] = useState({});

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAdminComplaints();
      setComplaints(res.data || []);
    } catch (error) {
      setError("Failed to load complaints.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return complaints.filter((c) => {
      if (filter !== "all") {
        if (statusKey(c.status) !== filter) return false;
      }
      if (!q) return true;
      return (
        String(c.title || "").toLowerCase().includes(q) ||
        String(c.description || "").toLowerCase().includes(q)
      );
    });
  }, [complaints, query, filter]);

  const handleUpdate = async (id, status) => {
    setUpdatingMap((m) => ({ ...m, [id]: true }));
    try {
      await updateComplaintStatus(id, status);
      await fetchComplaints();
    } catch (error) {
      console.error("Admin update error:", error);
    } finally {
      setUpdatingMap((m) => ({ ...m, [id]: false }));
    }
  };

  const handleResolve = async (complaint) => {
    const confirmed = window.confirm(
      `Mark complaint "${complaint.title}" as resolved?`
    );
    if (!confirmed) return;
    await handleUpdate(complaint.id, "RESOLVED");
  };

  return (
    <div className="adminDashboard-root">
      <div className="adminDashboard-header">
        <h2>Admin Dashboard</h2>
        <div className="admin-controls">
          <input
            placeholder="Search complaints..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <button className="refresh-btn" onClick={fetchComplaints}>
            Refresh
          </button>
        </div>
      </div>

      {error && <div className="center error-message">{error}</div>}
      {loading ? (
        <div className="center">Loading complaints...</div>
      ) : filtered.length === 0 ? (
        <div className="center">No complaints found.</div>
      ) : (
        <div className="complaint-grid">
          {filtered.map((c) => (
            <div key={c.id} className="complaint-card">
              <div className="card-top">
                <div>
                  <h3 className="card-title">{c.title}</h3>
                  <div className="meta">
                    <span className="date">{new Date(c.createdAt || Date.now()).toLocaleString()}</span>
                  </div>
                </div>
                <div className={`status-badge ${statusKey(c.status)}`}>
                  {statusLabel(c.status)}
                </div>
              </div>

              <p className="card-desc">{c.description}</p>

              <div className="card-actions">
                <button
                  className="resolve-btn"
                  onClick={() => handleResolve(c)}
                  disabled={statusKey(c.status) === "resolved" || !!updatingMap[c.id]}
                >
                  {updatingMap[c.id] ? "Resolving..." : statusKey(c.status) === "resolved" ? "Resolved" : "Resolve"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

  
