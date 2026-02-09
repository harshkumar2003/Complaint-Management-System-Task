import { useEffect, useMemo, useState } from "react";
import {
  getAllComplaints,
  updateComplaintStatus,
} from "../services/api";
import "./AdminDashboard.css";

const STATUS_OPTIONS = ["Pending", "In Progress", "Resolved"];

function statusKey(s) {
  if (!s) return "pending";
  const k = String(s).toLowerCase();
  if (k.includes("resolv")) return "resolved";
  if (k.includes("progress")) return "in_progress";
  return "pending";
}

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [remarksMap, setRemarksMap] = useState({});
  const [updatingMap, setUpdatingMap] = useState({});
  const [disabledMap, setDisabledMap] = useState({});

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await getAllComplaints();
      setComplaints(res.data || []);
    } catch (error) {
      setMessage("❌ Failed to load complaints");
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
        String(c.description || "").toLowerCase().includes(q) ||
        String(c.category || "").toLowerCase().includes(q)
      );
    });
  }, [complaints, query, filter]);

  const handleUpdate = async (id, status, remarks) => {
    setUpdatingMap((m) => ({ ...m, [id]: true }));
    try {
      await updateComplaintStatus(id, status, remarks);
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
    const remarks = remarksMap[complaint.id] || complaint.remarks || "";
    setDisabledMap((m) => ({ ...m, [complaint.id]: true }));
    await handleUpdate(complaint.id, "RESOLVED", remarks);
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
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <button className="refresh-btn" onClick={fetchComplaints}>
            Refresh
          </button>
        </div>
      </div>

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
                    <span className="category">{c.category || "General"}</span>
                    <span className="date">{new Date(c.createdAt || Date.now()).toLocaleString()}</span>
                  </div>
                </div>
                <div className={`status-badge ${statusKey(c.status)}`}>
                  {String(c.status || "Pending")}
                </div>
              </div>

              <p className="card-desc">{c.description}</p>

              <div className="card-actions">
                <select
                  value={c.status || "Pending"}
                  disabled
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <input
                  className="remarks-input"
                  placeholder="Admin remarks"
                  value={remarksMap[c.id] ?? c.remarks ?? ""}
                  onChange={(e) => setRemarksMap((m) => ({ ...m, [c.id]: e.target.value }))}
                  disabled={statusKey(c.status) === "resolved" || !!disabledMap[c.id]}
                />

                <button
                  className="resolve-btn"
                  onClick={() => handleResolve(c)}
                  disabled={statusKey(c.status) === "resolved" || !!updatingMap[c.id] || !!disabledMap[c.id]}
                >
                  {updatingMap[c.id] ? "Resolving..." : statusKey(c.status) === "resolved" || disabledMap[c.id] ? "Resolved" : "Resolve"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

  