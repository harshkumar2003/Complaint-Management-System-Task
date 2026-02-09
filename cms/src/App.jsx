import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import UserLogin from "./pages/UserLogin";
import AdminLogin from "./pages/AdminLogin";
import SubmitComplaint from "./pages/SubmitComplaint";
import ComplaintList from "./pages/ComplaintList";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import "./App.css";

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname.startsWith("/login") || location.pathname === "/";

  return (
    <div className="app-container">
      {!isLoginPage && <Navbar />}
      
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          <Route path="/login/user" element={<UserLogin />} />
          <Route path="/login/admin" element={<AdminLogin />} />

          {/* User Routes */}
          <Route
            path="/submit"
            element={
              <ProtectedRoute role="USER">
                <SubmitComplaint />
              </ProtectedRoute>
            }
          />

          <Route
            path="/complaints"
            element={
              <ProtectedRoute role="USER">
                <ComplaintList />
              </ProtectedRoute>
            }
          />

          {/* Admin Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;