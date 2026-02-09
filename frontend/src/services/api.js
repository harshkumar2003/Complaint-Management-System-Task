import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api/v1";

const api = axios.create({
  baseURL: apiBaseUrl, // change after deployment
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// ---------- Complaint APIs ----------

export const createComplaint = async (complaintData) => {
  const res = await api.post("/complaints", complaintData);
  return res;
};

export const getMyComplaints = async () => {
  const res = await api.get("/complaints/user");
  return res;
};

export const getAdminComplaints = async () => {
  const res = await api.get("/admin/complaints");
  return res;
};

export const updateComplaintStatus = async (id, status) => {
  const res = await api.put(`/admin/complaints/${id}/status`, {
    status,
  });
  return res;
};

// -------------------- Auth APIs --------------------
export const authRegister = async (registerData) => {
  try {
    const res = await api.post("/auth/register", registerData);
    return res;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const authLogin = async (loginData) => {
  try {
    const res = await api.post("/auth/login", loginData);
    const data = res.data;
    if (data?.token) {
      localStorage.setItem("token", data.token);
    }
    if (data?.role) {
      localStorage.setItem("role", data.role);
    }
    if (data?.id) {
      localStorage.setItem("userId", data.id);
    }
    // set axios default header
    if (data?.token) api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    return res;
  } catch (err) {
    return Promise.reject(err);
  }
};

// attach token from localStorage on each request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;
