import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // change after deployment
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Local fallback key
const MOCK_KEY = "mock_complaints";

function loadMockComplaints() {
  try {
    const raw = localStorage.getItem(MOCK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveMockComplaints(list) {
  try {
    localStorage.setItem(MOCK_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn("Failed saving mock complaints", e);
  }
}

function saveMockComplaint(c) {
  const list = loadMockComplaints();
  list.unshift(c);
  saveMockComplaints(list);
}

// ---------- Complaint APIs (with local fallback) ----------

export const createComplaint = async (complaintData) => {
  try {
    const res = await api.post("/complaints", complaintData);
    return res;
  } catch (err) {
    // fallback: save to localStorage and return a mock response
    console.warn("API unavailable, saving complaint to local mock storage", err?.message || err);
    const mock = {
      id: `mock-${Date.now()}`,
      title: complaintData.title,
      description: complaintData.description,
      category: complaintData.category || "General",
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    saveMockComplaint(mock);
    return Promise.resolve({ data: mock });
  }
};

export const getAllComplaints = async () => {
  try {
    const res = await api.get("/complaints");
    return res;
  } catch (err) {
    console.warn("API unavailable, returning mock complaints", err?.message || err);
    const data = loadMockComplaints();
    return Promise.resolve({ data });
  }
};

export const getComplaintById = async (id) => {
  try {
    const res = await api.get(`/complaints/${id}`);
    return res;
  } catch (err) {
    const list = loadMockComplaints();
    const found = list.find((c) => String(c.id) === String(id));
    if (found) return Promise.resolve({ data: found });
    return Promise.reject(err);
  }
};

export const updateComplaintStatus = async (id, status, remarks) => {
  try {
    const res = await api.put(`/complaints/${id}/status`, {
      status,
      remarks,
    });
    return res;
  } catch (err) {
    // update mock if present
    const list = loadMockComplaints();
    const idx = list.findIndex((c) => String(c.id) === String(id));
    if (idx > -1) {
      list[idx].status = status;
      list[idx].remarks = remarks;
      saveMockComplaints(list);
      return Promise.resolve({ data: list[idx] });
    }
    return Promise.reject(err);
  }
};

export default api;